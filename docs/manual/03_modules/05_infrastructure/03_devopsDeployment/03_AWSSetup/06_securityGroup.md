# Security Group 
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
