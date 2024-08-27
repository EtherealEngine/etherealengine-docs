# Deploy to DO using Helm

With all of the networking set up, you can finally deploy the codebase to Digital Ocean.
There's a couple of steps to this, which will involve deploying things with most but not all of the needed
configuration values, and then letting the deployment process fill in the rest.

## Fill in Helm config file with variables
Template Helm config files for dev and prod deployments can be found in [configs](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs) \<dev/prod\>.template.values.yaml.
Before filling them in, make a copy elsewhere, call that '\<dev/prod\>.values.yaml', and edit that copy.
Both the builder and main deployments should use the same config file. When the builder seeds the database,
it needs a number of values that only need to be configured for the other services, so all of the values
need to be defined in one config file.

There are many fields to fill in, most marked with `\<>`. Not all are necessary for all situations - if you're not
using social login, for instance, you don't need credentials for Github/Google/Facebook/etc.

## Changes in Configuration variables
Here are some configuration variables that you'll probably need to change based on your specific setup

#### \<api/instanceserver/taskserver\>.extraEnv.AUTH_SECRET
This is a secret value that is used to sign the JWTs that authenticate users.
You can use any string for this value, and a randomly-generated one of sufficient length,
i.e. 32 or more characters, will suffice. If this is changed after some users have signed
in, their login credentials won't work any more.

#### \<api/client/taskserver\>.affinity.nodeAffinity
Within the sections of the config for the api, client, instanceserver, etc., is a section that looks 
something like this:
```
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: doks.digitalocean.com/node-pool
                operator: In
                values:
                  - np
```

The value, `np` in this example, must be changed to match whatever the name of the nodepool that 
that service will be running on, e.g. if you create a nodepool for the instanceservers called
`abcd-instanceservers-5`, then you'd use that value under `values:`

#### builder.extraEnv.PRIVATE_ECR
If you're using a private ECR repo, set this to "true" in the builder config file.

#### (everything).image.repository
You'll need to replace every \<repository_name\> with the full DOCR_URL of your non-builder repos, e.g. `registry.digitalocean.com/etherealengine/etherealengine-dig-api`.
Each service has to have the proper `-\<service>` suffix on it, e.g. `-instanceserver`, `-client`, etc.

#### GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET
If you plan to backup Projects you create in the editor to GitHub, or install project from GitHub, it is necessary 
to set up the OAuth app that will facilitate this before the initial installation. 
See [this document](./4_setup_github_oauth_for_projects.md) for
more information, and enter the appropriate ID/secret in these variables.

### Pulling/pushing images from private DOCR
The Digital Ocean container register is a private registory and has private repositores which menas that you will have to define an image Pull Secret in the DO cluster and update its values in the Values.yaml file so that various parts of Ethereal Engine are abel to download and upload the images to the DOCR. This should be part of the helm chart evenutually but at the time of writing this document this is done mannually. You can create an image pull secret by running the following command. 

```
kubectl create secret generic \<secret-name> \
    --from-literal=username=\<do-username> \
    --from-literal=password=\<do-password>

```

### Run Helm install
Run `helm install -f \</path/to/\<RELEASE_NAME>.values.yaml> \<RELEASE_NAME>-builder etherealengine/etherealengine-builder`
and then run `helm install -f \</path/to/\<RELEASE_NAME>.values.yaml> \<RELEASE_NAME> etherealengine/etherealengine`

This will spin up the main and builder deployments using the Helm config file, \<dev/prod\>.values.yaml.
Neither will fully work yet, since there's no valid image in the repos yet. The GitHub
Actions and builder processes will make those images and update the deployments with the tags of the images they've built
so that they can pull down and use those images.