# Ethereal Engine on AWS
In this section you will learn how to setup Ethereal Engine with DO.

> Note:  
The value `RELEASE_NAME` referenced throughout this guide is the name of the deployment  
e.g. `dev` or `prod` and `DO` stands for  `Digital Ocean`


# Create DO Kubernetes cluster with four nodepools
You will first need to create a DO Kubernetes cluster cluster to be able to install the EE onto it. There are three different ways in DO with which you can create a kubernetes cluster, these are as following.
* Using DO CLI called ```doctl```.
* Using DO API
* Using DO Control Panel

To create a DO cluster with DO CLI you will have to do the following. 
* Install the Digital Ocean CLI called ```doctl``` using the instructions mentioned [here](https://docs.digitalocean.com/reference/doctl/how-to/install/).
* Create a new Personal Access Token (PAT). You can follow the instructions mentioned [here](https://docs.digitalocean.com/reference/api/create-personal-access-token/)
* Run command ```doctl auth init``` and provide the PAT generated above to grant access to ```doctl```
* Next run the following command 
```doctl kubernetes cluster create <name> --version <version> --region <region>```. This will create a cluster in the region of your choise. This will automatically create a Virtual Private Cloud or VPC for you while the cluster creates. There are other flags that you can give to this command and you can look at all those flags [here](https://docs.digitalocean.com/reference/doctl/reference/kubernetes/cluster/create/).

Once the cluster is up and ready you can start adding node pools to it. 

## create the main nodepool
You will have to create a nodepool where the API and other key services/pods of the Ethereal Engine will be residing. To create a new noodpool go to to your newly created [kubernetes cluster](https://cloud.digitalocean.com/kubernetes/clusters). Go to Cluster -> Resources -> Add a Node Pool. You can give it a name like ```np-main``` and recommended size is ```General Purpose - 2vCPU 8 GB RAM```, but you could always alter the size based on your needs. Once that is done we also would need to enable autoscaling, you can do that by ticking the box called ```Autoscale``` and then setting the Minimum Nodes to 3 and Maximum Nodes to 10. After adding these settings click the ```Add Node Pool(s)``` button at the bottom and it should take a few minutes and the nodepool should be created.

## Create nodepool for instanceserver
You will need to create a nodepool where instance servers will be residing. To create a new noodpool on [DO Website](https://cloud.digitalocean.com/kubernetes/clusters), go to Cluster -> Resources -> Add a Node Pool. You can give it a name like ```np-instanceserver``` and set a size, the recommended size is ```CPU Intensive - 2vCPU 4 GB RAM```, but you could always alter the size based on your needs. Once that is done we also would need to enable autoscaling, you can do that by ticking the box called ```Autoscale``` and then setting the Minimum Nodes to 6 and Maximum Nodes to 16. After adding these settings click the ```Add Node Pool(s)``` button at the bottom and it should take a few minutes and the nodepool should be created.
## Create nodepool for redis
In Ethereal Engine deployemnt, the Redis deployment gets its own nodepool. To create a new noodpool on [DO Website](https://cloud.digitalocean.com/kubernetes/clusters), go to Cluster -> Resources -> Add a Node Pool. You can give it a name like ```np-redis``` and set a size, the recommended size is ```CPU Intensive - 2vCPU 4 GB RAM```, but you could always alter the size based on your needs. Once that is done we also would need to enable autoscaling, you can do that by ticking the box called ```Autoscale``` and then setting the Minimum Nodes to 3 and Maximum Nodes to 6. After adding these settings click the ```Add Node Pool(s)``` button at the bottom and it should take a few minutes and the nodepool should be created.

## create nodepool for builder
We would need to create a new nodepool for running the builder job. To create a new noodpool on [DO Website](https://cloud.digitalocean.com/kubernetes/clusters), go to Cluster -> Resources -> Add a Node Pool. You can give it a name like ```np-builder``` and set a size, the recommended size is ```Basic - 8vCPU 16 GB RAM```, but you could always alter the size based on your needs. We do not need to enable autoscaling for the builder node as we normally are aware of the computational requirnments the build job would need and we could always resize it if the need arises, plus this nodepool is not load intensive. After adding these settings click the ```Add Node Pool(s)``` button at the bottom and it should take a few minutes and the nodepool should be created.

## Create DOCR for build images
To create a ditial ocean container registry, on the [DO Website](https://cloud.digitalocean.com), in the left nav bar, you could click on the ```Container Registry``` and then create a new Container Registry. You can name it as you like but the convention that we have been following will be ```etherealengine```. This container registry will be used to store the Ethereal Engine specific docker images. You can get the DOCR URL from the created container registry which should look something similar to ```registry.digitalocean.com/etherealengine``` and would be used in the code to push images to DOCR. 
Along with the DOCR URL, to communicate to the DOCR, you would need to create an API token which can then be used inside the code. To create the token, go to API -> Tokens > Create New Token, give the token a meaningful name and set the expiry, also give the token the required rights. For DOCR, you will have to give it full Read & Write permissions. Once created, you could save this token and use it in the code. 

```Note:``` Unlike the AWS ECR, we do not need to explicitly create the repositories for different categories of images, when a request is sent to DOCR with the repository name, it checks if the repository exists, otherwise it creates the repository on the run time. 

## Create a Database Cluster
On the [DO Website](https://cloud.digitalocean.com), you could see a button, most probably on the top right end called Create and it is with a dropdown. You can select ```Databases``` from the drop down and it should take you the the page where you can create the Database Cluster. On create Database cluster you can choose the datacentre region and then choose a database engine. We could choose any SQL database but at the time being with the Digital Ocean clsuter we choose the ```MySQL```.
You can choose the pricing tier that works for you from various configurations that are available. Then give your database clsuter a unique name and select project that you want the cluster to be created in and finally click the ```Create Database Cluster``` button at the bottom to be able to create the database clsuter. It should take a few minutes and after that your Cluster should be ready to host the databases.
DO Provides extenisve loging and monitoring for your queries running agains the created datbase clsuter which can be viewed under the ```Logs & Queries``` section. You can also get the connection credentials from the main menu and also manage the users under the ```Users & Databases``` section. You can also update the Settings/configurations of the created database cluster from the same menu.

### Access and Connecting to the DO Database Cluster
Your DO database clsuter is Public by default but you can always change that setting as per your own requirnments. Also, Digital Ocean creates a VPC along with your Database cluster to offer the ability to be able to connect to the cluster more securily. 

## Installing Agones, ingress-nginx, and redis for each deployment
You can download the Kubeconfig file from the Digital Ocean Control pannel's Kubernetes cluster section and get that added into the kubectl configurations. 

You next need to add the Agones, ingress-nginx, and redis Helm charts to helm by running 
```helm repo add agones https://agones.dev/chart/stable```, ```helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx```, and ```helm repo add redis https://charts.bitnami.com/bitnami```.
You should also at this time add Ethereal Engine's repo via ```helm repo add etherealengine https://helm.etherealengine.org```.

If you ever suspect that a chart is out-of-date, run ```helm repo update``` to update all of them to the latest.

### Install Agones
From the top level of this repo, run ```helm install -f </path/to/agones-default-values.yaml> agones agones/agones```.
This says to install a service called 'agones' from the 'agones' package in the 'agones' chart, and to configure it with
[agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) that can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

## Install redis for each deployment

Each deployment of Ethereal Engine uses a redis cluster for coordinating the 'feathers-sync' library.
Each redis deployment needs to be named the same as the deployment that will use it; for an
Ethereal Engine deployment named 'dig', the corresponding redis deployment would need to be named
'dig-redis'.

Run ```helm install -f </path/to/redis-values.yaml> <RELEASE_NAME>-redis redis/redis``` to install, e.g.
```helm install -f </path/to/redis-values.yaml> dev-redis redis/redis```.

> [redis-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/redis-values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you named the redis  something other than 'np-redis', you'll have to alter the value in
`redis-values.yaml` in two places to your redis nodepool name.
in your `redis-values.yaml` file, you will also update the Key value to `doks.digitalocean.com/node-pool`. 
If you didn't create a nodepool just for redis, you must omit the ` -f </path/to/redis-values.yaml> `,
as that config makes redis pods run on a specific nodepool.

## Install ingress-nginx
Open local version of [nginx-ingress-aws-values.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml) file. Remove the aws specific values under the `annotation` sections and add the following DO sepcific values in there.

```service.beta.kubernetes.io/do-loadbalancer-certificate-id: <Certificate-ID>
   service.beta.kubernetes.io/do-loadbalancer-protocol: https
```

You can run the following command with `doctl` and it should give you the <Certificate-ID> against the for the certificate that you must already have added via the DO domains.
```doctl compute certificate list```
Get the ID and replace it in the values.yaml file as suggested above. 

Do not commit this file with the ARN inserted; once you've completed this step, revert the file back
to the state it was committed in.

From the top level of this repo, run ```helm install -f </path/to/nginx-ingress-aws-values.yml> nginx ingress-nginx/ingress-nginx```
This says to install a service called 'nginx' from the 'ingress-nginx' package in the 'ingress-nginx' chart, and to configure it with
a file found at [nginx-ingress-aws-values.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml).

## DO Spaces Object Storage
You will need to created Space Object Storage (SOS) to be able to store your static files that then could be served via the API pods. Go to [DO Website](https://cloud.digitalocean.com) and on the left hand side click on the `Spaces Object Storage` and create an SOS by giving it the right region and a valid name.  Also make sure that you check the `Enable CDN` checkbox to enable the Content Delivery Network for faster delivery of the static content. 

## Adding the domain in DNS
You will have to add a domain in on the DO control pannel by going to the Networking -> Domains. Lets assume we want to add a domain called `theoverlay.io`. Under the domain section, you will have to add that TLD and once added, you can expand that to check if the name server records have been created agains that domain.
You will also have to add a few more records for various services of Ethere engine in under this Domain as per the following. 

* `CNAME` record with Hostname `resources-dig.theoverlay.io` and Value `etherealengine-static-resources.sfo2.cdn.digitaloceanspaces.com.` (CDN URL of DO Spaces Object Storage)
* `A` record with Hostname `dig.theoverlay.io` and value `<Ingress-Loadbalancer-IP>`
* `A` record with Hostname `instanceserver-dig.theoverlay.io` and value `<Ingress-Loadbalancer-IP>`
* `A` record with Hostname `api-dig.theoverlay.io` and value `<Ingress-Loadbalancer-IP>`
* `A` record with Hostname `theoverlay.io` and value `<Ingress-Loadbalancer-IP>`

These records are created to be able to route the traffic to the loadbalancers and then the relevent services with in the Ethereal Engine. 

## Firewall
Under the same Networking -> Firewalls you will have to add the TCP and UDP port rules to allow inbound traffic from Ports 7000-8000 and from ports 30000-32767. Similarly you will have to add the outbound rules for All Ports.

## Adding a wildcard certificate
To make aur domains and subdomains secure, we would also be adding an SSL certificate that can ensure the security of our domains and subdomains. We could get our SSL certificate from any valid Certificate Authority. For DO we are at the moment using the Let's Encrypt certificate that gets created from with in the Digital Ocean Control pannel but if you have aquired a certificate of your own, you can also get that added in to the DO.

To create a certificate go to the [DO Website](https://cloud.digitalocean.com) and in the left hand pane under `Settings` click on the `Security` tab and the click on the `Add Certificate` button to add the certificate. Then click on the `Let's Encrypt` certificate since we want to create a new certificate. Under the domain section, add the wildcard comain for ```*.theoverlay.io``` since we need to also make sure that this certificate is valid for our subdomains. Give your certificate a valid name and then click ```Generate Certificate```. 
Make sure that you have added the following Name server record with the domain registrar for ```theoverlay.io``` or for whichever domain you are using.

* ns1.digitalocean.com.
* ns2.digitalocean.com.
* ns3.digitalocean.com.

If the DO is able to validate the doamin then the certificate will be created in a few minutes and you would be able to see that certificate in certificate list. This is the certifiate whose ID will be added in the ngnx-ingress configurations in the values.yaml file. 

## Adding certificate with DO SOS
Under the spaces Object storage, you can click on the settings and then the Change button in front of the CDN settings to edit the CDN settings. In there, you can add a certificate to make sure that your DO SOS are secure. If you click on the custom domain a list of the available certifiate should appear in which there will be a wildcard certificate for ```*.theoverlay.io```, you can get that added.

## Deploy to EKS using Helm

With all of the networking set up, you can finally deploy the codebase to EKS.
There's a couple of steps to this, which will involve deploying things with most but not all of the needed
configuration values, and then letting the deployment process fill in the rest.

### Fill in Helm config file with variables
Template Helm config files for dev and prod deployments can be found in [configs](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs) \<dev/prod\>.template.values.yaml.
Before filling them in, make a copy elsewhere, call that '\<dev/prod\>.values.yaml', and edit that copy.
Both the builder and main deployments should use the same config file. When the builder seeds the database,
it needs a number of values that only need to be configured for the other services, so all of the values
need to be defined in one config file.

There are many fields to fill in, most marked with `<>`. Not all are necessary for all situations - if you're not
using social login, for instance, you don't need credentials for Github/Google/Facebook/etc.

### Changes in Configuration variables
Here are some configuration variables that you'll probably need to change based on your specific setup

### \<api/instanceserver/taskserver\>.extraEnv.AUTH_SECRET
This is a secret value that is used to sign the JWTs that authenticate users.
You can use any string for this value, and a randomly-generated one of sufficient length,
i.e. 32 or more characters, will suffice. If this is changed after some users have signed
in, their login credentials won't work any more.

### \<api/client/taskserver\>.affinity.nodeAffinity
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

### builder.extraEnv.PRIVATE_ECR
If you're using a private ECR repo, set this to "true" in the builder config file.

### (everything).image.repository
You'll need to replace every \<repository_name\> with the full DOCR_URL of your non-builder repos, e.g. `registry.digitalocean.com/etherealengine/etherealengine-dig-api`.
Each service has to have the proper `-<service>` suffix on it, e.g. `-instanceserver`, `-client`, etc.

### GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET
If you plan to backup Projects you create in the editor to GitHub, or install project from GitHub, it is necessary 
to set up the OAuth app that will facilitate this before the initial installation. 
See [this document](./4_setup_github_oauth_for_projects.md) for
more information, and enter the appropriate ID/secret in these variables.

### Pulling/pushing images from private DOCR
The Digital Ocean container register is a private registory and has private repositores which menas that you will have to define an image Pull Secret in the DO cluster and update its values in the Values.yaml file so that various parts of Ethereal Engine are abel to download and upload the images to the DOCR. This should be part of the helm chart evenutually but at the time of writing this document this is done mannually. You can create an image pull secret by running the following command. 

```
kubectl create secret generic <secret-name> \
    --from-literal=username=<do-username> \
    --from-literal=password=<do-password>

```

### Run Helm install
Run ```helm install -f </path/to/<RELEASE_NAME>.values.yaml> <RELEASE_NAME>-builder etherealengine/etherealengine-builder```
and then run ```helm install -f </path/to/<RELEASE_NAME>.values.yaml> <RELEASE_NAME> etherealengine/etherealengine```

This will spin up the main and builder deployments using the Helm config file, \<dev/prod\>.values.yaml.
Neither will fully work yet, since there's no valid image in the repos yet. The GitHub
Actions and builder processes will make those images and update the deployments with the tags of the images they've built
so that they can pull down and use those images.


## Install Elastic Search and Kibana using Helm for Server Logs

To install Elasticsearch, add the elastic repository in Helm: `helm repo add elastic https://helm.elastic.co`

Now, use the curl command to download the values.yaml file containing configuration information:

`curl -O https://raw.githubusercontent.com/elastic/helm-charts/master/elasticsearch/examples/minikube/values.yaml`

Use the helm install command and the values.yaml file to install the Elasticsearch helm chart: 

`helm install elasticsearch elastic/elasticsearch -f ./values.yaml`

The -f option allows specifying the yaml file with the template. If you wish to install Elasticsearch in a specific namespace, add the -n option followed by the name of the namespace: `helm install elasticsearch elastic/elasticsearch -n [namespace] -f ./values.yaml`

Now check if the cluster members are up: `kubectl get pods --namespace=default -l app=elasticsearch-master -w`

The other option is to use the helm test command to examine the cluster’s health: `helm test elasticsearch`

To install Kibana on top of Elasticsearch : `helm install kibana elastic/kibana`
Check if all the pods are ready: `kubectl get pods`

After you set up port-forwarding, access Elasticsearch, and the Kibana GUI by typing `http://localhost:5601 `in your browser

In order to connect logger with elasticsearch, update config file(values.yml) for Xr env `api.extraEnv.ELASTIC_HOST` for e.g. `http://<username>:<password>@<host>:<port>`

## Upgrading an existing Helm deployment
One of the features of Helm is being able to easily upgrade deployments with new values. The command to
do this is very similar to the install command:

```helm upgrade --reuse-values -f </path/to/*.values.yaml> --set api.image.tag=<latest_github_commit_SHA>,client.image.tag=<latest_github_commit_SHA>,instanceserver.image.tag=<latest_github_commit_SHA> <RELEASE_NAME> etherealengine/etherealengine```

```--reuse-values``` says to carry over all configuration values from the previous deployment. This is most important
for tags, since they're usually set inline with the `helm install/upgrade` command, not a Helm config.
Using ```-f <config_file>``` and ```--set <variables>``` after it will apply any changes on top of the
carryover values.

If you're not deploying a new build of the codebase, you can skip the entirety of the ```--set *.image.tag=<SHA>```.