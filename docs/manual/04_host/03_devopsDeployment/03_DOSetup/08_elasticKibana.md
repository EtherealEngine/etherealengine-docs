# Install Elastic Search and Kibana using Helm for Server Logs

To install Elasticsearch, add the elastic repository in Helm: `helm repo add elastic https://helm.elastic.co`

Now, use the curl command to download the values.yaml file containing configuration information:

`curl -O https://raw.githubusercontent.com/elastic/helm-charts/master/elasticsearch/examples/minikube/values.yaml`

Use the helm install command and the values.yaml file to install the Elasticsearch helm chart: 

`helm install elasticsearch elastic/elasticsearch -f ./values.yaml`

The -f option allows specifying the yaml file with the template. If you wish to install Elasticsearch in a specific namespace, add the -n option followed by the name of the namespace: `helm install elasticsearch elastic/elasticsearch -n [namespace] -f ./values.yaml`

Now check if the cluster members are up: `kubectl get pods --namespace=default -l app=elasticsearch-master -w`

The other option is to use the helm test command to examine the cluster’s health: `helm test elasticsearch`

To install Kibana on top of Elasticsearch : `helm install kibana elastic/kibana`
Check if all the pods are ready: `kubectl get pods`

After you set up port-forwarding, access Elasticsearch, and the Kibana GUI by typing `http://localhost:5601 `in your browser

In order to connect logger with elasticsearch, update config file(values.yml) for Xr env `api.extraEnv.ELASTIC_HOST` for e.g. `http://\<username>:\<password>@\<host>:\<port>`

### Upgrading an existing Helm deployment
One of the features of Helm is being able to easily upgrade deployments with new values. The command to
do this is very similar to the install command:

```helm upgrade --reuse-values -f \</path/to/*.values.yaml> --set api.image.tag=\<latest_github_commit_SHA>,client.image.tag=\<latest_github_commit_SHA>,instanceserver.image.tag=\<latest_github_commit_SHA> \<RELEASE_NAME> etherealengine/etherealengine```

`reuse-values` says to carry over all configuration values from the previous deployment. This is most important
for tags, since they're usually set inline with the `helm install/upgrade` command, not a Helm config.
Using `-f \<config_file>` and `--set \<variables>` after it will apply any changes on top of the
carryover values.

If you're not deploying a new build of the codebase, you can skip the entirety of the `--set *.image.tag=\<SHA>`.