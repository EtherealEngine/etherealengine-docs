# EKS User Access
## Grant EKSUser access to cluster
By default, only the IAM user who set up an EKS cluster may access it.
In order to let other users access the cluster, you must apply an aws-auth configmap to the cluster
granting access to specific IAM users. A template of [aws-auth-template.yml](https://github.com/EtherealEngine/ethereal-engine-ops/blob/master/configs/aws-auth-template.yml) file can be found in [ethereal-engine-ops](https://github.com/EtherealEngine/ethereal-engine-ops) repo.

You'll need to provide a few values for this file. To find `<rolearn>`, in AWS go to EKS->Clusters->
`<your cluster>`->Compute->Select a nodegroup.  In the details should be 'Node IAM Role ARN'; copy this
and replace `<rolearn>` in the aws-auth file. `<account_id>` is the ID of your AWS account; in the upper
right corner of the AWS client should be `<your_username>@<abcd-1234-efgh>`. The 12-character string
after the @ is the account ID. Make sure to remove the `-`'s from the account ID when pasting it in.
`<IAM_username>` is the username of the IAM user you want to give access, e.g. `EKSUser`.

You can add multiple users by copying the `- groups:` section under `mapUsers`, e.g.

```
  mapUsers: |
    - groups:
      - system:masters
      userarn: arn:aws:iam::abcd1234efgh:user/EKSUser
      username: EKSUser
    - groups:
      - system:masters
      userarn: arn:aws:iam::acbd1234efgh:user/FSmith
      username: FSmith
```

When the aws-auth config file is filled in, just run `kubectl apply -f path/to/aws-auth.yml`.
