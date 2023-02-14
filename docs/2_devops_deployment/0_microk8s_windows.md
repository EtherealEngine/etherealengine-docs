# Ethereal Engine on MicroK8s (Windows)

This guide is intended for local environment and currently tested on Windows 11.

## Install Windows Subsystem for Linux (WSL)

Install Ubuntu distribution of Linux from Microsoft Store by using guide [here](https://learn.microsoft.com/en-us/windows/wsl/install).

Alternatively, you can follow these instructions as well:

- [How to install WSL](https://pureinfotech.com/install-wsl-windows-11/)
- [Manual installation steps for WSL](https://learn.microsoft.com/en-us/windows/wsl/install-manual)

Once WSL is installed, make sure to:

- [Set up your Linux username and password](https://learn.microsoft.com/en-us/windows/wsl/setup/environment#set-up-your-linux-username-and-password)
- [Update and upgrade packages](https://learn.microsoft.com/en-us/windows/wsl/setup/environment#update-and-upgrade-packages)

## Install Docker Desktop

Install docker desktop with WSL 2 backend. You can find the instructions [here](https://docs.docker.com/desktop/install/windows-install/).

Once docker desktop is installed and running make sure to enable your WSL distribution. You can do so from Docker Desktop App by visiting `Settings > Resources > WSL Integration`. Make sure to hit 'Apply & Restart'.

![Docker Desktop WSL Distro](./images/docker-desktop-wsl-distro.jpg)

## Enable systemd in WSL

Inside your Ubuntu instance, add the following modification to `/etc/wsl.conf`.

```conf
[boot]
systemd=true
```

Then restart your instance by running `wsl --shutdown` in PowerShell and relaunching Ubuntu. Upon launch you should have systemd running. You can check this with the command `systemctl list-unit-files --type=service` which should show your services status.

You can read more about this on [Ubuntu blog](https://ubuntu.com/blog/ubuntu-wsl-enable-systemd) & [Microsoft blog](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/).

## Enable localhostForwarding in WSL

Create or update `.wslconfig` file located at `C:\Users\{USER_NAME}\.wslconfig` (Or `%UserProfile%\.wslconfig`) with following content:

```conf
[wsl2]
localhostForwarding=true
```

This requires WSL shutdown and reboot. Shutting down your terminal is insufficient. Also machine boot is not required. Simply run:

```bash
wsl --shutdown (in Powershell) or 
wsl.exe --shutdown (within Ubuntu)
```

Reference: [Custom hostname for servers running in WSL 2](https://stackoverflow.com/a/65707003/2077741)

## Install Node

In your WSL Ubuntu terminal, if node (`node --version`) isn't already installed on your machine. You can do so by first installing `nvm` by running following commands:

```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
```

You can verify nvm by using `nvm --version` command. Afterwards, install node by using:

```bash
nvm install node
```

You can verify nvm by using `node --version` command.

## Install Python 3

In your WSL Ubuntu terminal, if python 3 (`pip3 --version`) isn't already installed on your machine. You can do so by running following commands:

```bash
sudo apt-get update -y
sudo apt-get install -y python3-pip
```

You can verify python3 by using `python3 --version` command.

## Install Make

In your WSL Ubuntu terminal, if make (`make --version`) isn't already installed on your machine. You can do so by running following commands:

```bash
sudo apt-get update -y
sudo apt-get install -y build-essential
```

You can verify make by using `make --version` command.

## Install kubectl and Helm

In your WSL Ubuntu terminal, if [kubectl](https://kubernetes.io/docs/tasks/tools/) & [Helm](https://helm.sh/docs/intro/install/) aren't already installed on your machine, install them.

Docker & Docker Compose should be installed if you successfully completed "[Install Docker Desktop](#install-docker-desktop)" step. You can verify by running `docker --version` & `docker-compose --version` commands in WSL Ubuntu terminal.

## Download and install MicroK8s

Make sure to install MicroK8s in your WSL Ubuntu terminal. Instructions can be found [here](https://ubuntu.com/tutorials/install-a-local-kubernetes-with-microk8s#1-overview)

`sudo snap install microk8s --classic --channel=1.26/stable`
> Due to some ongoing issue with host storage access in microk8s 1.25 version, it is recommended to use version 1.26.

While you can follow the demo instructions there about starting MicroK8s, deploying some demo deployments, etc. to get a feel for it.

## Clone Ethereal Engine repo to your local machine

To build the Ethereal Engine Docker image locally, and to have a pre-tested way to run various local services, you'll need to get the Ethereal Engine repo on your machine. This is most easily done by running following command in WSL Ubuntu terminal.

```bash
git clone https://github.com/XRFoundation/XREngine.git ethereal-engine
```

If `.env.local` file does not exist in the root of your repo folder then create it by duplicating `.env.local.default`.

## Start MariaDB server locally via Docker

For simplicity, we recommend running a MariaDB server on your local machine outside of MicroK8s.

In WSL Ubuntu terminal, If you run `docker-compose up` from the top-level `/scripts` directory in the Ethereal Engine repo, it will start up multiple MariaDB docker images (as well as a redis server, which is not needed). One, intended for local development, runs on port 3306; another, intended for automated testing purposes, runs on port 3305; and the last one, intended for minikube/microk8s testing, runs on port 3304. Once the minikube/microk8s MariaDB Docker image is stopped, you can start it again by running `docker start xrengine_minikube_db`.

Alternatively, if you want to just run MariaDB on its own without Docker, that's fine too. You'll just have to configure the Helm config file to have the appropriate SQL server configuration, and possibly change the script `./scripts/build_microk8s.sh`.

## Start local file server

If you're going to have the MicroK8s deployment use a local storage provider, rather than a cloud storage provider like AWS S3, you'll need to have the local file server running on your machine outside of MicroK8s.

In WSL Ubuntu terminal, run `npm install` (or `yarn install` if `npm install` isn't working right; you'd need to install yarn in that case) from the root of the Ethereal Engine repo. When that's finished, go to `packages/server` and run:

```bash
npm run serve-local-files
```

This will start a local file server on port 8642, and will create and serve those files from `packages/server/upload`.

## Enabling MicroK8s Addons

Execute following command in your WSL Ubuntu terminal to enable MicroK8s addons

```bash
sudo microk8s enable dashboard dns registry host-access ingress rbac hostpath-storage helm3
```

## Add MicroK8s to Kubectl

First make sure there is no existing configuration for microk8s in your kubectl config. To do so you run `kubectl config get-contexts` command in WSL Ubuntu terminal and see if the output contains microk8s. You can remove the existing configurations using following commands:

```bash
kubectl config delete-context microk8s
kubectl config delete-cluster microk8s-cluster
kubectl config delete-user microk8s-admin
```

Now, we will add microk8s configuration to kubectl config. We can do this by using following commands in WSL Ubuntu terminal. [Reference](https://discuss.kubernetes.io/t/use-kubectl-with-microk8s/5313/6)

```bash
kubectl config set-cluster microk8s --server=https://127.0.0.1:16443/ --certificate-authority=/var/snap/microk8s/current/certs/ca.crt
kubectl config set-credentials microk8s-admin --token="$(sudo microk8s kubectl config view --raw -o 'jsonpath={.users[0].user.token}')"
kubectl config set-context microk8s --cluster=microk8s --namespace=default --user=microk8s-admin
```

Afterwards you can use this newly create context by executing:

```bash
kubectl config use-context microk8s
```

Now if you run `kubectl config get-contexts` command then microk8s should be current context.

## (Optional) Add MicroK8s to Lens

 If the previous step was performed successfully then you should be able to see MicroK8s cluster in GUI tool [Lens](https://k8slens.dev/). Else you can print the configuration using following command:

```bash
microk8s config
```

In Lens, goto `File` > `Add Cluster` and paste the output of above command to add cluster.

## Enable MicroK8s access for local docker

For MicroK8s we will be using MicroK8s local [registry](https://microk8s.io/docs/registry-built-in)

Option 1: In Windows, add the following lines to `%userprofile%\.docker\daemon.json`. Create this file if it does not already exists.

```json
{ 
    "insecure-registries" : ["http://microk8s.registry:32000", "microk8s.registry:32000"]  
}
```

Afterwards, restart docker from Powershell: `restart-service *docker*`

Option 2: Edit configuration as shown in below image. Make sure to hit 'Apply & Restart' after making changes.

![Docker Desktop Configuration](./images/docker-desktop-configuration.jpg)

Reference:

- [daemon.json file in W1indows](https://stackoverflow.com/a/55352883/2077741)
- [When using buildkit, http needs to be added](https://github.com/docker/docs/blob/62adddbb6b1f8d861c72f6ade2c50977fd57f481/registry/insecure.md#troubleshoot-insecure-registry)
- [Restart Docker service from command line](https://forums.docker.com/t/restart-docker-service-from-command-line/27331/2)

## Verify and troubleshoot MicroK8s

Run following command and check if there is any warning. Its recommended to fix the warnings for MicroK8s to work properly.

```bash
sudo microk8s inspect
```

## Update system hostfile to point to MicroK8s

You'll need to edit your hostfile to point certain domains to host machine IP address. First you need to find the IP address of your WSL. Run `wsl hostname -I` in powershell/cmd. For example:

```shell
C:\Users\hanzl>wsl hostname -I
172.31.89.133 10.1.215.0
```

> Note: If you face issue while running above command, make sure that 'Ubuntu' distribution is selected as default. You can do so by running `wsl /l` to view distributions and then run `wslconfig /s Ubuntu` to select distribution.

From the above output, use `172.31.89.133` as `{WSL_IP}`.

> Note: Your ip would be different, this is just for example.

Next, edit your Windows hostfile, this is done by editing `C:\Windows\System32\drivers\etc\hosts`. Add/Update the following lines:

```conf
{WSL_IP} local.etherealengine.com api-local.etherealengine.com instanceserver-local.etherealengine.com 00000.instanceserver-local.etherealengine.com 00001.instanceserver-local.etherealengine.com 00002.instanceserver-local.etherealengine.com 00003.instanceserver-local.etherealengine.com

{WSL_IP} microk8s.registry
```

Make sure to replace `{WSL_IP}` with ip address from `wsl hostname -I` command.

The first line says to point several *-local.etherealengine.com domains internally to the host machine, where the nginx ingress server will redirect the traffic to the appropriate pod.

Make sure to save this file after you've edited it. Also, you will need to update hostfile with updated ip address after every Windows/WSL reboot.

## Add Helm repos

You'll need to add a few Helm repos. Run the following:

```bash
helm repo add agones https://agones.dev/chart/stable
helm repo add redis https://charts.bitnami.com/bitnami
helm repo add xrengine https://helm.xrengine.io
```

This will add the Helm charts for Agones, Redis, and Ethereal Engine, respectively.

## Install Agones and Redis deployments

After adding those Helm repos, you'll start installing deployments using Helm repos.

Make sure that kubectl is pointed at MicroK8s by running `kubectl config current-context`, which should say 'microk8s'. You can also run `kubectl config get-contexts` to get all contexts that kubectl has been configured to run; the current one will have a '*' under the left-most
'current' column.

Once kubectl is pointed to microk8s, from the top of the Ethereal Engine repo, run `helm install -f packages/ops/configs/agones-default-values.yaml agones agones/agones` to install Agones and `helm install local-redis redis/redis` to install redis.

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

In order to connect logger with elasticsearch, update `packages/ops/configs/local.microk8s.template.values.yaml` env `api.extraEnv.ELASTIC_HOST` for e.g. `http://<username>:<password>@<host>:<port>`

## Run build_microk8s.sh

When microk8s is running, run the following command from the root of the Ethereal Engine repo in WSL Ubuntu terminal:

```bash
export REGISTRY_HOST=microk8s.registry; export MYSQL_HOST=kubernetes.docker.internal;bash ./scripts/build_microk8s.sh
```

> If you face issue related to `"packages/projects/projects/" does not exist` then run following commands in your WSL terminal:

```bash
export MYSQL_HOST=localhost
npm run dev-docker
npm run dev-reinit
npm run install-projects
```

The script builds the full-repo Docker image using several build arguments. Vite, which builds he client files, uses some information from the MariaDB database created for microk8s deployments to fill in some variables, and needs database credentials. The script will supply default values for all of the MYSQL_* variables if they are not provided to the script, as well as VITE_CLIENT_HOST, VITE_SERVER_HOST, and VITE_INSTANCESERVER_HOST. The latter three will make your microk8s deployment accessible on `(local/api-local/instanceserver-local).etherealengine.com`; if you want to run it on a different domain, then you'll have to set those three environment variables to what you want them to be (and also change the hostfile records you made pointing those subdomains)

This will build an image of the entire Ethereal Engine repo into a single Docker file. When deployed for different services, it will only run the parts needed for that service. This may take up to 15 minutes, though later builds should take less time as things are cached.

Once the images are build. It will push it to MicroK8s local registry. You can verify that images are pushed to registry by visiting <http://microk8s.registry:32000/v2/_catalog>.

## Update Helm Values File

This will use a Helm config file titled 'local.values.yaml' to configure the deployment. There is
a [template](./packages/ops/configs/local.microk8s.template.values.yaml) for this file in packages/ops/configs

If you are using local file server as explained couple of steps earlier then, update 'local.values.yaml' variable `api.fileServer.hostUploadFolder` with value similar to '<ENGINE_FULL_PATH>/packages/server/upload' e.g. '/home/<OS_USER_NAME>/<ENGINE_FOLDER>/packages/server/upload'. Its mandatory to point to `/packages/server/upload` folder of your engine folder.

## Deploy Ethereal Engine Helm chart

Run the following command:

```bash
helm install -f </path/to/local.values.yaml> -f ./packages/ops/configs/db-refresh-true.values.yaml local xrengine/xrengine
```

After a minute or so, running `kubectl get pods` should show one or more instanceservers, one or more api servers, and one client server in the Running state. Setting `FORCE_DB_REFRESH=true` made the api servers (re)initialize the database. Since you don't want that to happen every time a new api pod starts, run `helm upgrade --reuse-values -f ./packages/ops/configs/db-refresh-false.values.yaml local xrengine/xrengine`. The API pods will restart and will now not attempt to reinit the database on boot.

## Accept invalid certs

Since there are no valid certificates for this domain, you'll have to tell your browser to ignore the insecure connections when you try to load the application.

Go to <https://local.etherealengine.com/> You should see a warning about an invalid certificate; accept this invalid cert to get to the login page. You'll next have to open the dev tools for your browser and go to the console and/or Network tab. There should be errors on <https://api-local.etherealengine.com>; open that link in a new tab and accept the invalid certificate for that, too.

When you go to <https://local.etherealengine.com/location/default>, you'll have to open the console again, find the erroring <https://instanceserver-local.etherealengine.com>, open that link in a new tab, and accept the invalid certificate for that domain, as well.
