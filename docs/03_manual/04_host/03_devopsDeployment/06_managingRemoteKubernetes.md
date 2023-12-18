# Cluster Management

## Kubernetes Web UI (Dashboard)
The [Kubernetes Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) is a web-based user interface that can be used to deploy containerized applications to a Kubernetes cluster, troubleshoot your containerized application, and manage the cluster resources.
<!-- TODO: How is this accessed? -->

## Install Lens
1. Install lens with snap:
```bash
sudo snap install kontena-lens --classic
```
2. Add the K8 cluster using kubectl  
  https://docs.k8slens.dev/v4.1.4/clusters/adding-clusters/

3. Add kubernetes lens prometheus support if not already installed  
  https://docs.k8slens.dev/v4.1.4/extensions/usage/

#### AWS
AWS credentials with EKS and Cluster permissions required
<!--
TODO: Explain this section? What does this mean?
      Is it a note from the Install Lens section? If yes, just make it a note.
-->
