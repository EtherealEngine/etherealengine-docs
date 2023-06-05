# Upgrading Helm Release

This guide will cover various sections regarding upgrading an existing helm deployment.

## Getting Updated `values.yaml` File

Usually a helm release upgrade is required when changes are made in configuration of helm charts. To do so first thing required is `value.yaml` file of current configuration. If you already have an updated copy of this file then you can update the desired values and push the changes to helm deployment.

But for scenarios where multiple people are working same deployment, it becomes difficult to maintain updated `values.yaml` file. At anytime you can get the current version/snapshot of `values.yaml` file by running [get values](https://helm.sh/docs/helm/helm_get_values/) command:

```bash
helm get values [DEPLOYMENT_NAME]
```

i.e.

```bash
helm get values dev
```

You can save the output in a `values.yaml` file and update the required values.

## Evaluating Difference in `value.yaml` & Deployed Charts

It become very handy if you can evaluate the differences between your local `values.yaml` file and current deployment. This way you can beforehand visualize the changes a helm upgrade is going to make. To do so first make sure you have `helm diff` plugin installed. You can install it by running:

```bash
helm plugin install https://github.com/databus23/helm-diff
```

Once `helm diff` plugin is installed then you can run following command:

```bash
helm diff upgrade [DEPLOYMENT_NAME] etherealengine/etherealengine --values [PATH_TO_VALUES_YAML]
```

i.e.

```bash
helm diff upgrade dev etherealengine/etherealengine --values ~/etherealengine-ops/values/dev.ethereal.values.yaml
```

This will print the output of differences between deployed helm release and changes in specified `values.yaml` file. Incase the output is empty, it means there is no difference/changes.

## Upgrading Helm Deployment

Once the local `values.yaml` file is updated, it can be reflect to deployment using following commands:

```bash
helm upgrade [DEPLOYMENT_NAME] etherealengine/etherealengine --reuse-values -f [PATH_TO_VALUES_YAML]
```

i.e.

```bash
helm upgrade dev etherealengine/etherealengine --reuse-values -f ~/etherealengine-ops/values/dev.ethereal.values.yaml
```
