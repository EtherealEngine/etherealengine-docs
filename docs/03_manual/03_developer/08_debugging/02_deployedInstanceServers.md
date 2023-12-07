# Debugging Deployed InstanceServers (and other Kubernetes pods)

Because of the nature of Kubernetes, logs of fatal errors on instanceserver or API pods can sometimes disappear
before one has a chance to view them, as the pods that they were on are deleted, along with their logs.

One way to catch these errors is to tail the logs of existing pods from a local machine and then trigger the error.
The tail of the logs will persist in your terminal even after the pod has been deleted.

You should already have kubectl set up and pointing to your cluster, but if not, do so. 
(see [here](../2_devops_deployment/5_managing_remote_kubernetes.md) for links to do that)
Make sure you don't have a browser tab with the offending location(s) open already, as you want to be tailing
the logs before the instance starts.

Next, run `kubectl get gs`. If the cluster is fully installed, this will get all of the running instanceserver
pods (`kubectl get pods` will get all pods, if you need to find the names of API pods, etc.) 
Select the Name of a pod and copy it (in Linux, highlight it and press CTRL+SHIFT+C), then run 
`kubectl logs <pod_name> -c <RELEASE_NAME>-instanceserver -f`,
e.g. `kubectl logs prod-instanceserver-vhwh2-9vqrv -c prod-instanceserver -f`. It should output something like this for
and instanceserver pod:

```
> @etherealengine/instanceserver@1.3.0 start
> cross-env APP_ENV=production ts-node --swc src/index.ts

👾 bitECS - resizing all data stores from 100000 to 5000
 Powered by three.quarks. https://quarks.art/
[hyperflux:Action] Added topic default
[hyperflux:State] registerState SceneState
[hyperflux:Action] Added Receptor EngineEventReceptor
[hyperflux:State] registerState EngineState
[hyperflux:State] registerState ServerState
Tue, 11 Jul 2023 00:38:50 GMT koa deprecated Support for generators will be removed in v3. See the documentation for examples of how to convert old middleware https://github.com/koajs/koa/blob/master/docs/migration.md at ../../node_modules/@feathersjs/koa/lib/index.js:52:27
[00:38:50.631] INFO: Starting app.
    component: "server-core:sequelize"
[hyperflux:State] registerState NetworkState
[00:38:50.645] INFO: Starting app.
    component: "server-core:mysql"
[00:38:50.900] INFO: registered kickCreatedListener
    component: "instanceserver:channels"
[00:38:50.901] INFO: Starting instanceserver with NO HTTPS on 3031, if you meant to use HTTPS try 'sudo bash generate-certs'
    component: "instanceserver"
[00:38:51.036] INFO: Feathers-sync started.
    component: "server-core"
[00:38:51.634] INFO: Server Ready
    component: "server-core:sequelize"

```

Since the instanceserver pod that is picked to handle a given world or media instance is random, you'll want to
open a few more tabs in your terminal and repeat the above `kubectl logs` command, substituting a different
instanceserver pod name in each tab, so that you're tailing all of the current pods. Then go to the location that is
displaying problematic behavior, or otherwise trigger the action that is causing problems, and you should see the error
in one of the terminals. If it's a fatal error, the logging will end with the pod, but the logs will stay in that terminal.

Note that if you want to log further errors, you may need to get the names of the new pods that are spun up to replace
the ones that crashed by running `kubectl get gs` or `kubectl get pods` again, and then using the new pods' names in
`kubectl logs` commands.
