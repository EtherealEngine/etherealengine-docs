# Release Helm Chart

Following are the steps that needs to be taken in order to update etherealengine helm charts repo:

* Have a checked-out copy of https://github.com/EtherealEngine/ethereal-engine-helm, set to the `gh-pages` branch
* Have a checked-out copy of https://github.com/EtherealEngine/ethereal-engine-ops, set to the `master` branch
* Set working directory to local `ethereal-engine-ops` folder
* Increase the version number in `etherealengine/Chart.yaml`
* Run `helm package etherealengine`
* Run `helm repo index --url https://helm.etherealengine.org .`
* Copy `etherealengine-X.Y.Z.tgz` that's generated to the root of the `ethereal-engine-helm` repo, and make sure to `git add` it.
* Open `index.yaml`. Under entries.xrengine, there should be an entry for the new version.
* Copy that entry to `ethereal-engine-helm`'s `index.yaml`, making sure to put it under the right `entries` section; we've got `etherealengine-builder` and `etherealengine` in the same file, so pay attention to which one you're putting it in. Also make sure that the spacing/indentation matches the other entries.
* Copy the `generated` line from `index.yaml` to `ethereal-engine-helm/index.yaml`, overwriting the `generated` line that's there.
* Commit this, and push it to the `gh-pages` branch of `ethereal-engine-helm`. Within a couple of minutes, you should see the new version appear at https://helm.etherealengine.org/