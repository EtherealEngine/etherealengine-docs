# Ethereal Engine on AWS

The value `RELEASE_NAME` referenced throughout this guide is the name of the deployment, e.g. `dev` or `prod`.

## Create EKS cluster with four nodegroups
You first need to set up an EKS cluster for Ethereal Engine to run on.
While this can be done via AWS' web interface, the ```eksctl``` CLI 
will automatically provision more of the services you need automatically,
and is thus recommended.

First, follow [these instructions](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)
for setting up aws-cli, eksctl, and configuring aws-cli with your AWS credentials.
You should also set up kubectl and Helm, as we will be using that to install multiple codebases from Charts.

Next run the following command:

```eksctl create cluster --name <name> --version <version> --region <region> --managed --nodegroup-name <name> --node-type <instance type> --nodes <target_node_number> --nodes-min <minimum_node_number> --nodes-max <maximum_node_number> --spot```

This will create an EKS cluster with a managed nodegroup in the specified region, including automatically
creating subnets, making a VPC, and more. It may take up to 15 minutes to complete.

You can also use the flag ```--zones <zone1>,<zone2>``` to specify which Availability Zones the cluster
should set up in. Some regions have zones that are unavailable, but which eksctl will try to
use if --zones is not specified, leading to the setup to fail. As an example, us-west-1 (as of this
writing) does not have any resources available in us-west-1b; if you are setting up in us-west-1,
you would want to use ```--zones us-west-1a,us-west-1c```.

Note that the region matters for almost all services in AWS. The default region is 'us-east-1',
but if you make the cluster in any other region, you'll need to make sure you're creating certs,
DNS records, etc. in the same region.

As of this writing, the API and client are configured to run on a nodegroup named 'ng-1'.
If you name it something else, be sure to change the NodeAffinity in the configuration file. This is one of **four**
nodegroups that will be created for various services to run on.

Make sure to increase the maximum node limit, as by default target, minimum, and maximum are
set to 2, and Ethereal Engine's setup will definitely need more than two nodes if you've configured
them to use relatively small instance types such as t3a.medium.

