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
