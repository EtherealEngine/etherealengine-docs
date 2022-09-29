# How to set up GitHub to install external private projects

Ethereal Engine is extensible via [Projects](../3_concepts/1_projects_api.md), which can contain
new scenes, new avatars, new static resources, additional code, and more. Ethereal Engine integrates
with GitHub to push and pull projects for backup and restoration, and one can also install existing
projects from GitHub. In order to install projects from private repositories, or to push local project 
changes to a GitHub repo, a GitHub App that you control must be created, configured,
and installed in both the organizations/users you wish to have access to and the Ethereal Engine
deployment[^1].

A useful side effect of this is that you will be able to log in via GitHub, as all of the OAuth logic
is included in a GitHub app.

Note that it is recommended that you complete most of this before the initial installation of
your deployment, so that you can log in via GitHub and be granted admin status as the first
logged-in user. If you do not, then you will either need to manually insert some of these values
into the database so that you can log yourself in; have another log method configured already
and use that logged-in admin user; or reset the database with these values configured in the
updated Helm configuration that is used for the reset. 

[^1] You don't technically need to install the app in your repos, but it makes managing pushing to
  GitHub much easier. The mechanics are as follows:

  * Any user who is logged in with GitHub, which is done through the GitHub app's OAuth capapbilities,
    will have the repos that they have admin or write access to checked.
    If the user has admin and project:write scopes in Ethereal Engine, they can push any projects that 
    are linked to a repo that they have owner access to.
  * The GitHub app, when installed into a GitHub repo, will gain certain permissions over that repo.
    A user with admin and project:write scopes in Ethereal Engine, even if they don't have GitHub access to a repo,
    can install a project from, and push a project to, a GitHub repo that the GitHub app is installed in. In these
    situations, the Ethereal Engine project API is using the GitHub app's credentials to perform the actions,
    rather than a user's personal credentials.

  So, while it is possible to manage GitHub project integration without installing the GitHub app into any repos,
  it requires that all project owners be logged in via GitHub and have admin/write access to the repositories.

  If you install a project from a public repository that you do not have admin/write access to, and which the GitHub
  app is not installed in, it will download just fine, but it will not automatically create a deployment branch in that repo,
  nor will you be able to push changes to that repo. If you wish to back up up your changes, it is recommended that
  you clone the repo and use that as the source repository.

## Create a GitHub App in an organization, or your user

You can either create a GitHub App for your personal GitHub account or for an organization that
you have sufficient permissions on. Either will work for this setup.

The general instructions for doing this can be found [here](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app).
The specifics you'll need to enter are as follows:

* GitHub App name: Anything you want
* Homepage URL: Whatever you want, this is just what is linked to from the OAuth authorization page
* Callback URL: enter `https://api.<domain>/oauth/github`, e.g. `https://api.example.com/oauth/github`
* Uncheck `Expire user authorization tokens`. As of this writing, Ethereal Engine does not handle refreshing OAuth credentials
* Uncheck `Webhook -> Active`
* Select the following Repository permissions:
  * Administration: Read and Write
  * Contents: Read and Write
  * Metadata: Read-only
  * Pull Requests: Read and Write
* Select the following Organization permissions
  * Members: Read-only
* Under `Where can this GitHub App be installed`, select `Any account` if you want to let this
  app be installed outside of just the organization/user that owns it, i.e. to have access to other
  organizations'/users' repos. If you select `Only on this account`, it will only be installable
  on that account, but this can be changed after creation.

## Create client secret and private key, note App ID and Client ID

Once the app has been created, you will be redirected to the General setting for it.
Here, you will generate two credentials for the app, so that your deployment can be authenticated.

### Make note of App ID and Client ID
Near the top of this page are the App ID and Client ID for the app. These are public IDs for the app.
They will be used when configuring Ethereal Engine.

### Generate client secret
Above `Basic information` is a section `Client secrets`. None are created by default, so click the
button `Generate a new client secret`. As the notifications that appear say, you will only see the
full secret right now, so copy it somewhere retrievable (but not anywhere publicly accessible). If 
you ever lose the secret, you can always generate a new one.

