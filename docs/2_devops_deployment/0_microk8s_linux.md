# Ethereal Engine on MicroK8s (Linux)

This guide is intended for local environment and currently tested on Ubuntu.

## Install Python 3

In your WSL Ubuntu terminal, if python 3 (`pip3 --version`) isn't already installed on your machine. You can do so by running following commands:

```bash
sudo apt-get update -y
sudo apt-get install -y python3-pip
```

You can verify pip3 by using `pip3 --version` command.

## Install Make

In your WSL Ubuntu terminal, if make (`make --version`) isn't already installed on your machine. You can do so by running following commands:

```bash
sudo apt-get update -y
sudo apt-get install -y build-essential
```

You can verify make by using `make --version` command.

## Install kubectl, Helm and Docker

If [kubectl](https://kubernetes.io/docs/tasks/tools/), [Helm](https://helm.sh/docs/intro/install/) and [Docker](https://docs.docker.com/get-docker/) aren't already installed on your machine, install them.

You may also need to install [Docker Compose](https://docs.docker.com/compose/install/)

## Download and install MicroK8s

Instructions can be found [here](https://ubuntu.com/tutorials/install-a-local-kubernetes-with-microk8s#1-overview)

```bash
sudo snap install microk8s --classic --channel=1.26/stable
```

> Due to some ongoing issue with host storage access in microk8s 1.25 version, it is recommended to use version 1.26.

While you can follow the demo instructions there about starting MicroK8s, deploying some demo deployments, etc. to get a feel for it.

## Clone Ethereal Engine repo to your local machine

To build the Ethereal Engine Docker image locally, and to have a pre-tested way to run various local services, you'll need to get the Ethereal Engine repo on your machine. This is most easily done by running following command in WSL Ubuntu terminal.

```bash
git clone https://github.com/etherealengine/etherealengine.git etherealengine
```

If `.env.local` file does not exist in the root of your repo folder then create it by duplicating `.env.local.default`.

## Start MinIO & MariaDB server locally via Docker

For simplicity, we recommend running MinIO & MariaDB server on your local machine outside of MicroK8s.

If you run `docker-compose up` from the top-level `/scripts` directory in the Ethereal Engine repo, it will start up MinIO & multiple MariaDB docker containers (as well as a redis server, which is not needed). For mariadb containers, one is intended for local development, runs on port 3306; another, intended for automated testing purposes, runs on port 3305; and the last one, intended for minikube/microk8s testing, runs on port 3304. Once the docker container is stopped, you can start it again by running `npm run dev-docker`.

Alternatively, if you want to just run MinIO & MariaDB on its own without Docker, that's fine too. You'll just have to configure the Helm config file to have the appropriate S3 & SQL server configuration, and possibly change the script `./scripts/build_microk8s.sh`.

## Enabling MicroK8s Addons

Execute following command in your terminal to enable MicroK8s addons

`sudo microk8s enable dashboard dns registry host-access ingress rbac hostpath-storage helm3`

## Add MicroK8s to Kubectl

First make sure there is no existing configuration for microk8s in your kubectl config. To do so you run `kubectl config get-contexts` command in terminal and see if the output contains microk8s. You can remove the existing configurations using following commands:

```bash
kubectl config delete-context microk8s
kubectl config delete-cluster microk8s-cluster
kubectl config delete-user microk8s-admin
```

Now, we will add microk8s configuration to kubectl config. We can do this by using following commands. [Reference](https://discuss.kubernetes.io/t/use-kubectl-with-microk8s/5313/6)

```bash
kubectl config set-cluster microk8s --server=https://127.0.0.1:16443/ --certificate-authority=/var/snap/microk8s/current/certs/ca.crt
kubectl config set-credentials microk8s-admin --token="$(sudo microk8s kubectl config view --raw -o 'jsonpath={.users[0].user.token}')"
kubectl config set-context microk8s --cluster=microk8s --namespace=default --user=microk8s-admin
```

Afterwards you can use this newly create context by executing `kubectl config use-context microk8s`

Now if you run `kubectl config get-contexts` command then microk8s should be current context.

## (Optional) Add MicroK8s to Lens

 If the previous step was performed successfully then you should be able to see MicroK8s cluster in GUI tool [Lens](https://k8slens.dev/). Else you can print the configuration using following command:

`microk8s config`

Option 1: If you have kubectl already installed, use `sudo gedit ~/.kube/config` as add the above output in it.  
Option 2: In Lens, goto `File` > `Add Cluster` and paste the output of above command to add cluster.

## Enable MicroK8s access for local docker

For MicroK8s we will be using MicroK8s local [registry](https://microk8s.io/docs/registry-built-in)

Add the following lines to `/etc/docker/daemon.json`. On Linux, this is done by running `sudo gedit /etc/docker/daemon.json`.  

```json
{ 
    "insecure-registries" : ["localhost:32000"]  
}
```

Afterwards, restart docker with: `sudo systemctl restart docker`

## Verify and troubleshoot MicroK8s

Run `sudo microk8s inspect` and check if there is any warning. Its recommended to fixed the warning for MicroK8s to work properly. Following are some of the warnings and their possible fixes:

1. WARNING:  This machine's hostname contains capital letters and/or underscores. This is not a valid name for a Kubernetes node, causing node registration to fail. Please change the machine's hostname or refer to the documentation for more details.

    Possible Fix: <https://askubuntu.com/a/87687/1558816>

2. WARNING:  The memory cgroup is not enabled. The cluster may not be functioning properly. Please ensure cgroups are enabled  

    Possible Fix: <https://github.com/canonical/microk8s/issues/1691#issuecomment-1265788228>

3. WARNING: IPtables FORWARD policy is DROP. Consider enabling traffic forwarding with: `sudo iptables -P FORWARD ACCEPT`

    The change can be made persistent with: `sudo apt-get install iptables-persistent`

4. MicroK8s is not running. Use microk8s inspect for a deeper inspection.

    Possible Fix: <https://lightrun.com/answers/canonical-microk8s-microk8s-is-not-running-microk8sinspect-showing-no-error>

    Here this error cloud be due to conflicting kubectl being installed. Use this command to remove kubectl `sudo rm -rf /usr/local/bin/kubectl`

## Update system hostfile to point to MicroK8s

You'll need to edit your hostfile to point certain domains to host machine IP address. On Linux, this is done by running `sudo gedit /etc/hosts`.

Add/Update the following lines:

`127.0.0.1 local.etherealengine.org api-local.etherealengine.org instanceserver-local.etherealengine.org 00000.instanceserver-local.etherealengine.org 00001.instanceserver-local.etherealengine.org 00002.instanceserver-local.etherealengine.org 00003.instanceserver-local.etherealengine.org`

The first line says to point several *-local.etherealengine.org domains internally to the host machine, where the nginx ingress server will redirect the traffic to the appropriate pod.

Make sure to save this file after you've edited it. On Linux, at least, you need root permissions to edit it.

## Add Helm repos

You'll need to add a few Helm repos. Run the following:

```bash
helm repo add agones https://agones.dev/chart/stable
helm repo add redis https://charts.bitnami.com/bitnami
helm repo add etherealengine https://helm.etherealengine.org
```

This will add the Helm charts for Agones, Redis, and Ethereal Engine, respectively.

## Install Agones and Redis deployments

After adding those Helm repos, you'll start installing deployments using Helm repos.

Make sure that kubectl is pointed at MicroK8s by running `kubectl config current-context`, which should say 'microk8s'. You can also run `kubectl config get-contexts` to get all contexts that kubectl has been configured to run; the current one will have a '*' under the left-most
'current' column.

Once kubectl is pointed to microk8s, from the top of the Ethereal Engine repo, run `helm install -f </path/to/agones-default-values.yaml> agones agones/agones --version "1.31.0"` to install Agones and `helm install local-redis redis/redis` to install redis.

> [agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

You can run `kubectl get pods -A` to list all of the pods running in microk8s. After a minute or so, all of these pods should be in the Running state.

## (Optional) Install Elastic Search and Kibana using Helm for Server Logs

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

After you set up port-forwarding, access Elasticsearch, and the Kibana GUI by typing `http://localhost:5601` in your browser

In order to connect logger with elasticsearch, update `local.microk8s.template.values.yaml` env `api.extraEnv.ELASTIC_HOST` for e.g. `http://<username>:<password>@<host>:<port>`

> [local.microk8s.template.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.microk8s.template.values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

## Run build_microk8s.sh

When microk8s is running, run the following command from the root of the Ethereal Engine repo:

```bash
./scripts/build_microk8s.sh
```

> If you face issue related to `"packages/projects/projects/" does not exist` then run following commands in your terminal:

```bash
export MYSQL_HOST=localhost
npm run dev-docker
npm run dev-reinit
npm run install-projects
```

The script builds the full-repo Docker image using several build arguments. Vite, which builds he client files, uses some information from the MariaDB database created for microk8s deployments to fill in some variables, and needs database credentials. The script will supply default values for all of the MYSQL_* variables if they are not provided to the script, as well as VITE_CLIENT_HOST, VITE_SERVER_HOST, and VITE_INSTANCESERVER_HOST. The latter three will make your microk8s deployment accessible on `(local/api-local/instanceserver-local).etherealengine.org`; if you want to run it on a different domain, then you'll have to set those three environment variables to what you want them to be (and also change the hostfile records you made pointing those subdomains)

This will build an image of the entire Ethereal Engine repo into a single Docker file. When deployed for different services, it will only run the parts needed for that service. This may take up to 15 minutes, though later builds should take less time as things are cached.

Once the images are build. It will push it to MicroK8s local registry. You can verify that images are pushed to registry by visiting <http://localhost:32000/v2/_catalog>.

## Update Helm Values File

This will use a Helm config file titled 'local.values.yaml' to configure the deployment. There is
a [template](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.microk8s.template.values.yaml) for this file in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you are using local file server as explained couple of steps earlier then, update 'local.values.yaml' variable `api.fileServer.hostUploadFolder` with value similar to '<ENGINE_FULL_PATH>/packages/server/upload' e.g. '/home/<OS_USER_NAME>/<ENGINE_FOLDER>/packages/server/upload'. Its mandatory to point to `/packages/server/upload` folder of your engine folder.

## Deploy Ethereal Engine Helm chart

Run the following command: `helm install -f </path/to/local.values.yaml> -f </path/to/db-refresh-true.values.yaml> local etherealengine/etherealengine`.

> [db-refresh-true.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/db-refresh-true.values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

After a minute or so, running `kubectl get pods` should show one or more instanceservers, one or more api servers, and one client server in the Running state. Setting `FORCE_DB_REFRESH=true` made the api servers (re)initialize the database. Since you don't want that to happen every time a new api pod starts, run `helm upgrade --reuse-values -f </path/to/db-refresh-false.values.yaml> local etherealengine/etherealengine`. The API pods will restart and will now not attempt to reinit the database on boot.

> [db-refresh-false.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/db-refresh-false.values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

## Accept invalid certs

Since there are no valid certificates for this domain, you'll have to tell your browser to ignore the insecure connections when you try to load the application.

Go to <https://local.etherealengine.org/> You should see a warning about an invalid certificate; accept this invalid cert to get to the login page. You'll next have to open the dev tools for your browser and go to the console and/or Network tab. There should be errors on <https://api-local.etherealengine.org>; open that link in a new tab and accept the invalid certificate for that, too.

When you go to <https://local.etherealengine.org/location/default>, you'll have to open the console again, find the erroring <https://instanceserver-local.etherealengine.org>, open that link in a new tab, and accept the invalid certificate for that domain, as well.
