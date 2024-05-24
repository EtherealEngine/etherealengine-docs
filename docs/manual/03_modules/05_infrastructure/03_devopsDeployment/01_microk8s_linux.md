import AcceptCertificates from '../../../_partials/acceptCertificates.md'
import PythonUbuntu from '../../../_partials/pythonUbuntu.md'
import MakeUbuntu from '../../../_partials/makeUbuntu.md'

# iR Engine on MicroK8s (Linux)

This guide has been tested on Ubuntu, and it is intended for local deployment only.

<PythonUbuntu />

<MakeUbuntu />

## Install kubectl, Helm and Docker

Install [kubectl](https://kubernetes.io/docs/tasks/tools/), [Helm](https://helm.sh/docs/intro/install/) and [Docker](https://docs.docker.com/get-docker/) on your device if they aren't already installed.  
You may also need to install [Docker Compose](https://docs.docker.com/compose/install/)

## Download and install MicroK8s
```bash
sudo snap install microk8s --classic --channel=1.26/stable
```
> Note: It is recommended to use microk8s version >=1.26 due to an issue with host storage access in version 1.25.

Another alternative is to follow the instructions for how to [install Kubernetes with MicroK8s](https://ubuntu.com/tutorials/install-a-local-kubernetes-with-microk8s#1-overview) in a local environment. This will help you learn more about how MicroK8s deployment works.  

## Download iR Engine
To build the iR Engine Docker image locally, and to have a pre-tested way to run various local services, you'll need to download the iR Engine repository to your device. The easiest way to do this is by running the following command in your Ubuntu terminal:
```bash
git clone https://github.com/etherealengine/etherealengine.git
```
You can create an `.env.local` file by duplicating `.env.local.default` if it does not already exist in the root folder of iR Engine's repository.

## Start MinIO & MariaDB
We recommend running MinIO & MariaDB server on your local machine via Docker and outside of MicroK8s.

Running the command `docker-compose up` from the top-level `/scripts` directory of the iR Engine repository will also start MinIO and multiple MariaDB docker containers _(as well as an optional redis server)_:
1. Port **3306**: Server for local development
2. Port **3305**: Server for automated testing
3. Port **3304**: Server for minikube/microk8s testing
> You can start the docker container by running `npm run dev-docker` the next time you need to start it.

Alternatively, you could run MinIO & MariaDB on their own without Docker. You'll have to configure the Helm config file to have the appropriate S3 & SQL server configuration, and possibly also change the `./scripts/build_microk8s.sh` script.

## Enable MicroK8s Addons
The following command will enable the required MicroK8s addons:
```bash
sudo microk8s enable dashboard dns registry host-access ingress rbac hostpath-storage helm3
```

## Add MicroK8s to Kubectl
First make sure there is no existing configuration for microk8s in your kubectl config.  
To do so, run the following command in your Ubuntu terminal and check if the output contains `microk8s`.
```bash
kubectl config get-contexts
```
You can remove any existing configurations using the following commands:
```bash
kubectl config delete-context microk8s
kubectl config delete-cluster microk8s-cluster
kubectl config delete-user microk8s-admin
```

Next we will add microk8s configuration to kubectl config by running the following commands (from [Reference](https://discuss.kubernetes.io/t/use-kubectl-with-microk8s/5313/6)):
```bash
kubectl config set-cluster microk8s --server=https://127.0.0.1:16443/ --certificate-authority=/var/snap/microk8s/current/certs/ca.crt
kubectl config set-credentials microk8s-admin --token="$(sudo microk8s kubectl config view --raw -o 'jsonpath={.users[0].user.token}')"
kubectl config set-context microk8s --cluster=microk8s --namespace=default --user=microk8s-admin
```

Afterwards you can use the newly created context by executing:
```bash
kubectl config use-context microk8s
```

Check that microk8s is the current context with:
```bash
kubectl config get-contexts
```

## Add MicroK8s to Lens (Optional)
You should now see the MicroK8s cluster in the [K8s Lens](https://k8slens.dev/) GUI tool.  

Troubleshooting:  
If you don't see it, it means that the previous step was not performed successfully.
You can print the current configuration using the command:
```bash
microk8s config
```
- Option 1:  
  If you have kubectl already installed, use `sudo gedit ~/.kube/config` and add the output of `microk8s config` into the file.  
- Option 2:  
  In [Lens](https://k8slens.dev/), goto `File` > `Add Cluster` and paste the output of `microk8s config`.

## Enable MicroK8s access for local docker
For MicroK8s we will use MicroK8s local [registry](https://microk8s.io/docs/registry-built-in)

Add the following lines to `/etc/docker/daemon.json`.  
> On Linux, this is can be done by running `sudo gedit /etc/docker/daemon.json`.  
```json
{
  "insecure-registries": ["localhost:32000"]  
}
```
Afterwards, restart docker with:
```bash
sudo systemctl restart docker
```

## Troubleshooting MicroK8s
Its recommended to fix all MicroK8s warnings for it to work properly.  
You can check if there are any warnings by running:
```bash
sudo microk8s inspect
```

These are some possible warnings and their potential fixes:

1. WARNING:  This machine's hostname contains capital letters and/or underscores. This is not a valid name for a Kubernetes node, causing node registration to fail. Please change the machine's hostname or refer to the documentation for more details.

    Possible Fix: [https://askubuntu.com/a/87687/1558816](https://askubuntu.com/a/87687/1558816)

2. WARNING:  The memory cgroup is not enabled. The cluster may not be functioning properly. Please ensure cgroups are enabled  

    Possible Fix: [https://github.com/canonical/microk8s/issues/1691#issuecomment-1265788228](https://github.com/canonical/microk8s/issues/1691#issuecomment-1265788228)

3. WARNING: IPtables FORWARD policy is DROP. Consider enabling traffic forwarding with: `sudo iptables -P FORWARD ACCEPT`

    The change can be made persistent with: `sudo apt-get install iptables-persistent`

4. MicroK8s is not running. Use microk8s inspect for a deeper inspection.

    Possible Fix: [https://lightrun.com/answers/canonical-microk8s-microk8s-is-not-running-microk8sinspect-showing-no-error](https://lightrun.com/answers/canonical-microk8s-microk8s-is-not-running-microk8sinspect-showing-no-error)

    Here this error cloud be due to conflicting kubectl being installed. Use this command to remove kubectl `sudo rm -rf /usr/local/bin/kubectl`

## Update the hosts file
You'll need to edit your `hosts` file to redirect certain domains to your host machine IP address.  
Add or update the following line into your `/etc/hosts` file:  
```
127.0.0.1 local.etherealengine.org api-local.etherealengine.org instanceserver-local.etherealengine.org 00000.instanceserver-local.etherealengine.org 00001.instanceserver-local.etherealengine.org 00002.instanceserver-local.etherealengine.org 00003.instanceserver-local.etherealengine.org
```
> On Linux this can be done by running `sudo gedit /etc/hosts`  
> Make sure to save the file after editing. You will need administrator permissions to do so.

This will redirect several `*-local.etherealengine.org` domains internally to the host machine. `nginx` ingress server will now be able to redirect the traffic to the appropriate iR Engine pod.

## Add Helm repositories
You'll need to add a few Helm chart repositories. You can do so by running the following commands:
```bash
helm repo add agones https://agones.dev/chart/stable
helm repo add redis https://charts.bitnami.com/bitnami
helm repo add etherealengine https://helm.etherealengine.org
```
This will add the Helm charts for Agones, Redis and iR Engine, respectively.

## Install Agones and Redis deployments
From here on, deployments will be installed using Helm repositories.

Make sure that kubectl is pointed at MicroK8s by running this command:
```bash
kubectl config current-context
```
> It should say `microk8s`

You can also run this command to get all contexts that kubectl has been configured to run:
```bash
kubectl config get-contexts
```
> The current context will have a `*` under the left-most `current` column.

Once kubectl is pointed to MicroK8s, run these commands from the top of the iR Engine repo to install Agones and Redis:  
```bash
helm install -f </path/to/agones-default-values.yaml> agones agones/agones
helm install local-redis redis/redis
```
> Important:  
> Make sure to change `/path/to/agones-default-values.yaml` with the actual path of the file.  
> The [agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) file can be found in the [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repository.

After a minute or so, all of these pods should be in the `Running` state.
You can run this command to list all of the pods running in MicroK8s.
```bash
kubectl get pods -A
```

## Install Elastic Search and Kibana (Optional)
Install Elasticsearch by adding the `elastic` repository with Helm:
```bash
helm repo add elastic https://helm.elastic.co
```

Download the `values.yaml` file containing Elasticsearch's configuration information using `curl`:
```bash
curl -O https://raw.githubusercontent.com/elastic/helm-charts/master/elasticsearch/examples/minikube/values.yaml
```

Install the Elasticsearch Helm chart with `helm install` and pass the `values.yaml` file that we just downloaded to the command:
```bash
helm install elasticsearch elastic/elasticsearch -f ./values.yaml
```
> The -f option allows specifying the yaml file with the template.

> You can add the `-n` option, followed by a name, to install Elasticsearch in a specific namespace:
> ```bash
> helm install elasticsearch elastic/elasticsearch -n [namespace] -f ./values.yaml
> ```

Check if the cluster members are running:
```bash
kubectl get pods --namespace=default -l app=elasticsearch-master -w
```
> Another option is to use the helm test command to examine the cluster’s health:
> ```bash
> helm test elasticsearch
> ```

Install Kibana on top of Elasticsearch:
```bash
helm install kibana elastic/kibana
```

Check if all of the pods are ready:
```bash
kubectl get pods
```

After port-forwarding has been setup, Elasticsearch and the Kibana GUI can be accessed by navigating to http://localhost:5601 in your browser.

Edit the file `local.microk8s.template.values.yaml` and update the env variable `api.extraEnv.ELASTIC_HOST` to connect the logger with Elasticsearch:  
```bash
http://<username>:<password>@<host>:<port>
```
> The file [local.microk8s.template.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.microk8s.template.values.yaml) can be found in the [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

## Build MicroK8s
Run the following command from the root of the iR Engine repository after MicroK8s is running:
```bash
./scripts/build_microk8s.sh
```
> Note: If you get the error `"packages/projects/projects/" does not exist`, run the following commands in your terminal:
> ```bash
> export MYSQL_HOST=localhost
> npm run dev-docker
> npm run dev-reinit
> npx ts-node --swc scripts/install-projects.js
> ```

This _build_microK8s_ script will build an image of the entire iR Engine repository into a single Docker file.

Vite builds the client files using some information from the MariaDB database created for MicroK8s deployments to fill in some variables, and it needs database credentials.  
The script will supply default values for all of the `MYSQL_*` variables if they are not provided to the script, as well as `VITE_CLIENT_HOST`, `VITE_SERVER_HOST`, and `VITE_INSTANCESERVER_HOST`.
> The latter three will make your MicroK8s deployment accessible on `(local/api-local/instanceserver-local).etherealengine.org`;
> If you want to run it on a different domain, then you'll have to set those three environment variables to what you want them to be (and also change the `hosts` file records you made to redirect to those subdomains.

> This process may take up to 15 minutes when run for the first time.  
> Consecutive builds will take less time. The process has caching support.

> When built for targeting multiple services, the resulting docker file will only deploy and run the parts needed for each individual service.

Once the images are built, the script will push the result to the MicroK8s local registry.  
You can verify that the images are pushed correctly by visiting http://localhost:32000/v2/_catalog

## Update Helm Values File
This will use a Helm config file titled `local.values.yaml` to configure the deployment.  
There is a [template](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.microk8s.template.values.yaml) for this file in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you are using a local file server, as explained in one of the previous steps, you will need to update the variable `api.fileServer.hostUploadFolder` in the `local.values.yaml` file with a value similar to `ENGINE_FULL_PATH/packages/server/upload`.  
_e.g. `/home/username/etherealengine/packages/server/upload`._  
It is mandatory that it points to the `/packages/server/upload` folder of your iR Engine folder.

## Deploy iR Engine Helm chart
Run the following command:
```bash
helm install -f </path/to/local.values.yaml> -f </path/to/db-refresh-true.values.yaml> local etherealengine/etherealengine
```
> Important:  
> Make sure to change `/path/to/local.values.yaml` and `/path/to/db-refresh-true.values.yaml` with the actual path of the files.  
> The file [db-refresh-true.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/db-refresh-true.values.yaml) can be found in the [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repository.

After a minute or so, running `kubectl get pods` should show one or more instanceservers, one or more api servers, and one client server in the Running state.

Setting the option `FORCE_DB_REFRESH=true` made the api servers (re)initialize the database.  
Since you don't want that to happen every time a new api pod starts, run the following command to restart the API pods and configure them to not reinit the database on boot.
```bash
helm upgrade --reuse-values -f </path/to/db-refresh-false.values.yaml> local etherealengine/etherealengine
```
> Important:  
> Make sure to change `/path/to/db-refresh-true.values.yaml` with the actual path of the file.  
> The file [db-refresh-false.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/db-refresh-false.values.yaml) can be found in the [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repository.


## Accept invalid certs

<AcceptCertificates />
