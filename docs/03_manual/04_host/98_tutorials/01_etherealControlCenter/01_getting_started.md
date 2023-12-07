import StepAuthentication from './_step_authentication.md'
import StepConfigurations from './_step_configurations.md'
import StepVariables from './_step_variables.md'
import StepSummary from './_step_summary.md'

# Getting Started

Ethereal Engine's Control Center is a self-contained Metaverse world in a box. Take what you need or launch the full stack.  
The Control Center is a desktop app to manage an Ethereal Engine cluster.

We know it's been complicated to build with Ethereal Engine and we've made this tool to give the community easy access to the engine. We would love to see your creations and invite you all to come build with us.

## Overview

The Ethereal Engine Control Center app provides access to various functionalities which includes:
- Configure your Ethereal Engine in a cluster in just a few clicks.
- View status of Ethereal Engine dependencies on your local system.
- Manage an Ethereal Engine deployment through admin panel.
- Manage kubernetes cluster through its dashboard.
- Manage IPFS node running in the cluster.
- Execute commands against rippled server.
- See realtime logs of different actions being performed.

## 1. Downloading Control Center App

In order to download Ethereal Engine Control Center App, navigate to [releases](https://github.com/EtherealEngine/etherealengine-control-center/releases) page and download the latest version of the App. On Windows (and for WSL), you will need to download `.exe` while for linux download `AppImage`.

> On Windows, you will need to allow permission for executing ps1 scripts. You can do so by running following command in Powershell with admin privileges ([reference](https://github.com/EtherealEngine/etherealengine-control-center#2-windows-permission-to-run-ps1-scripts)).
> ```Powershell
> Set-ExecutionPolicy -ExecutionPolicy Unrestricted
>```

> On Linux, once downloaded, right click and go to **Properties** of AppImage. In **Permissions** tab check 'Allow executing file as program'. Afterwards, double click on AppImage to launch the app.

> On Ubuntu 22.04 or later, if you are unable to launch AppImage then you might have to install Fuse using following command in terminal ([reference](https://github.com/EtherealEngine/etherealengine-control-center#1-app-not-launching-in-ubuntu-2204)).
> ```bash
> sudo apt-get install fuse libfuse2
>```

## 2. Launch & Create Cluster

When you launch the app for the first time, you will see below screen:

![Home Screen](./images/home-screen.jpg)

Here you need to create a cluster. You can do so by clicking on `Create` button in the center or anytime using round plus button on left bottom corner (in [hotbar](#31-hotbar)) of the screen. Following are the different sections of create cluster dialog:

### 2.1. Cluster Information

![Create Cluster - Cluster Information](./images/create-cluster-1.jpg)

In this step, you will need to provide following information:

- **Cluster Name:** This can be any name you want to give your cluster. i.e. Local, my-metaverse, etc.

- **Cluster Type:** This will be the kubernetes distribution you want to use. Currently there are 2 local distributions, MicroK8s(recommended) & Minikube. There is also a Custom type which allows you to connect to an existing Ethereal Engine cluster.

    > Currently, `MicroK8s` is supported on Windows & Linux while `Minikube` is supported on Linux only.

- **Prerequisites:** These are the set of items that should be manually configured by the user. If an item is correctly setup then its status will be green tick, else it will have a red cross with details and link to docs for the corrective measures.
    > Currently, there are prerequisites for MicroK8s in Windows only.

### 2.2. Cluster Type: MicroK8s or Minikube

If you selected cluster type as MicroK8s or Minikube, then you will see below options.

### 2.2.1. Authentication

![Create Cluster - Authentication](./images/create-cluster-2.jpg)

<StepAuthentication />

### 2.2.2. Configurations

![Create Cluster - Configurations](./images/create-cluster-3.jpg)

<StepConfigurations />

### 2.2.3. Variables

![Create Cluster - Variables](./images/create-cluster-4.jpg)

<StepVariables />

### 2.2.4. Summary

![Create Cluster - Summary](./images/create-cluster-5.jpg)

<StepSummary />

- **Create:** By default you should go with this option as it will create the cluster entry and show the [cluster screen](#3-cluster-screen) of this cluster.

- **Create & Configure:** This will create the cluster entry and show the current status of things. And afterwards it will automatically start the configuration script to ensure things are setup.

>> If you use 'Create' option, then you can still run the Configure script as discussed later in this [guide](#4-configure-cluster).

### 2.3. Cluster Type: Custom

If you selected Custom cluster type, then you will see below options. Custom cluster allows to connect to an existing kubernetes cluster.

### 2.3.1. Kubeconfig

![Create Cluster - Kubeconfig](./images/create-cluster-6.jpg)

In this step, you will need to provide following information regarding desired cluster's kubeconfig:

- **Config Type - Default:** This will load the default kubeconfig file of your system.

- **Config Type - File:** This will allow to load kubeconfig from a file of your system.

- **Config Type - Text:** This will allow to load kubeconfig from a text.

- **Context:** This is the selected kube context of cluster in which your ethereal engine deployment exists. The dropdown will show all contexts that exist in selected config type.

### 2.3.2. Deployment

![Create Cluster - Deployment](./images/create-cluster-7.jpg)

In this step, you will need to provide following deployment information:

- **Release Name:** This is the name of your release in selected kubernetes deployment. It can be 'dev', 'prod', 'local', etc.
  > Release name is used to prefix the workloads in your cluster like:
  `{RELEASE_NAME}-etherealengine-client`. i.e. `prod-etherealengine-client`

### 2.3.3. Summary

![Create Cluster - Summary](./images/create-cluster-8.jpg)

<StepSummary />

- **Create:** This option will create the cluster entry and show the [workloads screen](#6-workloads) of this cluster.

## 3. Cluster Screen

![Cluster Screen](./images/cluster-screen.jpg)

Once you have created a cluster you will be navigated to its screen also know as config page. Lets explain various sections of this screen:

### 3.1. Hotbar

![Hotbar](./images/hotbar.jpg)

It will show you a list of all clusters you have created. You can click on each of them to view the cluster screen of them.

![Add Cluster Icon](./images/hotbar-add.jpg) The plus icon at the bottom of this bar is used to create a new cluster.

### 3.2. Navbar

![Navbar](./images/navbar.jpg)

This section allows navigation and various utility options. Following are the various options in it:

- **App Icon:** ![App Icon](./images/navbar-icon.jpg) Logo of this application.

- **Home Icon:** ![Home Icon](./images/navbar-home.jpg) Navigate to home.

- **Config:** Navigates to [cluster](#3-cluster-screen) screen of selected cluster.

- **Workloads:** Navigates to [workloads](#6-workloads) screen of selected cluster.

- **Admin:** Navigates to ethereal engine [admin](#7-admin-dashboard) panel of selected cluster.

- **K8 Dashboard:** Navigates to kubernetes [web dashboard](#8-k8-dashboard) of selected kubernetes distribution.

- **IPFS:** Navigates to IPFS [web UI](#9-ipfs) of selected cluster. This option is visible only if ripple stack is enabled.

- **Rippled CLI:** Navigates to rippled [server cli](#10-rippled-cli) of selected cluster. This option is visible only if ripple stack is enabled.

- **Change Theme Icon:** ![Change Theme Icon](./images/navbar-theme.jpg) Allows to toggle between vaporware, light & dark themes. The color scheme of these themes are similar to ethereal engine.

- **Support Icon:** ![Support Icon](./images/navbar-support.jpg) Opens a dropdown menu to allow reaching out to support via Discord or Github.

- **User Icon:** ![User Icon](./images/navbar-user.jpg) The functionality for this button is coming soon.

### 3.3. Options Panel

![Options Panel](./images/options-panel.jpg)

This section shows various actions against currently selected cluster. Following are the options in it:

- **Cluster Icon:** ![Cluster Icon](./images/options-panel-cluster-icon.jpg) Logo of the selected cluster type. It can be MicroK8s or Minikube logo.

- **Cluster Name:** This is the cluster name that you entered in create cluster dialog. i.e. Local.

- **Engine Git Status:** ![Cluster Icon](./images/options-panel-git-engine.jpg) This is used to view current status of local ethereal engine github repo. You can view & change current branch, view & pull incoming changes, view & push outgoing changes.

- **Ops Git Status:** ![Cluster Icon](./images/options-panel-git-ops.jpg) This is used to view current status of local ethereal engine ops github repo. You can perform all actions as explained for engine git status.

- **Refresh Icon:** ![Refresh Icon](./images/options-panel-refresh.jpg) This will recheck the status of prerequisites, system, apps & engine. It also, recheck the status of engine and ops git repos. If a refresh is already in process then it will be disabled until its finished.

- **Delete Icon:** ![Delete Icon](./images/options-panel-delete.jpg) This will delete a clusters. It would not make any changes in associated local kubernetes, app, etc.

- **Settings Icon:** ![Settings Icon](./images/options-panel-settings.jpg) This will open settings dialog. It contains some selected cluster specific settings in addition to general app settings.

- **Configure Button:** ![Configure Button](./images/options-panel-configure.jpg) This will open the configure dialog which is [discussed](#4-configure-cluster) later. If a configuration is already running then this button will be disabled and have a spinner in it.

- **Launch Button:** ![Launch Button](./images/options-panel-launch.jpg) This button will open Ethereal Engine's default location in your browser as [discussed](#5-launch-ethereal-engine) later.

### 3.4. System Status

![System Status](./images/status-system.jpg)

This section will show the current status of whether the system requirements are meet or not. On Windows, it will also show the status of prerequisites.

The status against each item will be displayed. You can find more details by hovering over ![Info Icon](./images/status-info.jpg) info icon. This info icon is useful when some item is not configured correctly.

Additionally, for some items you will see ![Fix Icon](./images/status-fix.png) auto fix icon. Clicking this button will try to auto fix the problem. Though if it fails, you can try using configure dialog which is [discussed](#4-configure-cluster) later.

> Usually, auto fix button should only be used if previously you were able to run the cluster successfully. Otherwise, use configure dialog.

### 3.5. Apps Status

![Apps Status](./images/status-apps.jpg)

This section will show the current status of all the apps required to run ethereal engine deployment.

### 3.6. Engine Status

![Engine Status](./images/status-engine.jpg)

This section will show the current status of various components of ethereal engine deployment in your local kubernetes distribution.

### 3.7. Logs

![Logs](./images/logs.jpg)

This section will show all the logs of current session. The logs are of the different actions being performed by control center and their output.

- **Download Button:** ![Download Button](./images/logs-download.jpg) This will download all displayed logs.

- **Clear Button:** ![Clear Button](./images/logs-clear.jpg) This will clear all displayed logs.

## 4. Configure Cluster

On ([cluster screen](#3-cluster-screen)), if any of the status is not green tick then it means you need to run the configure script to fix them automatically. To do so use the Configure (![Configure Button](./images/options-panel-configure.jpg)) button in the [options panel](#33-options-panel). Following are the different sections of configure cluster dialog:

> Its always recommended to clear your logs before running configure script in order to trace outputs easily.

### 4.1. Authentication

![Configure Cluster - Authentication](./images/configure-cluster-1.jpg)

<StepAuthentication />

### 4.2. Configurations

![Configure Cluster - Configurations](./images/configure-cluster-2.jpg)

<StepConfigurations />

### 4.3. Variables

![Configure Cluster - Variables](./images/configure-cluster-3.jpg)

<StepVariables />

### 4.4. Summary

![Configure Cluster - Summary](./images/configure-cluster-4.jpg)

<StepSummary />

- **Configure:** This will start the configuration script which will ensure things are setup. You can track output of various things in [logs](#37-logs). Depending on your system and status of apps, it can take a while to setup things. As the configure script is executing, the Configure (![Configure Button](./images/options-panel-configure.jpg)) button will be disabled and have a spinner in it.

    > Once the script finished its execution, the cluster status will be automatically refreshed.

    > If the configure script failed, pay close attention to last few lines of [logs](#37-logs) section. As it will contain the reason why script failed.

## 5. Launch Ethereal Engine

![Launch Ethereal Engine](./images/engine-launch.jpg)

Once, everything is configured correctly and all ticks are green on config page ([Cluster Screen](#3-cluster-screen)) then you can click on `Launch` button in [options panel](#33-options-panel). This button will open Ethereal Engine's default location in your browser.

> Make sure to allow certificates as explained [here](https://etherealengine.github.io/etherealengine-docs/docs/devops_deployment/microk8s_linux#accept-invalid-certs).

## 6. Workloads

![Workloads](./images/workloads-screen.jpg)

This page will show current state of workloads for selected cluster. The workloads are mainly the k8s pods of various components of ethereal engine. In addition to [options panel](#33-options-panel), following the sections of this screen:

### 6.1. Workload Tabs

![Workload Tabs](./images/workloads-screen-tabs.jpg)

This section allows to filter based on various workload types. Default tab will be `All`, which displays all workloads. The number below each tab's label will display the currently ready count followed by slash and then total count.

### 6.2. Workloads Table

![Workloads Table](./images/workloads-screen-table.jpg)

This section will display data based on selected workload [tab](#61-workload-tabs). For each workload, it will contain pod name and other details. Hovering over a container's circle will display further details. Moreover, there is a `Logs` button to view kubernetes container logs as discussed in next [section](#63-workload-logs). `Delete` button will allow to remove the pod from current kubernetes distribution.

Additionally, there is refresh icon button on right top of this table. This will refresh/reload data being displayed. There is also an auto refresh drop down next to it, which will automatically perform refresh after selected interval.

### 6.3. Workload Logs

![Workload Logs](./images/workloads-screen-logs.jpg)

This section will by default display cluster [logs](#37-logs). Though if user clicked `Logs` button as discussed in previous [section](#62-workloads-table), then the logs of that workload will be displayed. The cluster [logs](#37-logs) will then be displayed under `Config` log tab. User can toggle between these log tabs, while workload logs can be closed as well.

The download and clear icon button will perform actions based on selected log's tab. Additionally for workload logs, there is refresh icon button on right top of this section. This will refresh/reload logs being displayed. There is also an auto refresh drop down next to it, which will automatically perform refresh after selected interval.

Beside these icons there is also a container drop down through which user can select the workload's pod container for which logs are displayed.

## 7. Admin Dashboard

![Admin Dashboard](./images/admin-dashboard.jpg)

Once, everything is configured correctly and all ticks are green on config page ([Cluster Screen](#3-cluster-screen)) then you can click on `Admin` button in [navbar](#32-navbar). This will show the admin dashboard of ethereal engine deployed in your local k8s cluster.

You can perform various actions from admin dashboard including installing projects, managing users, groups, locations, instances, resources, etc.

## 8. K8 Dashboard

![K8 Dashboard](./images/k8s-dashboard.jpg)

Once, your selected local k8s distribution (Microk8s or Minikube) has a green tick on config page ([Cluster Screen](#3-cluster-screen)) then you can click on `K8 Dashboard` button in [navbar](#32-navbar). This will show the k8s dashboard.

For MicroK8s, when you launch it for the first time then you will be asked regarding token configurations. You can use `Skip` button to pass through it.

![K8 Dashboard Token](./images/k8s-dashboard-token.jpg)

You can perform various actions from k8s dashboard including managing pods, jobs, deployments, services, etc.

## 9. IPFS

![IPFS Web UI](./images/ipfs-web-ui.jpg)

If ripple stack is enabled and once, IPFS has a green tick on config page ([Cluster Screen](#3-cluster-screen)) then you can click on `IPFS` button in [navbar](#32-navbar). This will show the IPFS web UI.

You can view and manage various aspects of the IPFS running in your local cluster using this dashboard. IPFS is not required by default for engine, though for custom use cases it can be used.

## 10. Rippled CLI

![Rippled CLI](./images/rippled-cli.jpg)

If ripple stack is enabled and once, Rippled has a green tick on config page ([Cluster Screen](#3-cluster-screen)) then you can click on `Rippled CLI` button in [navbar](#32-navbar). This will show the Rippled CLI page.

You can run various commands against `rippled` server and view their outputs. Rippled is not required by default for engine, though for custom use cases it can be used.

## 11. Updating the App

Every time you launch control center app it will check for the latest version of the app. If there is an update, then it will prompt to update. Its always recommend to use the latest version of the app.

