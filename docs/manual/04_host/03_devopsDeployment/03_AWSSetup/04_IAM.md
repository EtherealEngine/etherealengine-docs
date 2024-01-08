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
