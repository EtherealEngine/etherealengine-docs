:::note
This guide assumes you are using Ubuntu Linux.  
You can find alternative _(and more advanced)_ installation instructions for [Windows](/manual/host/installation/windowsWSL), [Mac](/manual/host/installation/macOSX) and [Linux](/manual/host/installation/intro) in the Manual.
:::

## Install Ethereal Engine and its Pre-requisites
Ethereal Engine can be installed with:
<!-- TODO: Fix this link once the PR is merged -->
```bash
wget -qO- https://raw.githubusercontent.com/EtherealEngine/etherealengine/install.sh | bash -i
npm run dev
```
You can now open Ethereal Engine on your web browser by navigating to https://localhost:3000 

## Install and run the tutorial project
The previous command will have the engine running.  
Lets stop it by pressing `Ctrl+C`, and then run these commands to install and run the Tutorial example template:
```bash
git clone https://github.com/EtherealEngine/ee-tutorial-basic packages/projects/packages/ee-tutorial-basic
npm install
npm run dev
```
