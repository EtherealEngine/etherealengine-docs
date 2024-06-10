In this step you will need to provide the following information:

- **Engine Path:**  
  This is the location of iR Engine source code repo.  
  If the path does not contain the source code, then it will be [cloned](https://github.com/EtherealEngine/etherealengine) by the Control Center App.
  :::info[windows]
  The path must be inside your WSL Ubuntu distribution.
  :::

- **Ops Path:**  
  This is the location of iR Engine ops source code repo.  
  If the path does not contain the source code, then it will be [cloned](https://github.com/EtherealEngine/ethereal-engine-ops) by Control Center App.
  :::info[windows]
  The path must be inside your WSL Ubuntu distribution.
  :::

- **Enable Ripple Stack:**  
  By default you should keep this option as off unless you want to have IPFS & rippled server running in your local K8s deployment.

- **Force DB Refresh:**  
  This will truncate database tables & repopulate them with seed data.
  :::note
  The Control Center App will force populate the database if its empty.
  :::
