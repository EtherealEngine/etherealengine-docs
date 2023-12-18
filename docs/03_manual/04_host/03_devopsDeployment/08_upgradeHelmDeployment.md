# Upgrading Helm Release

This guide will explain how to upgrade an existing helm deployment.

## Update `values.yaml` File
A Helm release upgrade is usually required when changes are made in the configuration of helm charts.  
To do so, the first thing required is upgrading the `value.yaml` file of your current configuration.  
If you already have an updated copy of this file then you can update the desired values and push the changes to your Helm deployment.

When multiple people are working same deployment, it becomes difficult to maintain an up-to-date `values.yaml` file.
You can get the current version/snapshot of `values.yaml` file at any time by running the [get values](https://helm.sh/docs/helm/helm_get_values/) command:
```bash
helm get values [DEPLOYMENT_NAME]
```
> eg: `helm get values dev`

You can save the output to a `values.yaml` file and use it to update the required values.

## Differences in `value.yaml`
It can be very useful to evaluate the differences between your local `values.yaml` and the current deployment `values.yaml` files.  
That way you can visualize the changes that a Helm upgrade is going to make before they are applied.  
To do so first make sure you have `helm diff` plugin installed. You can install it by running:
```bash
helm plugin install https://github.com/databus23/helm-diff
```

Now that the `helm diff` plugin is installed, you can run the following command:
```bash
helm diff upgrade [DEPLOYMENT_NAME] etherealengine/etherealengine --values [PATH_TO_VALUES_YAML]
```
> eg: `helm diff upgrade dev etherealengine/etherealengine --values ~/etherealengine-ops/values/dev.ethereal.values.yaml`

This will print the differences between the deployed helm release `values.yaml` file and the specified `values.yaml` file.  
> Note: When the output is empty it means that there are no differences/changes.

## Upgrading Helm Deployment
Now that the local `values.yaml` file is updated, the following command will upgrade the Helm deployment with the correct configuration:
```bash
helm upgrade [DEPLOYMENT_NAME] etherealengine/etherealengine --reuse-values -f [PATH_TO_VALUES_YAML]
```
> eg: `helm upgrade dev etherealengine/etherealengine --reuse-values -f ~/etherealengine-ops/values/dev.ethereal.values.yaml`