#### Enable EBS CSI Addon (if EKS version is 1.23 or later)
Follow the instructions [here](https://docs.aws.amazon.com/eks/latest/userguide/managing-ebs-csi.html)
to enable an EKS addon that's required for any cluster that will have Persistent Volumes, which an
Ethereal Engine deployment cluster will.

#### Install Cluster Autoscaler (optional)

While not necessary, it can be useful to have an autoscaler installed in the cluster to increase
the number of nodes available for pods when the cluster has high traffic and to decrease that
number when it has low traffic.

Follow [these instructions](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html#cluster-autoscaler)
to set up the autoscaler. Any managed nodegroups created in the following steps should by default be
tagged such that the autoscaler can control them, so no further action should be required.

Note that there is some lag time on scaling up and down. It generally takes about 5 minutes from 
the time that the autoscaler sees the need to add more nodes before those nodes have been spun up,
the appropriate Docker image has been installed onto them, and they are ready to be used. It takes about
15 minutes for the autoscaler to actually remove nodes that are deemed superfluous, as a hedge against
the recent high traffic picking up again.

The OIDC provider that was created in the prior step, installing the EBS CSI Addon, can be re-used in this step.

#### Create launch template
Go to EC2 -> Launch Templates and make a new one. Name it something like 'etherealengine-production-instanceserver'.
Most settings can be left as-is, except for the following:
* Storage -> Add a volume, set the size to ~20GB, and for Device name select '/dev/xvda'.
* Network Interfaces -> Add one, and under 'Auto-assign public IP' select 'Enable'

#### Create nodegroup for instanceservers
Go to the AWS website, then go to EKS -> Clusters -> click on the cluster you just made -> Configuration -> Compute.
You should see one managed nodegroup already there; clicking on its name will open up information
and editing, though you can't change the instance type after it's been made.

Back at the Compute tab, click on Add Node Group. Pick a name (something like ng-instanceservers-1 is recommended),
select the IAM role that was created with the cluster (it should be something like ```eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>```),
toggle the Use Launch Template toggle and select the launch template you made in the previous step,
then click Next. On the second page, Choose the instance type(s) you'd like for the group,
set the minimum/maximum/desired scaling sizes, and hit Next (t3(a).smalls are recommended). 
There may be connection issues with instanceserver instances in private subnets, so remove all of the private
subnets from the list of subnets to use, and make sure that public subnets are being used (sometimes
the workflow only selects private subnets by default). Hit Next, review everything, and click Create.

#### Create nodegroup for redis

Redis should get its own nodegroup to isolate it from any other changes that might be made to your cluster.
As with the instanceserver nodegroup, it's not strictly necessary, but can prevent various other things from
going down due to the redis servers getting interrupted.

Back at the Compute tab, click on Add Node Group. Pick a name (the default config in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.minikube.template.values.yaml) assumes
a name of 'ng-redis-1'), select the IAM role that was created with the cluster 
(it should be something like ```eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>```),
toggle the Use Launch Template toggle and select the launch template used to make the initial nodegroup,
then click Next. On the second page, Choose the instance type(s) you'd like for the group,
set the minimum/maximum/desired scaling sizes (you can probably get away with a single t3(a).small, but it's recommended
to have at least two nodes so that one going down doesn't kill the entire deployment from a lack of redis), and hit Next. 
The default subnets should be fine, so hit Next, review everything, and click Create.

#### Create nodegroup for builder

The full Ethereal Engine stack needs a builder server within the cluster in order to bundle and build
Ethereal Engine projects into the codebase that will be deployed. This should run on its own nodegroup
that has a single node - only one copy of the builder should ever be running at a time, and
due to the high memory needs of building the client service, a box with >8 GB of RAM is needed.

Back at the Compute tab, click on Add Node Group. Pick a name (something like `ng-dev-builder-1` is recommended) and
select the IAM role that was created with the cluster (it should be something like 
```eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>```). You don't need to use any Launch Template
for this nodegroup. Click Next.

On the second page, you can change the Capacity Type to `Spot` if you want to in order to save money; the builder
service will likely not be running very often or for too long, so the odds of it getting interrupted by Spot instance
outages are low, and it can always re-build if that does happen. Set the Disk Size to 50 GB; it takes a good deal of
disk space to install and build the Ethereal Engine codebase, and the default 20 GB will almost certainly not be enough.

For Instance Types, you need to only select types that have more than 8 GB; t3a.xlarge are the cheapest that fit
this criteria. If you were to pick something with 8GB, it's highly likely that most builds would crash the node,
as Kubernetes tends to restart nodes if they get anywhere near memory capacity.
Under Node Group Scaling Configuration, set all three `nodes` values to 1. We only want a single copy of the builder
at any given time, and running multiple powerful boxes can get pricey. Click Next.

You can leave the subnets on the next page alone and click Next. On the last page, click Create.

## Create ECR repositories for built images.
The Ethereal Engine deployment process will be building multiple Docker images, and those need to be stored somewhere.
In AWS, that somewhere is [Elastic Container Registry](https://us-west-1.console.aws.amazon.com/ecr/get-started).
You need to make those repositories in the same AWS region where the EKS cluster is running.

Go to the ECR link above and click Get Started under Create a Repository. If you're very concerned about any of your
Ethereal Engine project codebase(s) getting out, you can choose Private for Visibility Settings, but normally Public is fine.
You'll be needing to create multiple repositories for each deployment, e.g. several repos for a `dev` deployment,
several more for a `prod` deployment, etc.

Assuming you're first doing a `dev` deployment, name the first repo `etherealengine-<RELEASE_NAME>-builder` under Repository
Name, e.g. `etherealengine-dev-builder`. You shouldn't need to change any other settings, though if you're using a Private 
repo and want to turn on Tag Immutability, that's fine. The image tags that are generated should never collide, but it
will prevent any manual overwriting of a tag. Click Create Repository.

You will need to make four more repos for each of the services that are deployed as part of the Ethereal Engine stack -
`api`, `client`, `instanceserver` and `taskserver`, which are also in the form `etherealengine-<RELEASE_NAME>-<service_name>`.
e.g. `etherealengine-dev-api`, `etherealengine-dev-client`, `etherealengine-dev-instanceserver` and `etherealengine-dev-taskserver`.
Everything else can be left alone for those, too.

On the [repositories page](https://us-west-1.console.aws.amazon.com/ecr/repositories), you should see both of 
the repositories you made. If you don't see any, you may be on the wrong tab up top - click Private or Public to switch
between them. Also check that you're in the right AWS region. You'll see a column 'URI'. If you made public repos,
the URIs should be in the form `public.ecr.aws/<identifier>/etherealengine-<RELEASE_NAME>(-builder)`; if you made private 
repos, the URIs should be in the form `<AWS_account_id>.dkr.ecr.<AWS_region>.amazonaws.com/etherealengine-<deployment>(-builder)`. 
Take note of everything before the `/etherealengine-<RELEASE_NAME>` - you'll need to add that as a variable in later steps.
It will be called `ECR_URL` there.

## Create IAM Roles for S3/SES/SNS/Route53 (or a single admin role)

Ethereal Engine interfaces with several AWS services and requires credentials for these purposes. You could make
one admin role with full access to all AWS services, but we recommend making separate, scoped roles for
each individual service. To create a role, do the following:

### Creating an IAM role
Go to IAM->Users, and click on the Add User button. For User Name, enter `<service>-admin`, e.g. `S3-admin`.
Check the box for Programmatic Access, the click on the Next:Permissions button.
Click on 'Attach existing policies directly'. In the Filter Policies text box, you'll want to
enter the name of the service to narrow down the policy list significantly. Then, look for the FullAccess
policy for that service and select that, and click the Next:Tags button. You don't need to tag it with
anything, just click the Next:Review button, then the Create User button.

The following screen should show Success and have the user listed. Copy the 'Access key ID' somewhere, and
also click the Show toggle under 'Secret access key' and copy that elsewhere as well. You will put these
into the Helm config file later.

### IAM Roles to create
Here are the services you want to create IAM admin users for, and the associated permissions you want to
grant them:

* Route53: `AmazonRoute53FullAccess` 
* S3: `AmazonS3FullAccess, CloudFrontFullAccess`
* SNS: `AmazonSNSFullAccess`

You'll also need to create an IAM user that GitHub Actions can use to access the cluster and push/pull
Docker images from ECR. By convention, we call this user 'Github-Actions-User', and it needs these
permissions: `AmazonEKSClusterPolicy, AmazonEKSWorkerNodePolicy, AmazonEKSServicePolicy, AmazonElasticContainerRegistryPublicFullAccess, AmazonEC2ContainerRegistryFullAccess`

### Creating new credentials for an IAM user
If you ever lose the secret to a user, or want to make new credentials for whatever reason, go to
IAM->Users and click on that user. Click on the 'Security credentials' tab, and under 'Access keys' you
should see a button 'Create access key' and, underneath that, 0-2 existing keys with some information
about them and an 'x' on the far right to delete it. If there are two keys for that user, you 
must deactivate and delete one of them before making a new one.

Click the Create button, then make sure to save the public and secret keys somewhere and put them into
the Helm config file.

## Create RDS box

Ethereal Engine is backed by a SQL server. We use MariaDB in development, but it has also been run on AWS with
Aurora without issue. Most other versions of SQL should work but have not been explicitly tested.


### Accessing RDS box from an external machine
By default, an RDS box is only accessible from within the VPC it's located.
If you want to be able to connect to it from outside that VPC, you'll need to either set up a bastion box
and SSH into that box, or make the RDS box publicly accessible.

Setting up a bastion box is not covered here at this time. The steps to make it public will be noted
below by **Make RDS public**

### Create RDS instance
Go to RDS and click the Create Database button. Most options can be left at their default values.
Under Settings, give a more descriptive DB cluster identifier. The Master Username can be left as admin;
enter a Master Password and then enter it again in Confirm Password.

Under DB instance class, pick an option that best meets your pricing needs.

Under Availability and Durability, it's recommended that you leave it on the default of
making an Aurora Replica in another AZ.

Under Connectivity, make sure that it's in the VPC that was made as part of the EKS cluster.

**Make RDS public**
If you want to be able to access it externally, you should set Public Access to 'Yes'.

Under VPC security group, select the ones titled 
`eksctl-<EKS_cluster_name>-cluster-ClusterSharedNodeSecurityGroup-<random_string>` and
`eks-clustersg-<EKS_cluster_name>-<random_string>`.

Open the top-level Additional Configuration dropdown (not the one within Connectivity). Under Database Options-> Initial Database Name,
name the default database and save this for later use in the Helm config file.

Finally, click the Create Database button at the very bottom of the page.

**Make RDS Public** You will need to add a Security Group to the RDS instance that allows traffic over port
3306 (or whatever port you chose to run it on). You can have this SG only let in traffic from your IP address(es)
if you want to be very secure about this, or from anywhere (0.0.0.0/0) if you're less concerned about someone
getting access.

Some values to note for dev/prod.template.values.yaml:
sql.database will be what you entered for Initial Database Name
sql.user and sql.password will be the name and password of the admin user
sql.host will be the Endpoint of the RDS instance/cluster; find this by going to RDS -> Databases,
clicking on either the lone DB identifier (if made in a single AZ) or the top-level regional cluster
identifier (if set up in a multi-AZ deployment); the look for Endpoint (single-AZ) or, if multi-AZ,
the Endpoint name that has type 'Writer instance'.


## Edit security group to allow instanceserver traffic into VPC
You'll need to edit the new cluster's main security group to allow instanceserver traffic.
On the AWS web client, go to EC2 -> Security Groups. There should be three SGs that have
the node's name somewhere in their name; look for the one that is in the form
```eks-cluster-sg-<cluster_name>-<random_numbers>```. It should NOT end with /ControlPlaneSecurityGroup
or /ClusterSharedNodeSecurityGroup.
Click on that, then the Inbound Rules tab, then click Edit Inbound Rules.

You'll need to add two rule sets:
* Type: Custom UDP; Port Range: 7000-8000; Source: Anywhere (or 'Custom 0.0.0.0/0')
* Type: Custom TCP; Port Range: 7000-8000; Source: Anywhere (or 'Custom 0.0.0.0/0')

## Create Route 53 Hosted Zone and set up ACM certificates

Before installing Nginx to the cluster, you'll need to have all of the networking squared away.
This requires creating the necessary SSL certificates and creating some DNS records to point 
various subdomains to the right place.

### Purchase and register domain through Route53 (optional)
If you do not have a domain for your application already, it's easiest to register it through Route53.
Go to Route53->Domains->Registered domains, then click the 'Register Domain' button, and follow the
workflow to register a domain name.

### Create Route 53 Hosted Zone
In the AWS web client, go to Route 53. Make a hosted zone for the domain you plan to use for
your setup of Ethereal Engine. You'll be coming back here later to create DNS records.

Open the Hosted zone, then click on 'Hosted zone details' to see more information. The value 'Hosted zone id'
is used in the dev/prod.values.yaml file for 'ROUTE53_HOSTED_ZONE_ID'

#### Point external registrar subdomains to use Route53 Nameservers (only if your domain is registered outside Route53)
If you already have a domain registered with another registrar service, you'll need to add some DNS records
in there to point the specific subdomains you'll be using to AWS' nameservers.

First, go to Route53->Hosted Zones and open the domain you'll be using by clicking on the domain name (or
highlighting the row and clicking the 'View details' button). There should be two records under Records.
Look for the one of type 'NS'; under 'Value/Route traffic to', there should be four lines that all start
with 'ns-'. These will be used shortly.

Go to your external registrar and go to the DNS records page. For each subdomain that will be in use, you
need to add four records of type 'NS'. The Name wil be the subdomain, and the Nameserver will be one of
the four lines under the 'NS'. You need a record for each of the four lines.

If you're setting up multiple deployments, e.g. both a dev and prod deployment, you'll need a set of four
NS records for each subdomain that those deployments will be behind.

### Create certificates with ACM

Go to Amazon Certificate Manager. If there are no certs in that region, click on Get Started under Provision Certificates,
otherwise click on Request a Certificate.

You should select Request a Public Certificate, then select Request a Certificate. The next page
should be headed Add Domain Names. You should add both the top-level domain, such as ```etherealengine.org```, 
as well as a wildcard for all subdomains e.g. ```*.etherealengine.org```, then click Next.

Choose DNS Validation on the next page and click Next. You can skip adding tags and just click Review,
then Confirm on the final page.

You should be sent to a page headed Validation. Click on the arrow next to each domain to open more
options. Click on the button Create Record in Route 53 to open a confirmation modal, and in that modal
click Create.

As it indicates, it can take up to 30 minutes for these domains to be validated. If you click on Complete
after triggering the record creation for each of them, you should be sent back to the Certificates page.
Opening the cert you just made will show the validation status of each domain.

If you open the details of this certificate, there should be a field 'ARN' with a value that looks
something like ```arn:aws:acm:<region>:<AWS account ID>:certificate/<a UUID>```. Take note of this for later,
when you go to install ingress-nginx.

You should follow the above instructions to make a second certificate for ```resources.<domain>```.
Note that this certificate MUST be made in us-east-1, regardless of which region everything else is
set up in; as of this writing, CloudFront can only use certificates in us-east-1.

## Install Agones, ingress-nginx, and a copy of redis for each deployment

Now that the cluster is up and running, we can install everything onto it.
When you created the cluster with eksctl, it should have created a context pointing to
it in kubectl. Run ```kubectl config get-contexts``` to get all of the contexts it knows about;
the one with a star next to it should be named ```<your_AWS_username>@<cluster_name>```.
If that isn't present, you'll have to edit the configuration to make the appropriate context.

You next need to add the Agones, ingress-nginx, and redis Helm charts to helm by running 
```helm repo add agones https://agones.dev/chart/stable```, ```helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx```, and ```helm repo add redis https://charts.bitnami.com/bitnami```.
You should also at this time add Ethereal Engine's repo via ```helm repo add etherealengine https://helm.etherealengine.org```.

If you ever suspect that a chart is out-of-date, run ```helm repo update``` to update all of them to the latest.

### Install Agones
From the top level of this repo, run ```helm install -f </path/to/agones-default-values.yaml> agones agones/agones --version "1.31.0"```.
This says to install a service called 'agones' from the 'agones' package in the 'agones' chart, and to configure it with
[agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) that can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

### Install redis for each deployment

Each deployment of Ethereal Engine uses a redis cluster for coordinating the 'feathers-sync' library.
Each redis deployment needs to be named the same as the deployment that will use it; for an
Ethereal Engine deployment named 'dev', the corresponding redis deployment would need to be named
'dev-redis'.

Run ```helm install -f </path/to/redis-values.yaml> <RELEASE_NAME>-redis redis/redis``` to install, e.g.
```helm install -f </path/to/redis-values.yaml> dev-redis redis/redis```.

> [redis-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/redis-values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you named the redis nodegroup something other than 'ng-redis-1', you'll have to alter the value in
`redis-values.yaml` in two places to your redis nodegroup name.
If you didn't create a nodegroup just for redis, you must omit the ` -f </path/to/redis-values.yaml> `,
as that config makes redis pods run on a specific nodegroup.

#### Installing redis as part of Ethereal Engine chart (not recommended for production)
Redis can be installed as part of the Ethereal Engine chart so long as the config file for the Ethereal Engine installation has 'redis.enabled' set to true.
In that case, you should skip the above step of installing redis separately. This is not recommended for production
environments, though, since upgrades to an Ethereal Engine installation will usually reboot the redis servers,
leading all of the instanceservers to crash due to their redis connections being severed.

This breaks Agones' normal behavior of keeping Allocated instanceservers running until every user has left and slowly replacing
old Ready instanceservers with new ones, maintaining an active pool of instanceservers at all times. You will encounter a period
of time where there are no active instanceservers at all, which is not recommended, and all instanceservers in use
will immediately go down.

### Install ingress-nginx
**This step cannot finish until the associated ACM Certificate is fully validated** 
Open local version of [nginx-ingress-aws-values.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml) file. Take note of the line
```service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "<ACM Certificate ARN for SSL>"```
Replace the bit in angle brackets, including the angle brackets, with the ARN of the certificate
you made for the top-level domain and all wildcarded subdomains, e.g.
```service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-west-1:103947711118:certificate/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"```

Do not commit this file with the ARN inserted; once you've completed this step, revert the file back
to the state it was committed in.

From the top level of this repo, run ```helm install -f </path/to/nginx-ingress-aws-values.yml> nginx ingress-nginx/ingress-nginx```
This says to install a service called 'nginx' from the 'ingress-nginx' package in the 'ingress-nginx' chart, and to configure it with
a file found at [nginx-ingress-aws-values.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml).

## Set up Simple Email Service (optional)

If you want to enable email magiclink login, you will need to set up Simple Email Service (SES).

In the AWS web client, go to SES -> Configuration -> Verified Identities. Click Create Identity, then under 'Identity type'
select 'Domain'. Enter the top-level domain under the 'Domain' field. Finally, click the 'Create identity' button.

### Create SMTP credentials
You need to create SMTP credentials in order to authorize SES. These will show up as an IAM user,
but you must go through an SES-specific process to get valid credentials; just creating an IAM user
with SESFullAccess will not work.

Go to an SES page and select 'SMTP Settings', then click the button 'Create SMTP Credentials'.
You can leave the default IAM User Name as-is; click the Create button. You should be taken to a screen
says a user has been created successfully. Click on 'Show User SMTP Security Credentials'.

You will see a Username and Password. These credentials will go into the Helm config file, under
AWS_SMTP_USER and AWS_SMTP_PASS, respectively. You must also fill in the region that you've created these credentials 
in, replacing <SES_REGION> in api.extraEnv.SMTP_HOST.

### Move SES out of Sandbox
By default, SES domains are in Sandbox mode, where they can only send emails to verified email addresses.
To request that the domain be moved out of Sandbox mode, go to SES->Email Sending->Sending Statistics.
Click on the button 'Edit your account details' to open the modal. Set 'Enable Production Access' to Yes,
leave Mail type on 'Transactional', then fill in the Website URL, add a Use case description (basically
just assure them that this is for account login only, not anything else), click the checkbox to agree
to their TOD, and click the button 'Submit for review'.

It may take up to a few days for them to take action. If the request is rejected, address their concerns.
Once you have been approved, email login should work for any email address.

#### Verifying test emails
Before you have production use for your SES domain, in order to log in you'll have to verify specific email
addresses with SES. Go to SES->Identity Management->Email Addresses. Click on the button 'Verify a New Email
Address'. Enter the address you want to test with, then click 'Verify This Email Address'. You should soon
receive an email with a link to verify it (it may go to your Spam folder). Once you've followed the link,
you can log in with that address.

## Set up Simple Notification Service (optional)

If you want to enable text message-based magiclink login, you will need to set up Simple Notification Service (SNS).

In the AWS web client, go to SNS -> Topics and Create a new topic.
Give it a name, and selected 'Standard' as the type, then click Create Topic.

## Set up S3 bucket for static resources and Cloudfront distribution

Various static files are stored in S3 behind a Cloudfront distribution.

### Create S3 bucket
In the AWS web client, go to S3 -> Buckets and click Create Bucket.
Name the bucket `<name>-static-resources`, e.g. ```etherealengine-static-resources```, and have it be in Region us-east-1.
Under Object Ownership, select 'ACLs enabled', and under that select 'Object Writer'.
Under Block Public Access Settings For The Bucket, uncheck the checkbox Block *all* Public Access; 
you need the bucket to be publicly accessible.
Check the box that pops up confirming that you know the contents are public.
All other settings can be left to their default values; click Create Bucket.

Open the bucket's settings and go the Permissions tab. Midway down is 'Access control list'. Edit that, and
Check the boxes for Objects:List and Bucket ACL:Read for 'Everyone (public access)'. Click the box with the
warning label that appears that says "I understand the effects of these changes on my objects and buckets",
then click Save Changes.
At the bottom of the Permissions tab is a Cross-origin Resource Sharing (CORS) box. 
It should have the following settings; if not, click Edit and copy this in:
```
[
    {
        "AllowedHeaders": [],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "POST"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

### Create Cloudfront distribution
In the AWS web client, go to Cloudfront -> Distributions and click on Create Distribution.
Under 'Web', click on Get Started.

Under `Origin`, click on the text box under `Origin domain`, and select the name of the S3 bucket you just made.
The `Name` field should be automatically populated, and should be left as whatever that value is.

Several fields in `Default cache behavior` will be changed.

Under `Viewer -> Viewer protocol policy`, select 'Redirect HTTP to HTTPS'
Under `Viewer -> Allowed HTTP methods`, select 'GET, HEAD, OPTIONS', and check `Cache HTTP methods -> OPTIONS`.

In `Cache key and origin requests`, leave it on `Cache policy and origin request policy`.
If this option is not available, see the below subsection for `Legacy cache settings`

For `Cache policy`, you will need to make a new policy, which is easily done by clicking the link `Create policy`
underneath the selector; this will open a new tab. Name this policy anything you want, e.g. 'Cached-on-headers',
then under `Cache key settings`, click on the `Headers` selector and select 'Include the following headers'. A new
selector should appear under that titled `Add header`. Click the selector, and check 'Origin',
'Access-Control-Request-Method', and 'Access-Control-Request-Headers', then click away from the menu. Click the 'Create'
button to create the new policy.

Once the policy has been created, go back to the tab that you were creating the CloudFront distribution in.
Click the refresh button to the right of the `Cache policy` selector to fetch your new policy, then click the selector, 
and your new policy should appear in the selector at the bottom of the list under the header 'Custom'. Select it.

For `Origin request policy`, select the option 'CORS-S3Origin'.

You should also make a custom response header policy so that files are served with the `Origin-Agent-Cluster`
header, which will tell most browsers to isolate resources for same-site cross-origin requests. To do that,
you will need to make a custom response header policy. Under `Response headers policy`, select `Create Policy`. 
This will open a separate tab. Name this something like `Origin-Agent-Cluster`, then under `Custom headers`,
click `Add header`. For name, enter `Origin-Agent-Cluster`, and for `Value`, enter `?1`. Then click the `Create`
button at the bottom.

Go back to the tab where you were creating the Cloudfront distribution. Click the refresh button to the right of
the `Response headers policy` selector to fetch the new policy, then click the selector, and your new policy should
appear in the selector at the bottom of the list under the header `Custom`. Select it.

Under `Settings`, you can change `Price class` to 'Use Only North America and Europe' to save some money.
For Alternate Domain Names, click 'Add item', then in the text box that appears, enter 'resources.`<domain>`', e.g.
```resources.etherealengine.org```. Under `Custom SSL Certificate`, click on the selector that says
'Choose certificate', then select the 'resources.`<domain>`' certificate you made earlier.

Everything else can be left at the default values, click Create Distribution.

#### Legacy cache settings
If for some reason `Cache policy and origin request policy` is not available for you, and you have to use
`Legacy cache settings`, the under `Headers`, select 'Include the following headers'. Under `Add header` that appears,
click on the selector titled 'Select headers', and in the menu that opens, check 'Host', 'Origin',
'Access-Control-Request-Method', and 'Access-Control-Request-Headers', then click away.

## Create S3 buckets for Docker build caches
As of this writing, the builder process is configured to cache its Docker builds to and from S3 buckets.
You must create S3 buckets for it to cache against, or else the build process will error out.

First pick a name stem for the buckets. The scripts in the build process assume that all of the buckets
have similar names, e.g. `my-deployment-prod-api-cache`, `my-deployment-prod-client-cache`, etc. The part of the
name before `-<service>-cache` is the stem. The stem can be anything that's valid for an S3 bucket name,
but S3 bucket names are unique across all of S3; using `etherealengine-dev` or `etherealengine-prod` will
not be allowed, for example, since the Ethereal Engine team already has those buckets names in use
for its own deployments. The bucket name stem can include `dev` or `prod`, or whatever you are naming your
deployment internally, but it does not have to; `my-deployment` would be a valid name stem. 
If you make multiple deployments, you will need to pick a separate name stem for each one.

Keep a note of the stem you have picked; it will be entered later into the values.yaml file for your
deployment, as `CACHE_BUCKET_STEM`.

Next, make the following five buckets in S3:
* <stem>-api-cache
* <stem>-client-cache
* <stem>-instanceserver-cache
* <stem>-root-cache
* <stem>-taskserver-cache

These buckets can be left at the default S3 settings, including being private. They will only be accessed
internally by the builder service.

If you are wondering why there is a `root` cache while there isn't a `root` service, the build process
first creates a root Docker image containing packages and files that are common to all of the services. 
Each service then starts from the root image to install and build packages and files specific to that service. 
Not having to install those shared dependencies for each individual service speeds up the build times.

## Set up DNS records
**The Nginx Load Balancer must be fully set up and running before this step can be completed**

In the AWS web client, go to Route 53, then go into the Hosted Zone you made earlier.
Click on Create Record. If it starts you under Quick Create Record, click the link
'Switch to Wizard'; it's not necessary, but the wizard is handy.

Under Routing Policy, leave it on Simple Routing and click Next. Then click Define Simple Record.

The first record should be for the top-level domain, e.g. ```etherealengine.org```, so leave the Record Name
text field blank. Under Value/Route Traffic To, click on the dropdown and select
Alias to Network Load Balancer. Select the region that your cluster is in.
Where it says Choose Load Balancer, click the dropdown, and select the NLB that was created.
Leave the Record Type as 'A - Route traffic to an IPv4 address and some AWS resources', then click
Define Simple Record.

You can keep clicking Define Simple Record to make more records in one batch. When you're
done, click Create Records.

You should make the following 'A' records to the loadbalancer, substituting your domain for 'etherealengine.org':

* etherealengine.org
* *.etherealengine.org
* @.etherealengine.org
* api-dev.etherealengine.org
* api.etherealengine.org
* dev.etherealengine.org
* instanceserver.etherealengine.org
* instanceserver-dev.etherealengine.org

You also need to make an 'A' record pointing 'resources.etherealengine.org' to the CloudFront distribution you made earlier.
Instead of 'Alias to Network Load Balancer', select 'Alias to Cloudfront distribution', then click the text box that appears
that says 'Choose distribution'. A selector should appear with the subdomain you're routing as well as the Cloudfront
distribution's domain name, which you should click on. Then click Define simple record.

## Create GitHub fork of Ethereal Engine repository.
The Ethereal Engine codebase is most easily deployed by forking it and configuring some Secrets so that the included GitHub
Actions can run the deployment for you. You can run all of the commands that the `<dev/prod>`-deploy action runs manually
if you so choose, and in that case, you don't need to fork the GH repo.

Go to https://github.com/etherealengine/etherealengine. In the upper right-hand corner, there's a button 'Fork'. Click that,
then click the account/organization you wish to fork it to. You should be taken to your fork in a short time.

You'll need to set several Secrets (runtime variables) for GitHub Actions. By default GitHub Actions should be fully
enabled, but you can double-check by going to Settings->Actions. Allow All Actions should be selected under Actions
Permissions.

Next click on Secrets under Settings. There should be none by default. Click on New Repository Secret near the top of
this page to make a new one. You will need to make several Secrets with the following Names and Values:

* AWS_ACCESS_KEY -> The public Key of the Github-Actions-User IAM user
* AWS_REGION -> The region of your ECR repos and EKS cluster
* AWS_SECRET -> The secret key of the Github-Actions-User IAM user
* CLUSTER_NAME -> The name of the EKS cluster
* DEPLOYMENTS_ENABLED -> Set to `true`
* DEV_REPO_NAME -> The base name of the dev ECR repository, e.g. `etherealengine-dev` (all references to the builder and service repos will append `-builder`/`-<service>` to this value)
* DOCKER_LABEL -> This can be almost anything, but you can use `lagunalabs/etherealengine`
* ECR_URL -> The root ECR_URL for your repos, i.e. everything before the `/etherealengine-dev-builder`, e.g. `11111111111.dkr.ecr.us-west-1.amazonaws.com` or `public.ecr.aws/a1b2c3d4`
* PRIVATE_ECR -> Set this to `true` if your ECR repos are private, if they're public you don't need to set this at all

If you go to the Actions Tab, you might see a few workflow runs with green checkmarks. If so, you'll be re-running the
`dev-deploy` workflow shortly; its initial run just ran a check to see if it should do a deployment based on 
`DEPLOYMENTS_ENABLED`, and since that wasn't set to true, it didn't do anything else. Now that that's set to true,
re-running it will trigger a deployment.
    
If you're asked to enable actions when going to the tab, and there are no runs listed after enabling actions, then you'll have to 
trigger the workflow by pushing new code to the dev branch.

## Grant Github-Actions-User access to cluster
By default, only the IAM user who set up an EKS cluster may access it.
In order to let other users access the cluster, you must apply an aws-auth configmap to the cluster
granting access to specific IAM users. A template of [aws-auth-template.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/aws-auth-template.yml) file can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

You'll need to provide a few values for this file. To find `<rolearn>`, in AWS go to EKS->Clusters->
`<your cluster>`->Compute->Select a nodegroup.  In the details should be 'Node IAM Role ARN'; copy this
and replace `<rolearn>` in the aws-auth file. `<account_id>` is the ID of your AWS account; in the upper
right corner of the AWS client should be `<your_username>@<abcd-1234-efgh>`. The 12-character string
after the @ is the account ID. Make sure to remove the `-`'s from the account ID when pasting it in.
`<IAM_username>` is the username of the IAM user you want to give access, e.g. `Github-Actions-User`.

You can add multiple users by copying the `- groups:` section under `mapUsers`, e.g.

```
  mapUsers: |
    - groups:
      - system:masters
      userarn: arn:aws:iam::abcd1234efgh:user/Github-Actions-User
      username: Github-Actions-User
    - groups:
      - system:masters
      userarn: arn:aws:iam::acbd1234efgh:user/FSmith
      username: FSmith
```

When the aws-auth config file is filled in, just run `kubectl apply -f path/to/aws-auth.yml`.

## Deploy to EKS using Helm

With all of the networking set up, you can finally deploy the codebase to EKS.
There's a couple of steps to this, which will involve deploying things with most but not all of the needed
configuration values, and then letting the deployment process fill in the rest.

### Fill in Helm config file with variables
Template Helm config files for dev and prod deployments can be found in [configs](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs) <dev/prod>.template.values.yaml.
Before filling them in, make a copy elsewhere, call that '<dev/prod>.values.yaml', and edit that copy.
Both the builder and main deployments should use the same config file. When the builder seeds the database,
it needs a number of values that only need to be configured for the other services, so all of the values
need to be defined in one config file.

There are many fields to fill in, most marked with `<>`. Not all are necessary for all situations - if you're not
using social login, for instance, you don't need credentials for Github/Google/Facebook/etc.

### Configuration variables of note
Here are some configuration variables that you'll probably need to change based on your specific setup

#### <api/instanceserver/taskserver>.extraEnv.AUTH_SECRET
This is a secret value that is used to sign the JWTs that authenticate users.
You can use any string for this value, and a randomly-generated one of sufficient length,
i.e. 32 or more characters, will suffice. If this is changed after some users have signed
in, their login credentials won't work any more.

#### <api/client/taskserver>.affinity.nodeAffinity
Within the sections of the config for the api, client, instanceserver, etc., is a section that looks 
something like this:
```
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
          - matchExpressions:
              - key: eks.amazonaws.com/nodegroup
                operator: In
                values:
                  - ng-1
```

The value, `ng-1` in this example, must be changed to match whatever the name of the nodegroup that 
that service will be running on, e.g. if you create a nodegroup for the instanceservers called
`abcd-instanceservers-5`, then you'd use that value under `values:`

If your EKS setup created a nodegroup for you, and you want to use that for the api, client, and
task servers, make sure to change the affinity value for them to whatever EKS named the
initial nodegroup.

#### builder.extraEnv.CACHE_BUCKET_STEM
This needs to be set to the S3 bucket name stem you selected and used for your S3 buckets 

#### builder.extraEnv.PRIVATE_ECR
If you're using a private ECR repo, set this to "true" in the builder config file.

#### (everything).image.repository
You'll need to replace every <repository_name> with the full ECR_URL of your non-builder repos, e.g. `abcd1234efgh.dkr.ecr.us-west-1.amazonaws.com/etherealengine-dev-api`.
Each service has to have the proper `-<service>` suffix on it, e.g. `-api`, `-client`, etc.

#### GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET
If you plan to backup Projects you create in the editor to GitHub, or install project from GitHub, it is necessary 
to set up the OAuth app that will facilitate this before the initial installation. 
See [this document](./4_setup_github_oauth_for_projects.md) for
more information, and enter the appropriate ID/secret in these variables.

### Run Helm install
Run ```helm install -f </path/to/<RELEASE_NAME>.values.yaml> <RELEASE_NAME>-builder etherealengine/etherealengine-builder```
and then run ```helm install -f </path/to/<RELEASE_NAME>.values.yaml> <RELEASE_NAME> etherealengine/etherealengine```

This will spin up the main and builder deployments using the Helm config file, <dev/prod>.values.yaml.
Neither will fully work yet, since there's no valid image in the repos yet. The GitHub
Actions and builder processes will make those images and update the deployments with the tags of the images they've built
so that they can pull down and use those images.

## Kick off GitHub Actions
In GitHub, if you go to back to the Actions tab, you should see a `dev-deploy` action. Click on it, and you should see
a page showing its status, which should be all green checkmarks or indicators that things didn't run. In the upper
right, click `Re-run all jobs`. This will start it again, and now that `DEPLOYMENTS_ENABLED` is set to true, it should
attempt to build and deploy the builder.
    
(If actions were disabled at first, you'll have to merge additional code into the dev branch to get it to start the dev-deploy process)

### Overview of the build process
The full build and deployment process works like this:
1. GitHub Actions builds just enough of the Ethereal Engine monorepo to fetch any installed Ethereal Engine projects.
2. GitHub Actions pushes this builder Docker image to the repo `etherealengine-<release>-builder` in ECR
3. GitHub Actions updates the builder deployment to point to the builder image it just created.
4. The builder deployment spins up the builder Docker image on its single node
5. The builder connects to the deployment's database and checks if there is a table `user`. This is a proxy
    for the database being seeded; if it does not exist, it seeds the database with the basic Ethereal Engine schema,
    seeds the default project into the database and storage provider, and seeds various types.
6. The builder downloads any Ethereal Engine projects that the deployment has added.
7. The builder builds the Docker image for each service concurrently using these projects, building them into the client files as well as copying them so that the api and instanceservers have access to them.
8. The builder pushes these final Docker images to the repos `etherealengine-<release>-<service>` in ECR
9. The builder caches all of the layers of each Docker file in S3 for faster build times on subsequent builds
9. The builder updates the main deployment to point to the final images it just created.
10. The main deployment spins up the final Docker images for the api, client, instanceserver and taskserver services.

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

### Upgrading an existing Helm deployment
One of the features of Helm is being able to easily upgrade deployments with new values. The command to
do this is very similar to the install command:

```helm upgrade --reuse-values -f </path/to/*.values.yaml> --set api.image.tag=<latest_github_commit_SHA>,client.image.tag=<latest_github_commit_SHA>,instanceserver.image.tag=<latest_github_commit_SHA> <RELEASE_NAME> etherealengine/etherealengine```

```--reuse-values``` says to carry over all configuration values from the previous deployment. This is most important
for tags, since they're usually set inline with the `helm install/upgrade` command, not a Helm config.
Using ```-f <config_file>``` and ```--set <variables>``` after it will apply any changes on top of the
carryover values.

If you're not deploying a new build of the codebase, you can skip the entirety of the ```--set *.image.tag=<SHA>```.

## Ways of serving client files in production

There are multiple ways to serve built client files in a production environment:

* From client pods (separate from API pods)
* From API pods
* From the storage provider, such as S3/Cloudfront

### Serve client files from client pods
This is the default method. The Helm charts assume that the deployment will have client pods
to serve client files, the client ingress will point traffic to the client pods.

This option gives you slightly more flexibility in scaling a deployed cluster than serving
from the API pods, since you can scale the number of API and client pods independently.

### Serve client files from API pods
This will make your builder build and serve the client service from the API pods. The Helm
chart will not have a client deployment, serviceaccount, configmap, etc., and the client
ingress will point to the API pods.

To enable this, in your Helm config file set client.serverFromApi to `true`.
This change needs to be applied to both the builder deployment and the main deployment.

This option can save you some money by requiring fewer nodes in order to host all of the
API+client pods you desire, as you do not need capacity for separate client pods. It offers
slightly less flexibility in scaling since you cannot scale the number of API and client pods
separately; more client capacity would require more API capacity, and vice versa. It also
will result in slightly longer deployment times, as the combined API+client Docker images
are larger than an API-only or client-only image (though smaller than the sum of the two
separate images), which will mean a few more seconds to download to each node.

### Serve client files from Storage Provider
This will configure various parts of the client build process to point to all client files
on the storage provider rather than the client's domain. It is currently separate from
whether to serve the client process from the API pods or client pods, since the initial call
to get the index.html page for the client will go to the client/API pod, and then every other
client file will be fetched from the storage provider. 

As of this writing there are plans to serve the client solely from the storage provider, 
removing the need to serve the client from any Kubernetes pod at all, but this has not
been implemented.

Also as of this writing, only Amazon S3/Cloudfront is supported as a storage provider
in a cloud environment.

To enable this, set builder.extraEnv.SERVE_CLIENT_FROM_STORAGE_PROVIDER to `true` in the
Helm config file. Also make sure that builder.extraEnv.STORAGE_PROVIDER is set to `aws`,
and that builder.extraEnv.STORAGE_CLOUDFRONT_DOMAIN is set to the subdomain you are
using for your CloudFront distribution.

This option can greatly speed up the time it takes for users to fully load your worlds,
since almost every client file can be served from a CDN close to them, rather than
having to fetch them all from the closest physical server. 