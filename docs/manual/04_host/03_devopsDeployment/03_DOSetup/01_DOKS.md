# Create DO Kubernetes cluster with four nodepools
You will first need to create a DO Kubernetes cluster cluster to be able to install the EE onto it. There are three different ways in DO with which you can create a kubernetes cluster, these are as following.
- Using DO CLI called `doctl`.
- Using DO API
- Using DO Control Panel

To create a DO cluster with DO CLI you will have to do the following. 
- Install the Digital Ocean CLI called `doctl` using the instructions mentioned [here](https://docs.digitalocean.com/reference/doctl/how-to/install/).
- Create a new Personal Access Token (PAT). You can follow the instructions mentioned [here](https://docs.digitalocean.com/reference/api/create-personal-access-token/)
- Run command `doctl auth init` and provide the PAT generated above to grant access to `doctl`
- Next run the following command 
`doctl kubernetes cluster create \<name> --version \<version> --region \<region>`. This will create a cluster in the region of your choise. This will automatically create a Virtual Private Cloud or VPC for you while the cluster creates. There are other flags that you can give to this command and you can look at all those flags [here](https://docs.digitalocean.com/reference/doctl/reference/kubernetes/cluster/create/).

Once the cluster is up and ready you can start adding node pools to it. 

## create the main nodepool
You will have to create a nodepool where the API and other key services/pods of the Ethereal Engine will be residing. To create a new noodpool go to to your newly created [kubernetes cluster](https://cloud.digitalocean.com/kubernetes/clusters). Go to Cluster -> Resources -> Add a Node Pool. You can give it a name like `np-main` and recommended size is `General Purpose - 2vCPU 8 GB RAM`, but you could always alter the size based on your needs. Once that is done we also would need to enable autoscaling, you can do that by ticking the box called `Autoscale` and then setting the Minimum Nodes to 3 and Maximum Nodes to 10. After adding these settings click the `Add Node Pool(s)` button at the bottom and it should take a few minutes and the nodepool should be created.

## Create nodepool for instanceserver
You will need to create a nodepool where instance servers will be residing. To create a new noodpool on [DO Website](https://cloud.digitalocean.com/kubernetes/clusters), go to Cluster -> Resources -> Add a Node Pool. You can give it a name like `np-instanceserver` and set a size, the recommended size is `CPU Intensive - 2vCPU 4 GB RAM`, but you could always alter the size based on your needs. Once that is done we also would need to enable autoscaling, you can do that by ticking the box called `Autoscale` and then setting the Minimum Nodes to 6 and Maximum Nodes to 16. After adding these settings click the `Add Node Pool(s)` button at the bottom and it should take a few minutes and the nodepool should be created.
## Create nodepool for redis
In Ethereal Engine deployemnt, the Redis deployment gets its own nodepool. To create a new noodpool on [DO Website](https://cloud.digitalocean.com/kubernetes/clusters), go to Cluster -> Resources -> Add a Node Pool. You can give it a name like `np-redis` and set a size, the recommended size is `CPU Intensive - 2vCPU 4 GB RAM`, but you could always alter the size based on your needs. Once that is done we also would need to enable autoscaling, you can do that by ticking the box called `Autoscale` and then setting the Minimum Nodes to 3 and Maximum Nodes to 6. After adding these settings click the `Add Node Pool(s)` button at the bottom and it should take a few minutes and the nodepool should be created.

## create nodepool for builder
We would need to create a new nodepool for running the builder job. To create a new noodpool on [DO Website](https://cloud.digitalocean.com/kubernetes/clusters), go to Cluster -> Resources -> Add a Node Pool. You can give it a name like `np-builder` and set a size, the recommended size is `Basic - 8vCPU 16 GB RAM`, but you could always alter the size based on your needs. We do not need to enable autoscaling for the builder node as we normally are aware of the computational requirnments the build job would need and we could always resize it if the need arises, plus this nodepool is not load intensive. After adding these settings click the `Add Node Pool(s)` button at the bottom and it should take a few minutes and the nodepool should be created.