### Generate private key
Towards the bottom of the General settings is a section `Private keys`. None of these are created by
default. Click on the button `Generate a private key`, and a .pem file will be downloaded.

## Configure Ethereal Engine deployment with IDs/keys

### Pre-initial installation 
If you have not done the initial installation/deployment yet, then you can add most of the values
above to the Helm configuration, and they will be inserted into the database so that GitHub login
is enabled from the start, and you can then log in via GitHub and be granted admin status.

Enter the App ID for GITHUB_APP_ID, the Client ID for GITHUB_CLIENT_ID, and the Client secret for
GITHUB_CLIENT SECRET in the section `api.extraEnv`. It is advised that you enclose all of these in
double quotes in the .yaml file, so that they are interpreted as strings even if they start with a
number, e.g. `GITHUB_APP_ID: "175925"`

Continue with the setup instructions. When you run `helm install` with your configuration file, the
GitHub credentials will be included.

### Post-installation, if you have another authentication method configured
If you have already installed the platform but configured it with another login method, such as
email or another OAuth provider, then log in as an admin user. If you haven't logged in with anything
yet, then the first user that logs in will be made an admin.

Go to `/admin/settings`. Click on the `Authentication` selector. A page should open with a
section `OAuth` that takes up the bottom two-thirds. Under `GitHub`, enter the App ID under `App Id`,
the Client ID under `Key`, and the Client Secret under `Secret`. Click the Save button at the bottom.

### Post-installation, if you do not have any authentication method configured
If you have already set up the platform but did not configure any authentication method, 
then you are in a bit of a bind where you can't log in to get admin privileges, but need admin
privileges to configure an authentication method. The way around this is to reset the database
and provide the GitHub credentials as part of this process - this is similar to what would happen
on initial installation. Note that this will erase anything you've done so far, but without any
admins, the most you'd have been likely to do is change some guest users' avatars.

Open your Helm configuration. Enter the App ID for GITHUB_APP_ID, the Client ID for GITHUB_CLIENT_ID, and the Client secret for
GITHUB_CLIENT SECRET in the section `api.extraEnv`. It is advised that you enclose all of these in
double quotes in the .yaml file, so that they are interpreted as strings even if they start with a
number, e.g. `GITHUB_APP_ID: "175925"`

Next, run `helm upgrade --reuse-values -f <path/to/configuration.yaml> --set-string api.extraEnv.FORCE_DB_REFRESH=true <stage_name> xrengine/xrengine`.
This tells Helm to restart the API servers, and for them to wipe the database and reseed it with the values
in the configuration file. It should only take a minute or two, and you should then run
`helm upgrade --reuse-values --set-string api.extraEnv.FORCE_DB_REFRESH=false <stage_name> xrengine/xrengine` to unset
the flag telling it to reset the database.

Once this is done, you should be able to log in with GitHub and be granted admin status.

## Configure Ethereal Engine deployment with private key

Regardless of how you configured the App ID/Client ID/Client secret, you should be able to log
in and be an admin user (or grant admin status to another user). 

As an admin, go to /admin/settings, then click on the `Server` selector. In the right-hand column,
you should see a field near the bottom named `Github Private Key`. You will need to copy/paste 
the contents of the .pem file you downloaded earlier here. Note that this needs to be the entire
text contents of the file; there is currently no option to upload the file. It is simplest to open the file in some
sort of text editor, then press Ctrl+A to select the entire contents, then Ctrl+C to copy that selection,
then click over to the admin page, click this text box, and Ctrl+V to paste the contents
(substitute Apple Key+\<key\> for Macs). It must begin with `-----BEGIN RSA PRIVATE KEY----- <start of tons of letters>` 
and end with `<end of tons of letters> -----END RSA PRIVATE KEY-----`. Click the Save button once you have
pasted it in.

# Installing Ethereal Engine projects from GitHub

See [the section 'Graphical Install Flow](../3_concepts/1_projects_api.md) for more information on how to install
projects from GitHub.