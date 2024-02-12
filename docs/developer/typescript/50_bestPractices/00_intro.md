---
sidebar_label: Typescript
---
# Typescript: Best Practices Guide
<!--
NOTE: This page should contain:
- Hero Project: Showcase for Ethereal Engine's development tools and workflows.
- Guide: Teaches a new user how to program the Hero Project and be comfortable with EE project development.
- Segue: Lead the user into the Developer Manual
-->

:::important
This guide teaches some of the Ethereal Engine recommended best practices for developers.  
As such, the level of knowledge required will be higher than if it was just an introductory guide.

_Visit the [Developer Manual](/docs/manual/developer/intro) page for in-depth information about programming with Ethereal Engine._  
:::

This guide will teach you how to create **Pong**, a multiplayer game built with Ethereal Engine using Typescript.  

## Installation and Running the project
### 1. Install Pong
<!-- TODO: This should be an MDX partial that sends the user to the developer quick-start guide for running projects with a local environment. -->
Ethereal Engine scans for projects in its `/packages/projects/projects` sub-folder.  
We can install Ethereal Engine from scratch and also register a sub project using the following commands:
```bash
git clone https://github.com/EtherealEngine/etherealengine
cd etherealengine
cd packages/projects/projects
git clone https://github.com/EtherealEngine/ee-tutorial-pong
cd ../../../
```

### 2. Run the engine
A fresh install of Ethereal Engine can be run with:
```bash
npm install
npm run dev
```

### 3. Configure the Location
Go to the Admin Panel page, create a `Location` for the project and change the project's name to `pong`.
:::note[Admin Panel]
https://localhost:3000/admin
:::

:::important
Ethereal Engine must be running for this step and the rest of this guide to work.
:::

### 4. Run Pong
Run the project on the web by visiting it with the URL you just created.
:::note[Pong]
https://localhost:3000/location/pong
:::
