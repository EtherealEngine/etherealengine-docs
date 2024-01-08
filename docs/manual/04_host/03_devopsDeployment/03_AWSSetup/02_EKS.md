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
