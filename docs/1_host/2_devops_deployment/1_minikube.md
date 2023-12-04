import AcceptCertificates from './_accept_certificates.md'

# Ethereal Engine on Minikube

## Install kubectl, Helm, Docker, and VirtualBox
If [kubectl](https://kubernetes.io/docs/tasks/tools/), [Helm](https://helm.sh/docs/intro/install/),
[Docker](https://docs.docker.com/get-docker/) and/or [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
aren't already installed on your machine, install them.

You may also need to install [Docker Compose](https://docs.docker.com/compose/install/)

## Download and install minikube
Instructions can be found [here](https://minikube.sigs.k8s.io/docs/start/)

While you can follow the demo instructions there about starting minikube, deploying
some demo deployments, etc. to get a feel for it, before deploying Ethereal Engine you should delete
your minikube cluster, since we have some specific starting requirements.

## Clone Ethereal Engine repo to your local machine
To build the Ethereal Engine Docker image locally, and to have a pre-tested way to run various local
services, you'll need to get the Ethereal Engine repo on your machine. This is most easily
done by running `git clone https://github.com/etherealengine/etherealengine.git`

## Start MinIO & MariaDB server locally via Docker

For simplicity, we recommend running MinIO & MariaDB server on your local machine outside of MicroK8s.

If you run `docker-compose up` from the top-level `/scripts` directory in the Ethereal Engine repo, it will start up MinIO & multiple MariaDB docker containers (as well as a redis server, which is not needed). For mariadb containers, one is intended for local development, runs on port 3306; another, intended for automated testing purposes, runs on port 3305; and the last one, intended for minikube/microk8s testing, runs on port 3304. Once the docker container is stopped, you can start it again by running `npm run dev-docker`.

Alternatively, if you want to just run MinIO & MariaDB on its own without Docker, that's fine too. You'll just have to configure the Helm config file to have the appropriate S3 & SQL server configuration, and possibly change the script `./scripts/build_minikube.sh`.

## Create minikube cluster
Run the following command:
`minikube start --disk-size 40000m --cpus 4 --memory 10124m --addons ingress --driver virtualbox`

This says to start minikube with 40GB of disk space, 4 CPUs, 10GB of memory, using VirtualBox as its
driver, and starting up an nginx ingress service.

The disk space, CPUs, and memory allocation are configurable. These are what we recommend for optimal
running (though the disk space might be a bit more than necessary). When minikube is running,
it will reserve those resources for itself regardless of whether the services in minikube are using
that much.

The 10GB of memory might be the spec with the least wiggle room. Later instructions on building
the Docker image will have it be built in the minikube context. This uses the RAM reserved for minikube,
and the client build process normally uses about 8GB of RAM at its peak. minikube may freeze if
it gets maxed out on RAM, and the Docker build process might freeze indefinitely.

### Starting ingress after minikube has started
If you forget to use `--addons ingress` when starting minikube, you can start nginx later by
running `minikube addons enable ingress`

## Get minikube IP address and edit system hostfile to point to 
Run this command after minikube has started: `minikube ip`
This will get you the address that minikube is running on.

You'll need to edit your hostfile to point certain domains to minikube IP addresses. On Linux,
this is done by running `sudo gedit /etc/hosts`.

Add the following lines:

```conf
<Output of 'minikube ip'>  local.etherealengine.org api-local.etherealengine.org instanceserver-local.etherealengine.org 00000.instanceserver-local.etherealengine.org 00001.instanceserver-local.etherealengine.org 00002.instanceserver-local.etherealengine.org 00003.instanceserver-local.etherealengine.org
10.0.2.2   host.minikube.internal
```

The first line says to point several *-local.etherealengine.org domains internally to the minikube cluster,
where the nginx ingress server will redirect the traffic to the appropriate pod.
The second line is used to give minikube access to your local environment, particularly so that it
can access the MariaDB server.

Make sure to save this file after you've edited it. On Linux, at least, you need root permissions
to edit it.

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

Make sure that kubectl is pointed at minikube by running `kubectl config current-context`,
which should say 'minikube'. You can also run `kubectl config get-contexts` to get all contexts
that kubectl has been configured to run; the current one will have a '*' under the left-most
'current' column.

Once kubectl is pointed to minikube, from the top of the Ethereal Engine repo, run
`helm install -f </path/to/agones-default-values.yaml> agones agones/agones` to install Agones
and `helm install local-redis redis/redis` to install redis.

> [agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

You can run `kubectl get pods -A` to list all of the pods running in minikube. After a minute or so,
all of these pods should be in the Running state.



## Install Elastic Search and Kibana using Helm for Server Logs

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

In order to connect logger with elasticsearch, update `local.minikube.template.values.yaml` env `api.extraEnv.ELASTIC_HOST` for e.g. `http://<username>:<password>@<host>:<port>`

> [local.minikube.template.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.minikube.template.values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

## Run build_minikube.sh
When minikube is running, run the following command from the root of the Ethereal Engine repo:

```bash
./scripts/build_minikube.sh
```

> If you face issue related to `"packages/projects/projects/" does not exist` then run following commands in your terminal:

```bash
export MYSQL_HOST=localhost
npm run dev-docker
npm run dev-reinit
npm run install-projects
```

This points Docker *in the current terminal* to minikube's Docker environment. Anything that Docker builds
will be locally accessible to minikube; if the first main command in the script were not run, Docker would build to your
machine's Docker environment, and minikube would not have access to it.

The script also builds the full-repo Docker image using several build arguments. Vite, which builds
the client files, uses some information from the MariaDB database created for minikube deployments
to fill in some variables, and needs database credentials. The script will supply default values
for all of the MYSQL_* variables if they are not provided to the script, as well as VITE_CLIENT_HOST,
VITE_SERVER_HOST, and VITE_INSTANCESERVER_HOST. The latter three will make your minikube deployment
accessible on `(local/api-local/instanceserver-local).etherealengine.org`; if you want to run it on a different
domain, then you'll have to set those three environment variables to what you want them to be (and also
change the hostfile records you made pointing those subdomains to minikube's IP)

This will build an image of the entire Ethereal Engine repo into a single Docker file. When deployed for
different services, it will only run the parts needed for that service. This may take up to 15 minutes,
though later builds should take less time as things are cached.

## Update Helm Values File

This will use a Helm config file titled 'local.values.yaml' to configure the deployment. There is
a [template](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.minikube.template.values.yaml) for this file in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you are using local file server as explained couple of steps earlier then, update 'local.values.yaml' variable `api.fileServer.hostUploadFolder` with value e.g. '/hosthome/\<OS_USER_NAME\>/\<ENGINE_FOLDER\>/packages/server/upload'. The folder must be in home folder and make sure to use /hosthome/ instead of home in path. Its mandatory to point to `/packages/server/upload` folder of your engine folder.

## Deploy Ethereal Engine Helm chart
Run the following command: `helm install -f </path/to/local.values.yaml> -f </path/to/db-refresh-true.values.yaml> local etherealengine/etherealengine`.

> [db-refresh-true.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/db-refresh-true.values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

After a minute or so, running `kubectl get pods` should show one or more instanceservers, one or more api
servers, and one client server in the Running state. Setting `FORCE_DB_REFRESH=true` made the api servers
(re)initialize the database. Since you don't want that to happen every time a new api pod starts, run
`helm upgrade --reuse-values -f </path/to/db-refresh-false.values.yaml> local etherealengine/etherealengine`.
The API pods will restart and will now not attempt to reinit the database on boot.

> [db-refresh-false.values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/db-refresh-false.values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

## Accept invalid certs

<AcceptCertificates />
