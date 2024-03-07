:::important
Ethereal Engine is a web application.  
We are going to install and run a local version of the engine.  
But this setup might not reflect how you will use the engine on a day to day basis.  
:::

:::note
These installation instructions assume you are using Ubuntu Linux.  
You can find alternative _(and more advanced)_ installation instructions for [Windows](/manual/install/windowsWSL), [Mac](/manual/install/macOSX) and [Linux](/manual/install/linux) in the Manual.
:::

If you are on Ubuntu Linux, there is an automatic installation script to setup and run a local version of Ethereal Engine.  
Open a terminal window and run these two lines:  
> Make sure that you open the terminal in the folder where you want to install the engine
```bash
wget https://raw.githubusercontent.com/EtherealEngine/etherealengine/dev/scripts/ubuntu-install.sh && bash -i ./ubuntu-install.sh
npm run reinit && npm run dev
```
You can now open Ethereal Engine on your web browser by navigating to https://localhost:3000
