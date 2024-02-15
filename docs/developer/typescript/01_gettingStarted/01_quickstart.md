---
sidebar_label: Quickstart
---
import UbuntuInstall from '../../../_partials/installUbuntu.md'

# Typescript Quickstart
This QuickStart guide will teach you the basics of Ethereal Engine, and how to run the engine for the first time.  

## Installation
<UbuntuInstall />

### Install and run the tutorial project
The previous command will have the engine running.  
Lets stop it by pressing `Ctrl+C`, and then run these commands to install and run the Tutorial example template:
```bash
git clone https://github.com/EtherealEngine/ee-tutorial-hello packages/projects/packages/ee-tutorial-hello
npm install
npm run dev
```

You should now be able to see the `ee-tutorial-hello` project listed in Ethereal Engine's Studio by navigating to https://localhost:3000/studio

### Confirm the installation
Lets make sure that our `hello world` code is running:
1. Open the project from the Studio by clicking on its card
2. Create a new empty scene

You will know that the code is running if you can see a white sphere in the middle of the scene.  

:::note
You can also enter the scene and move around with an avatar by pressing the `Play` button in the editor.  
:::
