## Create IAM Roles for S3/SES/SNS (or a single admin role)

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
 
* S3: `AmazonS3FullAccess, CloudFrontFullAccess`
* SNS: `AmazonSNSFullAccess`

You'll also need to create an IAM user that GitHub Actions can use to access the cluster and push/pull
Docker images from ECR. By convention, we call this user 'EKSUser', and it needs these
permissions: `AmazonEKSClusterPolicy, AmazonEKSWorkerNodePolicy, AmazonEKSServicePolicy, AmazonElasticContainerRegistryPublicFullAccess, AmazonEC2ContainerRegistryFullAccess`

### Creating new credentials for an IAM user
If you ever lose the secret to a user, or want to make new credentials for whatever reason, go to
IAM->Users and click on that user. Click on the 'Security credentials' tab, and under 'Access keys' you
should see a button 'Create access key' and, underneath that, 0-2 existing keys with some information
about them and an 'x' on the far right to delete it. If there are two keys for that user, you 
must deactivate and delete one of them before making a new one.

Click the Create button, then make sure to save the public and secret keys somewhere and put them into
the Helm config file.

### Apply aws-auth with EKS user ARN to cluster

Only the IAM user who created the EKS cluster initially has access to the cluster, even if another
user has all of the required policies/permissions, up to and including the Admin policy. In order
for other users to have access to the cluster, the aws-auth ConfigMap in the cluster needs to be
modified to explicitly grant them permission to access the cluster.

In the ethereal-engine-ops repository, there is a template aws-auth.yaml file at
configs/aws-auth-template.yml. Make a copy of this template, and shorten its name to `aws-auth.yml`. Run 
`kubectl describe configmap aws-auth -n kube-system` to get the current copy of the aws-auth ConfigMap.
It should look something like this:

```
Data
====
mapRoles:
----
- groups:
  - system:bootstrappers
  - system:nodes
  rolearn: arn:aws:iam::<accountId>:role/eksctl-etherealengine-test-nodegro-NodeInstanceRole-dXwOpisgTD1e
  username: system:node:{{EC2PrivateDNSName}}

mapUsers:
----
- groups:
  - system:masters
  userarn: arn:aws:iam::<accountId>:user/etherealengine-eks
  username: etherealengine-eks


```

Copy the value of rolearn in the entry for mapRoles in and paste that in the template copy to replace `<rolearn>`.

In the mapUsers section, you'll need to make as many copies of 

```
- groups:
  - system:masters
  userarn: arn:aws:iam::<account_id>:user/etherealengine-eks
  username: etherealengine-eks
```

as you want users to have access to the cluster. Make sure to have an entry for the user who made the cluster;
in the example above, that's `etherealengine-eks`. Replace `<account_id>` with the AWS account ID, and 
both instances of `<IAM_username>` with the username you want to grant access.

Note that you should NOT put any value for `{{EC2PrivateDNSName}}`; that gets evaluated by AWS in real-time. 

After the ConfigMap is ready, run `kubectl apply -f <path/to/aws-auth.yml>`. It will update the ConfigMap
with the contents of aws-auth.yml.

If you want to add a new user to the cluster, you will need to make another entry in the mapUsers section
with their username and run `kubectl apply -f <path/to/aws-auth.yml>`. You have to keep all of the other 
user entries, as the contents of the ConfigMap get replaced wholesale with whatever is in aws-auth.yml.
To remove a user's access from the cluster, remove their entry from mapUsers and `kubectl apply` the file.
