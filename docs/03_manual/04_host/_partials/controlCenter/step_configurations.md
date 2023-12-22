In this step, you will need to provide following information:

- **Engine Path:** This is the location of ethereal engine source code repo. If the path does not contain the source code, then it will be [cloned](https://github.com/EtherealEngine/etherealengine) by Control Center App.

    > On Windows, the path must be inside WSL Ubuntu distribution.

- **Ops Path:** This is the location of ethereal engine ops source code repo. If the path does not contain the source code, then it will be [cloned](https://github.com/EtherealEngine/ethereal-engine-ops) by Control Center App.

    > On Windows, the path must be inside WSL Ubuntu distribution.

- **Enable Ripple Stack:** By default you should keep this option as off unless you want to have IPFS & rippled server running in your local K8s deployment.

- **Force DB Refresh:** This will truncate database tables & repopulate them with seed data.

    > If the database is empty, then Control Center App will itself force populate it.
    