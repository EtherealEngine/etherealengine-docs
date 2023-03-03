# How to set up GitHub to install external projects

Ethereal Engine is extensible via [Projects](../3_concepts/1_projects_api.md), which can contain
new scenes, new avatars, new static resources, additional code, and more. Ethereal Engine integrates
with GitHub to push and pull projects for backup and restoration, and one can also install existing
projects from GitHub. In order to install projects from private repositories, or to push local project 
changes to a GitHub repo, an OAuth app from GitHub (not a GitHub app, that is something different) needs to be
created, and the logged-in user must be connected in Ethereal Engine to GitHub (i.e. must have logged in via
GitHub at some point) and have permission to access the source and destination repositories.

Note that it is recommended that you complete most of this before the initial installation of
your deployment, so that you can log in via GitHub and be granted admin status as the first
logged-in user. If you do not, then you will either need to manually insert some of these values
into the database so that you can log yourself in; have another log method configured already
and use that logged-in admin user; or reset the database with these values configured in the
updated Helm configuration that is used for the reset.

## Create a GitHub OAuth App in an organization, or your user

You can either create an OAuth App for your personal GitHub account or for an organization that
you have sufficient permissions on. Either will work for this setup.

The general instructions for doing this can be found [here](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).
The specifics you'll need to enter are as follows:

* Application name: Anything you want
* Homepage URL: Whatever you want, this is just what is linked to from the OAuth authorization page
* Authorization callback URL: enter `https://api.<domain>/oauth/github/callback`, e.g. `https://api.example.com/oauth/github/callback`
* Enable Device Flow: Leave unchecked

## Create client secret, note Client ID

Once the app has been created, you will be redirected to the General settings for it.
Here, you will generate one credential for the app, so that your deployment can be authenticated.

### Make note of Client ID
Near the top of this page is the Client ID for the app. This is a public ID for the app.
It will be used when configuring Ethereal Engine.

### Generate client secret
Below `Client ID` is a section `Client secrets`. None are created by default, so click the
button `Generate a new client secret`. As the notifications that appear say, you will only see the
full secret right now, so copy it somewhere retrievable (but not anywhere publicly accessible). If 
you ever lose the secret, you can always generate a new one.

## Configure Ethereal Engine deployment with IDs/keys

### Pre-initial installation 
If you have not done the initial installation/deployment yet, then you can add most of the values
above to the Helm configuration, and they will be inserted into the database so that GitHub login
is enabled from the start, and you can then log in via GitHub and be granted admin status.

Enter the Client ID for `GITHUB_CLIENT_ID`, and the Client secret for
`GITHUB_CLIENT SECRET` in the section `api.extraEnv`. It is advised that you enclose all of these in
double quotes in the .yaml file, so that they are interpreted as strings even if they start with a
number, e.g. `GITHUB_CLIENT_ID: "17592577832789234"` If you see `GITHUB_APP_ID`, it is not used; 
it is left over from a prior implementation of GitHub Apps, which no longer works.

Continue with the setup instructions. When you run `helm install` with your configuration file, the
GitHub credentials will be included.

### Post-installation, if you have another authentication method configured
If you have already installed the platform but configured it with another login method, such as
email or another OAuth provider, then log in as an admin user. If you haven't logged in with anything
yet, then the first user that logs in will be made an admin.

Go to `/admin/settings`. Click on the `Authentication` selector. A page should open with a
section `OAuth` that takes up the bottom two-thirds. Under `GitHub`, enter
the Client ID under `Key` and the Client Secret under `Secret`. Click the Save button at the bottom.

### Post-installation, if you do not have any authentication method configured
If you have already set up the platform but did not configure any authentication method, 
then you are in a bit of a bind where you can't log in to get admin privileges, but need admin
privileges to configure an authentication method. The way around this is to reset the database
and provide the GitHub credentials as part of this process - this is similar to what would happen
on initial installation. Note that this will erase anything you've done so far, but without any
admins, the most you'd have been likely to do is change some guest users' avatars.

Open your Helm configuration. Enter the Client ID for `GITHUB_CLIENT_ID` and the Client secret for
`GITHUB_CLIENT SECRET` in the section `api.extraEnv`. It is advised that you enclose all of these in
double quotes in the .yaml file, so that they are interpreted as strings even if they start with a
number, e.g. `GITHUB_CLIENT_ID: "17592577832789234"`

