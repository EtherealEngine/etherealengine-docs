# Agones, ingress-nginx and Redis
## Install Agones, ingress-nginx, and a copy of redis for each deployment

Now that the cluster is up and running, we can install everything onto it.
When you created the cluster with eksctl, it should have created a context pointing to
it in kubectl. Run ```kubectl config get-contexts``` to get all of the contexts it knows about;
the one with a star next to it should be named ```<your_AWS_username>@<cluster_name>```.
If that isn't present, you'll have to edit the configuration to make the appropriate context.

You next need to add the Agones, ingress-nginx, and redis Helm charts to helm by running 
```helm repo add agones https://agones.dev/chart/stable```, ```helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx```, and ```helm repo add redis https://charts.bitnami.com/bitnami```.
You should also at this time add iR Engine's repo via ```helm repo add etherealengine https://helm.etherealengine.org```.

If you ever suspect that a chart is out-of-date, run ```helm repo update``` to update all of them to the latest.

### Install Agones
From the top level of this repo, run ```helm install -f </path/to/agones-default-values.yaml> agones agones/agones```.
This says to install a service called 'agones' from the 'agones' package in the 'agones' chart, and to configure it with
[agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) that can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

### Install redis for each deployment

Each deployment of iR Engine uses a redis cluster for coordinating the 'feathers-sync' library.
Each redis deployment needs to be named the same as the deployment that will use it; for an
iR Engine deployment named 'dev', the corresponding redis deployment would need to be named
'dev-redis'.

Run ```helm install -f </path/to/redis-values.yaml> <RELEASE_NAME>-redis redis/redis``` to install, e.g.
```helm install -f </path/to/redis-values.yaml> dev-redis redis/redis```.

> [redis-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/redis-values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you named the redis nodegroup something other than 'ng-redis-1', you'll have to alter the value in
`redis-values.yaml` in two places to your redis nodegroup name.
If you didn't create a nodegroup just for redis, you must omit the ` -f </path/to/redis-values.yaml> `,
as that config makes redis pods run on a specific nodegroup.

#### Installing redis as part of iR Engine chart (not recommended for production)
Redis can be installed as part of the iR Engine chart so long as the config file for the iR Engine installation has 'redis.enabled' set to true.
In that case, you should skip the above step of installing redis separately. This is not recommended for production
environments, though, since upgrades to an iR Engine installation will usually reboot the redis servers,
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
