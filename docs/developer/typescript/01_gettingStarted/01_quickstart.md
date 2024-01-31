# Introduction
This QuickStart guide will teach you how to run Ethereal Engine for the first time.  

:::note
This guide assumes you are using Ubuntu Linux.  
You can find alternative _(and more advanced)_ installation instructions for [Windows](/manual/host/installation/windowsWSL), [Mac](/manual/host/installation/macOSX) and [Linux](/manual/host/installation/intro) in the Manual.
:::

## Install Pre-requisites
```bash
# Install git:
sudo apt install git
git --version

# Install nvm:
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
command -v nvm

# Install Node18
nvm install 18
npm --version
node --version

# Install Docker (https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
## Clean conflicting packages
for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
## Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
## Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
## Start docker
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
Open [this link](https://docs.docker.com/desktop/install/ubuntu/#install-docker-desktop) and click on `Download latest DEB package`.  
Make sure you download the `.deb` file into the folder you are currently on right now.
```bash
sudo apt install $(find -type f -path "./docker-desktop-*.deb")
```

## Install and run Ethereal Engine
Ethereal Engine can be installed with:
```bash
git clone https://github.com/EtherealEngine/etherealengine
cd etherealengine
npm install
npm run dev
```
You can now open Ethereal Engine on your web browser by navigating to https://localhost:3000 

## Install and run the tutorial project
Install, run and visit a project by running the following commands from the Ethereal Engine folder:
```bash
git clone https://github.com/EtherealEngine/ee-tutorial-basic packages/projects/packages/ee-tutorial-basic
npm install
npm run dev
```

Once Ethereal Engine is running, from the web admin panel of Ethereal Engine create a 'location' for the project.   
See https://localhost:3000/admin.  
Map the project to the name `basic`.  
Then run the project on the web by visiting it with the URL you created.  
See https://localhost:3000/location/pong

