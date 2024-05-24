---
sidebar_label: Quickstart
---
import UbuntuInstall from '../../../_partials/installUbuntu.md'
import DefaultProjects from '../../../_partials/defaultProjects.md'

# TypeScript Quickstart
This QuickStart guide will teach you the basics of iR Engine, and how to run the engine for the first time.  

## Installation
<UbuntuInstall />

## Projects
### Default Projects
<DefaultProjects />

### Install and Run the tutorial project
Whether you installed the engine with method above, or with the installation instructions for your specific system, your next step will be to install the tutorial project.

:::danger
This `HelloWorld` project should never be installed in a remote deployment.  
A local version of the engine is required to follow this introductory tutorial.  
:::

The previous commands will have the engine running locally.  
Lets stop it by pressing `Ctrl+C`, and then run these commands to install and run the tutorial's template project:
```bash
git clone -b Step0 https://github.com/EtherealEngine/ee-tutorial-hello packages/projects/projects/ee-tutorial-hello
npm run dev
```

You should now be able to see the `ee-tutorial-hello` project listed in iR Engine's Studio by navigating to https://localhost:3000/studio.

## Confirm the installation
Lets make sure that our `hello world` code is running:
1. Open the project from the Studio by clicking on its card
2. Create a new empty scene

You will know that the code is running if you can see a white sphere in the middle of the scene.  

:::note
You can also enter the scene and move around with an avatar by pressing the `Play` button in the editor like we did before.  
:::