Next, run `helm upgrade --reuse-values -f <path/to/configuration.yaml> --set-string api.extraEnv.FORCE_DB_REFRESH=true <stage_name> etherealengine/etherealengine`.
This tells Helm to restart the API servers, and for them to wipe the database and reseed it with the values
in the configuration file. It should only take a minute or two, and you should then run
`helm upgrade --reuse-values --set-string api.extraEnv.FORCE_DB_REFRESH=false <stage_name> etherealengine/etherealengine` to unset
the flag telling it to reset the database.

Once this is done, you should be able to log in with GitHub and be granted admin status.

# Logging in with GitHub and Granting Access to Other Organizations

When you log in with GitHub, you will be asked to grant access to your user information as well as the repositories
that the OAuth app has authorized for. Ethereal Engine will have access to your personal repositories and,
if the OAuth app was created in a GitHub organization, all repositories in that organization. It will not
have inherent push access to other organizations' repositories or pull access to their private repositories.

There are two ways to grant access to other repositories. When you are first signing in via GitHub and are
presented with the screen to authorize the OAuth app's permissions, you should see a section near the bottom
that shows all of the organizations you are in. If you have admin rights to that organization, you can Grant
access. If you do not have admin rights, then you can Request access, and someone who does have admin rights
will have to approve it.

![](./images/oauth-login-screen.png)

If you have already gone through the OAuth approval page, it will not be shown again - all subsequent logins
will bypass this page[^1]. In order to grant the OAuth app access to other organizations, follow
[these steps](https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/approving-oauth-apps-for-your-organization)

In short form:

1. Go to (https://github.com/settings/applications)
2. Click on the name of the OAuth app installed in Ethereal Engine
3. Under `Organization access`, click on Grant/Request for the organizations you want Ethereal Engine to
   have access to

# Installing Ethereal Engine projects from GitHub

See [the section 'Graphical Install Flow](../3_concepts/1_projects_api.md) for more information on how to install
projects from GitHub.

# User Repo Access to GitHub (with optional webhooks)

Users can push projects to GitHub if they have write/maintain/admin access to the associated GitHub repository.
Since fetching this access from the GitHub API every time a user fetches their projects can take a noticeable
amount of time, Ethereal Engine stores users' GitHub repo access in its database. This is much faster to access.

There are multiple actions that will make the engine re-fetch and update users' repo access:

* When a user logs in via GitHub
* When a user clicks on the button "Refresh GitHub Repo Access" on /admin/projects or /studio (must be logged
  in as a user that is associated with a GitHub account)
* Via a GitHub webhook - must manually configure this

## Setting up GitHub webhook
Ethereal Engine currently only supports webhook notifications for Collaborators being added/edited/removed. 
Changes in Teams are not handled by Ethereal Engine due to the opacity of team members. (Team change webhooks do not 
include team members, and the engine does not track who is in a team)

An admin needs to go to /admin/settings, click on 'Server', then enter a secret key in the field 
"GitHub Webhook Secret", then click the Save button. The secret can be any string you make up.
Randomly generated strings are encouraged.

Next, go to GitGub. In the Repository or Organization that you want to send updates for, go to
Settings -> Code(, planning,) and automation -> Webhooks, then click "Add webhook".

For Payload URL, enter `<your_api_subdomain>/github-repo-access-webhook`, e.g. `https://api.example.com/github-repo-access-webhook`
Set Content Type to `application/json`. For Secret, enter the secret from the earlier step. For
"Which events would you like to trigger this webhook?", select "Let me select individual events."
In the list of events that appears, uncheck "Pushes", anf check "Collaborator add, remove, or changed".
At the very bottom of the page, click the green button "Add webhook".

After the webhook is created, the webhook will send a ping request to the API endpoint you provided. If the URL
was entered correctly, and the secret was entered correctly in both ends, the ping should get a 200 response.
You can check the status under the "Recent Deliveries" tab of that webhook on GitHub.

When this is working, whenever a user is added, removed, or has their access modified, the engine
will re-fetch the user's full set of GitHub repo accesses and update the database's records.