--- 
hide_table_of_contents: true
---

# Getting Started

<iframe width="100%" height="600" src="https://www.youtube.com/embed/0sN8755A4Mw?&theme=dark&autohide=2&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>

The Ethereal Engine Control Center is a self-contained Metaverse world in a box. Take what you need or launch the full stack. Ethereal Engine Control Center is a desktop app to manage an Ethereal Engine cluster.

We know it's been complicated to build with Ethereal Engine and we've made this tool to give the community easy access to the engine. We would love to see your creations and invite you all to come build with us.

This video gives a complete walk through of how to get started with Control Center app. Below are the different sections covered in it.

## Installation

In order to download Ethereal Engine control center app, navigate to **<u>[releases](https://github.com/etherealengine/Ethereal-Control-Center/releases)</u>** page and download the latest version of AppImage.

Once downloaded, right click and go to **Properties** of App Image. In **Permissions** tab check 'Allow executing file as program'. Afterwards, double click on AppImage to launch the app.

If you are unable to launch app (or on Ubuntu 22.04), then run following command in terminal.

```
sudo apt-get install fuse libfuse2
```

## App Overview

The app provides access to various functionalities which includes:

- Configure your Ethereal Engine in a cluster.
- View status of your Ethereal Engine dependencies.
- Manage an Ethereal Engine deployment through admin panel.
- Manage kubernetes cluster through dashboard.
- Manage IPFS node running in the cluster.
- Execute commands against rippled server.
- See realtime logs of different actions being performed.

## Configure

The configure wizard allows to easily setup your Ethereal Engine deployment. It will first ask for the authentication credentials for logged in user to perform actions with sudo access.

For basic setup, go with the default values in configuration wizard.

For advanced setup, if you want to configure oAuth, S3 file storage, email, SMS support then you can provide values in configuration wizard.

Once the configuration started it will take time based on the required app to be installed on your machine. You can watch the logs of different actions being performed and their output in logs section of the main screen.

## Launch Ethereal Engine

Once all the tick marks in control center are green and launch button is enabled. Please hit on Launch button to open Ethereal Engine in your browser.

Make sure to allow certificates as show in videos and also explained **<u>[here](https://etherealengine.github.io/etherealengine-docs/docs/installation/install_troubleshooting#invalid-certificate-errors-in-local-environment)</u>**

## Updating the App

Every time you launch control center app it will check for the latest version of the app. If there is any new updated it will prompt to update. Its always recommend to use the latest version of the app.
