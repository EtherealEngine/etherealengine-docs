import AcceptCertificates from './_accept_certificates.md'

# Ethereal Engine on Docker Desktop

## NOTE: UDP networking does not work properly on Docker Desktop as of this writing, as Docker Desktop does not expose the IP addresses/ports of the node publicly, so mediasoup cannot connect over UDP. If you want to test audio/video calling or networked movements, please use minikube.

## Install kubectl, Helm, and Docker Desktop
If [kubectl](https://kubernetes.io/docs/tasks/tools/), [Helm](https://helm.sh/docs/intro/install/),
and/or [Docker Desktop](https://docs.docker.com/desktop/install/linux-install/)
aren't already installed on your machine, install them. Windows and Mac Docker Desktop installation instructions
can be found [here](https://docs.docker.com/desktop/install/windows-install/) and [here](https://docs.docker.com/desktop/install/mac-install/).

You may also need to install [Docker Compose](https://docs.docker.com/compose/install/)

## Clone Ethereal Engine repo to your local machine
To build the Ethereal Engine Docker image locally, and to have a pre-tested way to run various local
services, you'll need to get the Ethereal Engine repo on your machine. This is most easily
done by running `git clone https://github.com/etherealengine/etherealengine.git`

## Start MinIO & MariaDB server locally via Docker

For simplicity, we recommend running MinIO & MariaDB server on your local machine outside of MicroK8s.

If you run `docker-compose up` from the top-level `/scripts` directory in the Ethereal Engine repo, it will start up MinIO & multiple MariaDB docker containers (as well as a redis server, which is not needed). For mariadb containers, one is intended for local development, runs on port 3306; another, intended for automated testing purposes, runs on port 3305; and the last one, intended for minikube/microk8s testing, runs on port 3304. Once the docker container is stopped, you can start it again by running `npm run dev-docker`.

Alternatively, if you want to just run MinIO & MariaDB on its own without Docker, that's fine too. You'll just have to configure the Helm config file to have the appropriate S3 & SQL server configuration, and possibly change the script `./scripts/build_minikube.sh`.

## Enable Kubernetes in Docker Desktop
Inside Docker Desktop, go to Settings. There should be a section for Kubernetes (as of this writing, located
between `Docker Engine` and `Software updates` settings). Click on that, then check the checkbox for Enable Kuberentes,
and then click the button Apply and restart. When Docker Desktop restarts, it should now run a minikube-like Kubernetes
cluster on startup. The Kubernetes context for this should be named `docker-desktop`.

## Edit system hostfile to point EtherealEngine addresses to 127.0.0.1
You'll need to edit your hostfile to point certain domains to 127.0.0.1, which is how Docker Desktop routes traffic
to its Kubernetes cluster. On Linux, this is done by running `sudo gedit /etc/hosts`.

Add the following line:

```
127.0.0.1  local.etherealengine.org api-local.etherealengine.org instanceserver-local.etherealengine.org 00000.instanceserver-local.etherealengine.org 00001.instanceserver-local.etherealengine.org 00002.instanceserver-local.etherealengine.org 00003.instanceserver-local.etherealengine.org
```

You should also see a section that looks like this:

```
# Added by Docker Desktop
# To allow the same kube context to work on the host and the container:
127.0.0.1	kubernetes.docker.internal
# End of section
```

The first line says to point several *-local.etherealengine.org domains internally to the Kubernetes cluster,
where the nginx ingress server will redirect the traffic to the appropriate pod.
The section it automatically added is used for giving Docker containers, including the Kubernetes cluster,
access to the host machine.

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

Make sure that kubectl is pointed at docker-desktop by running `kubectl config current-context`,
which should say 'docker-desktop'. You can also run `kubectl config get-contexts` to get all contexts
that kubectl has been configured to run; the current one will have a '*' under the left-most
'current' column.

Once kubectl is pointed to docker-desktop, from the top of the Ethereal Engine repo, run
`helm install -f </path/to/agones-default-values.yaml> agones agones/agones` to install Agones
and `helm install local-redis redis/redis` to install redis.

> [agones-default-values.yaml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/agones-default-values.yaml) can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

You can run `kubectl get pods -A` to list all of the pods running in docker-desktop. After a minute or so,
all of these pods should be in the Running state.

## Run build_docker_desktop.sh
When docker desktop's Kubernetes cluster is running, run the following command from the root of the Ethereal Engine repo:

```bash
./scripts/build_docker_desktop.sh
```

> If you face issue related to `"packages/projects/projects/" does not exist` then run following commands in your terminal:

```bash
export MYSQL_HOST=localhost
npm run dev-docker
npm run dev-reinit
npm run install-projects
```

The script builds the full-repo Docker image using several build arguments. Vite, which builds
the client files, uses some information from the MariaDB database created for local K8s deployments
to fill in some variables, and needs database credentials. The script will supply default values
for all of the MYSQL_* variables if they are not provided to the script, as well as VITE_CLIENT_HOST,
VITE_SERVER_HOST, and VITE_INSTANCESERVER_HOST. The latter three will make your Docker Desktop K8s deployment
accessible on `(local/api-local/instanceserver-local).etherealengine.org`; if you want to run it on a different
domain, then you'll have to set those three environment variables to what you want them to be (and also
change the hostfile records you made pointing those subdomains to 127.0.0.1)

This will build an image of the entire Ethereal Engine repo into a single Docker file. When deployed for
different services, it will only run the parts needed for that service. This may take up to 15 minutes,
though later builds should take less time as things are cached.

## Update Helm Values File

This will use a Helm config file titled 'local.values.yaml' to configure the deployment. There is
a [template](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/local.dockerdesktop.template.values.yaml) for this file in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

If you are using local file server as explained a couple of steps earlier then, update 'local.values.yaml' variable `api.fileServer.hostUploadFolder` with value e.g. '/hosthome/<OS_USER_NAME>/<ENGINE_FOLDER>/packages/server/upload'. The folder must be in home folder and make sure to use /hosthome/ instead of home in path. It's mandatory to point to `/packages/server/upload` folder of your engine folder.

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
