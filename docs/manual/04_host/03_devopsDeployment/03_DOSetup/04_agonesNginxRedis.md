# Installing Agones, ingress-nginx, and redis for each deployment
You can download the Kubeconfig file from the Digital Ocean Control pannel's Kubernetes cluster section and get that added into the kubectl configurations. 

You next need to add the Agones, ingress-nginx, and redis Helm charts to helm by running 
`helm repo add agones https://agones.dev/chart/stable`, `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`, and `helm repo add redis https://charts.bitnami.com/bitnami`.
You should also at this time add Ethereal Engine's repo via `helm repo add etherealengine https://helm.etherealengine.org`.

If you ever suspect that a chart is out-of-date, run `helm repo update` to update all of them to the latest.

## Install Agones
From the top level of this repo, run `helm install -f \</path/to/agones-default-values.yaml> agones agones/agones`.
This says to install a service called 'agones' from the 'agones' package in the 'agones' chart, and to configure it with
[agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) that can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

## Install redis for each deployment

Each deployment of Ethereal Engine uses a redis cluster for coordinating the 'feathers-sync' library.
Each redis deployment needs to be named the same as the deployment that will use it; for an
Ethereal Engine deployment named 'dig', the corresponding redis deployment would need to be named
'dig-redis'.

Run `helm install -f \</path/to/redis-values.yaml> \<RELEASE_NAME>-redis redis/redis` to install, e.g.
`helm install -f \</path/to/redis-values.yaml> dev-redis redis/redis`.

> [redis-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/redis-values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you named the redis  something other than 'np-redis', you'll have to alter the value in
`redis-values.yaml` in two places to your redis nodepool name.
in your `redis-values.yaml` file, you will also update the Key value to `doks.digitalocean.com/node-pool`. 
If you didn't create a nodepool just for redis, you must omit the ` -f \</path/to/redis-values.yaml> `,
as that config makes redis pods run on a specific nodepool.

## Install ingress-nginx
Open local version of [nginx-ingress-aws-values.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml) file. Remove the aws specific values under the `annotation` sections and add the following DO sepcific values in there.

```service.beta.kubernetes.io/do-loadbalancer-certificate-id: \<Certificate-ID>
  service.beta.kubernetes.io/do-loadbalancer-protocol: https
```

You can run the following command with `doctl` and it should give you the \<Certificate-ID> against the for the certificate that you must already have added via the DO domains.
`doctl compute certificate list`
Get the ID and replace it in the values.yaml file as suggested above. 

Do not commit this file with the ARN inserted; once you've completed this step, revert the file back
to the state it was committed in.

From the top level of this repo, run `helm install -f \</path/to/nginx-ingress-aws-values.yml> nginx ingress-nginx/ingress-nginx`
This says to install a service called 'nginx' from the 'ingress-nginx' package in the 'ingress-nginx' chart, and to configure it with
a file found at [nginx-ingress-aws-values.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/nginx-ingress-aws-values.yml).