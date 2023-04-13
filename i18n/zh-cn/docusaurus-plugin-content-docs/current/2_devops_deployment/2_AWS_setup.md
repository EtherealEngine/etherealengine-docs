# AWS 上的 Ethereal Engine

## 创建 EKS 集群

您首先需要设置一个 EKS 集群，以便运行 Ethereal Engine。
虽然这可以通过AWS的Web界面完成，但`eksctl`命令行界面
将自动自动提供更多您需要的服务，
因此建议使用。

一、关注[这些说明](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html)
用于设置 aws-cli、eksctl 以及使用您的 AWS 凭证配置 aws-cli。
您还应该设置 kubectl 和 Helm，因为我们将使用它从 Charts 安装多个代码库。

接下来运行以下命令：

`eksctl create cluster --name <name> --version <version> --region <region> --managed --nodegroup-name <name> --node-type <instance type> --nodes <target_node_number> --nodes-min <minimum_node_number> --nodes-max <maximum_node_number>`

这将创建一个 EKS 群集，其中受管节点位于指定区域中，包括自动
创建子网、创建 VPC 等。最多可能需要 15 分钟才能完成。

您还可以使用标志`--zones <zone1>,<zone2>`以指定集群的可用区
应该设置在。某些区域具有不可用的区域，但 eksctl 将尝试
如果未指定 --zones，则使用，导致安装失败。例如，us-west-1（截至此）
写作）在us-west-1b中没有任何可用的资源;如果您在 us-west-1 中设置，
你会想使用`--zones us-west-1a,us-west-1c`.

请注意，该区域对于 AWS 中的几乎所有服务都很重要。默认区域为“us-east-1”，
但是，如果您在任何其他区域中创建群集，则需要确保正在创建证书，
同一区域中的 DNS 记录等。

在撰写本文时，API 和客户端配置为在名为“ng-1”的节点组上运行。
如果您将其命名为其他名称，请确保更改配置文件中的 NodeAffinity。

确保增加最大节点限制，因为默认情况下，目标、最小值和最大值为
设置为 2，如果您已配置，Ethereal Engine 的设置肯定需要两个以上的节点
它们使用相对较小的实例类型，例如 t3a.medium。

#### 安装群集自动缩放程序（可选）

虽然不是必需的，但在群集中安装自动缩放程序以增加
当集群具有高流量时可用于 Pod 的节点数，并减少该数量
流量较低时的数字。

跟随[这些说明](https://docs.aws.amazon.com/eks/latest/userguide/autoscaling.html#cluster-autoscaler)
以设置自动缩放程序。默认情况下，在以下步骤中创建的任何受管节点组应为
标记，以便自动缩放程序可以控制它们，因此不需要进一步的操作。

请注意，纵向扩展和缩减会有一些滞后时间。通常需要大约5分钟
自动缩放程序认为需要添加更多节点的时间，然后这些节点才被启动，
相应的 Docker 映像已安装到它们上，并且它们已准备好使用。它需要大约
自动缩放程序在 15 分钟内实际删除被视为多余的节点，作为对冲
最近的高流量再次回升。

#### 创建启动模板

转到 EC2 -> 启动模板并创建一个新模板。将其命名为“xrengine-production-instanceserver”。
大多数设置可以保持原样，但以下设置除外：

*   存储 ->添加卷，将大小设置为 ~20GB，然后为“设备名称”选择“/dev/xvda”。
*   网络接口 - >添加一个，然后在“自动分配公共IP”下选择“启用”

#### 为实例服务器创建节点组

转到 AWS 网站，然后转到 EKS -> 集群 ->单击您刚刚创建的集群 ->配置 ->计算。
您应该看到一个受管节点组已经存在;单击其名称将打开信息
和编辑，但您无法在创建实例类型后更改实例类型。

返回“计算”选项卡，单击“添加节点组”。选择一个名称（建议使用ng-instanceservers-1之类的名称），
选择使用集群创建的 IAM 角色（应类似于`eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>`),
切换使用启动模板开关，然后选择您在上一步中创建的启动模板，
，然后单击下一步。在第二页上，选择您希望为组设置的实例类型，
设置最小/最大/所需的缩放大小，然后单击下一步（建议使用 t3（a）.small）。
私有子网中的实例服务器实例可能存在连接问题，因此请删除所有私有实例
要使用的子网列表中的子网，并确保正在使用公有子网（有时
默认情况下，工作流仅选择私有子网）。点击下一步，查看所有内容，然后单击创建。

### 为 redis 创建节点组

Redis 应获取自己的节点组，以将其与可能对群集进行的任何其他更改隔离开来。
与实例服务器节点组一样，它不是绝对必要的，但可以防止各种其他事情
由于 redis 服务器中断而出现故障。

返回“计算”选项卡，单击“添加节点组”。选择一个名称（包/操作/配置中的默认配置假定
名称“ng-redis-1”），选择使用集群创建的 IAM 角色
（它应该是这样的`eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>`),
切换使用启动模板开关，然后选择用于创建初始节点组的启动模板，
，然后单击下一步。在第二页上，选择您希望为组设置的实例类型，
设置最小/最大/所需的缩放大小，然后单击“下一步”（您可能可以使用单个t3（a）.small）。
默认子网应该没问题，因此请点击“下一步”，查看所有内容，然后单击“创建”。

### 为构建器创建节点组

完整的以太坊引擎堆栈需要在集群内有一个构建器服务器，以便捆绑和构建
Ethereal Engine投影到将要部署的代码库中。这应该在其自己的节点组上运行
具有单个节点 - 一次只能运行构建器的一个副本，并且
由于构建客户端服务需要高内存，因此需要一个具有>8 GB RAM的盒子。

返回“计算”选项卡，单击“添加节点组”。选择一个名称（类似于`ng-dev-builder-1`是推荐的）和
选择使用集群创建的 IAM 角色（应类似于
`eksctl-<cluster_name>-node-NodeInstanceRole-<jumble_of_characters>`).您无需使用任何启动模板
对于此节点组。单击“下一步”。

在第二页上，您可以将容量类型更改为`Spot`如果你想为了省钱;建造者
服务可能不会经常运行或运行太长时间，因此它被 Spot 实例中断的几率
中断率很低，如果发生这种情况，它总是可以重新构建。将磁盘大小设置为50 GB;它需要很多
磁盘空间用于安装和构建 Ethereal Engine 代码库，而默认的 20 GB 几乎肯定是不够的。

对于实例类型，您只需选择超过 8 GB 的类型;t3a.xlarge是最便宜的适合
这个标准。如果您要选择8GB的东西，则很可能大多数构建都会使节点崩溃，
因为Kubernetes倾向于重新启动节点，如果它们接近内存容量。
在节点组扩展配置下，设置所有三个`nodes`值为 1。我们只需要构建器的单个副本
在任何给定时间，运行多个功能强大的盒子可能会变得昂贵。单击“下一步”。

您可以将子网单独保留在下一页上，然后单击下一步。在最后一页上，单击“创建”。

## 为构建的映像创建 ECR 存储库。

Ethereal Engine部署过程将构建多个Docker映像，这些映像需要存储在某个地方。
在 AWS 中，某处是[弹性容器注册表](https://us-west-1.console.aws.amazon.com/ecr/get-started).
您需要在运行 EKS 集群的同一 AWS 区域中创建这些存储库。

转到上面的 ECR 链接，然后单击创建存储库下的“入门”。如果您非常关心您的任何一个
Ethereal Engine项目代码库出来，你可以选择“私有”进行“可见性设置”，但通常“公共”是可以的。
您需要为每个部署创建多个存储库，例如，为`dev`部署
再来几个`prod`部署等

假设您首先要执行`dev`部署，命名第一个存储库`xrengine-<deployment_name>-builder`在“存储库”下
名称，例如`xrengine-dev-builder`.您不需要更改任何其他设置，但如果您使用的是私有
存储库并希望打开标记不可变性，这很好。生成的图像标记不应发生冲突，但它
将防止任何手动覆盖标记。单击“创建存储库”。

您将需要为作为 Ethereal 引擎堆栈的一部分部署的每个服务再创建四个存储库 -
`api`,`analytics`,`client`和`instanceserver`，其形式也为`xrengine-<deployment_name>-<service_name>`.
例如：`xrengine-dev-api`,`xrengine-dev-analytics`,`xrengine-dev-client`和`xrengine-dev-instanceserver`.
其他一切都可以留给那些人。

在[存储库页面](https://us-west-1.console.aws.amazon.com/ecr/repositories)，您应该看到两者
您创建的存储库。如果您没有看到任何内容，则可能是位于顶部的错误选项卡上 - 单击“私人”或“公共”以切换
在他们之间。此外，请检查您是否位于正确的 AWS 区域。您会看到一个“URI”列。如果您公开了存储库，
URI 应采用以下形式`public.ecr.aws/<identifier>/xrengine-<deployment_name>(-builder)`;如果您设为私密
存储库，URI 应采用以下形式`<AWS_account_id>.dkr.ecr.<AWS_region>.amazonaws.com/xrengine-<deployment>(-builder)`.
记下所有内容之前`/xrengine-<deployment_name>`- 您需要在后续步骤中将其添加为变量。
它将被称为`ECR_URL`那里。

## 为 S3/SES/SNS/Route53 创建 IAM 角色（或单个管理员角色）

Ethereal Engine 与多个 AWS 服务接口，并且需要凭证来实现这些目的。你可以使
一个管理员角色，具有对所有 AWS 服务的完全访问权限，但我们建议为
每项服务。要创建角色，请执行以下操作：

### 创建 IAM 角色

转到 IAM->用户，然后单击添加用户按钮。对于用户名，输入`<service>-admin`，例如`S3-admin`.
选中“编程访问”框，然后单击“下一步：权限”按钮。
单击“直接附加现有策略”。在“筛选策略”文本框中，您需要
输入服务的名称以显著缩小策略列表的范围。然后，查找“完全访问”
该服务的策略并选择该策略，然后单击下一步：标记按钮。您无需使用
任何内容，只需单击“下一步：查看”按钮，然后单击“创建用户”按钮。

以下屏幕应显示“成功”并列出用户。将“访问密钥 ID”复制到某处，然后
同时单击“秘密访问密钥”下的“显示”开关，然后将其复制到其他位置。你会把这些
稍后会放入 Helm 配置文件中。

### 要创建的 IAM 角色

以下是您要为其创建 IAM 管理员用户的服务，以及您想要的关联权限
授予他们：

*   53号公路：`AmazonRoute53FullAccess`
*   S3：`AmazonS3FullAccess, CloudFrontFullAccess`
*   社交网络：`AmazonSNSFullAccess`

您还需要创建一个 IAM 用户，GitHub 操作可以使用该用户来访问集群和推送/拉取
来自 ECR 的 Docker 映像。按照惯例，我们称这个用户为“Github-Actions-User”，它需要这些
权限：`AmazonEKSClusterPolicy, AmazonEKSWorkerNodePolicy, AmazonEKSServicePolicy, AmazonElasticContainerRegistryPublicAccess, AmazonEC2ContainerRegistryFullAccess`

### 为 IAM 用户创建新凭证

如果您曾经丢失了用户的机密，或者出于任何原因想要制作新的凭据，请转到
IAM->用户，然后单击该用户。点击“安全凭证”标签，然后在“访问密钥”下
应该看到一个按钮“创建访问密钥”，并且在其下方，0-2个带有一些信息的现有密钥
关于它们和极右翼的“x”以将其删除。如果该用户有两个密钥，则
必须停用并删除其中一个，然后才能创建新的。

单击“创建”按钮，然后确保将公钥和密钥保存在某个位置，并将它们放入
Helm 配置文件。

## 创建 RDS 框

Ethereal Engine由SQL服务器提供支持。我们在开发中使用MariaDB，但它也在AWS上运行
极光没有问题。大多数其他版本的SQL应该可以工作，但尚未经过显式测试。

### 从外部计算机访问 RDS 盒

默认情况下，RDS 框只能从其所在的 VPC 中访问。
如果您希望能够从该 VPC 外部连接到它，则需要设置一个堡垒框
并将 SSH 放入该框中，或使 RDS 框可公开访问。

此时不介绍设置堡垒盒。将注意将其公开的步骤
下面由**公开 RDS**

### 创建云数据库实例

转到 RDS，然后单击创建数据库按钮。大多数选项可以保留其默认值。
在“设置”下，提供更具描述性的数据库集群标识符。主用户名可以保留为管理员;
输入主密码，然后在确认密码中再次输入。

在数据库实例类下，选择最符合您的定价需求的选项。

在“可用性和持久性”下，建议将其保留为默认值
在另一个可用区制作 Aurora 副本。

在连接下，确保它位于作为 EKS 集群的一部分创建的 VPC 中。

**公开 RDS**
如果您希望能够从外部访问它，则应将“公共访问”设置为“是”。

在 VPC 安全组下，选择标题为
`eksctl-<EKS_cluster_name>-cluster-ClusterSharedNodeSecurityGroup-<random_string>`和
`eks-clustersg-<EKS_cluster_name>-<random_string>`.

打开顶级“其他配置”下拉列表（而不是“连接”中的下拉列表）。在“数据库选项->初始数据库名称”下，
命名默认数据库并将其保存以供以后在 Helm 配置文件中使用。

最后，单击页面最底部的“创建数据库”按钮。

**公开 RDS**您需要向 RDS 实例添加一个安全组，以允许通过端口的流量
3306（或您选择在其上运行它的任何端口）。您可以让此 SG 仅允许来自您的 IP 地址的流量进入
如果你想对此非常安全，或者如果你不太关心某人，则从任何地方（0.0.0.0/0）
获取访问权限。

## 编辑安全组以允许实例服务器流量进入 VPC

您需要编辑新集群的主安全组以允许实例服务器流量。
在 AWS Web 客户端上，转到 EC2 ->安全组。应该有三个SG具有
节点名称在其名称中的某个位置;查找表单中的那个
`eks-cluster-sg-<cluster_name>-<random_numbers>`.它不应该以/ControlPlaneSecurityGroup结尾
或 /ClusterSharedNodeSecurityGroup。
单击该按钮，然后单击“入站规则”选项卡，然后单击“编辑入站规则”。

您需要添加两个规则集：

*   类型：自定义 UDP;端口范围：7000-8000;来源：任意位置（或“自定义 0.0.0.0/0”）
*   类型： 自定义 TCP;端口范围：7000-8000;来源：任意位置（或“自定义 0.0.0.0/0”）

## 创建 Route 53 托管区域并设置 ACM 证书

在将Nginx安装到集群之前，您需要将所有网络平方。
这需要创建必要的SSL证书并创建一些DNS记录来指向
各种子域到正确的地方。

### 通过 Route53 购买和注册域名（可选）

如果您还没有应用程序的域，则通过 Route53 注册它是最简单的方法。
转至 Route53->域->注册域，然后单击'注册域'按钮，然后按照
注册域名的工作流。

### 创建 Route 53 托管区域

在 AWS Web 客户端中，转到 Route 53。为您计划用于的域创建托管区域
你的空灵引擎设置。稍后您将返回此处创建 DNS 记录。

#### 将外部注册商子域指向使用 Route53 名称服务器（仅当您的域在 Route53 外部注册时）

如果您已经向其他注册商服务注册了域，则需要添加一些 DNS 记录
将您将要使用的特定子域指向 AWS 的名称服务器。

首先，转到 Route53->托管区域，然后单击域名（或
突出显示该行，然后单击“查看详细信息”按钮）。“记录”下应有两条记录。
查找类型为“NS”的那个;在“值/路由流量”下，应该有四条线路全部开始
与 'ns-'。这些将很快使用。

转到外部注册机构，然后转到 DNS 记录页面。对于将要使用的每个子域，您
需要添加四条类型为“NS”的记录。名称将是子域，名称服务器将是其中之一
“NS”下的四行。您需要为这四行中的每行提供一条记录。

如果要设置多个部署，例如开发和生产部署，则需要一组四个部署
这些部署将落后的每个子域的 NS 记录。

### 使用 ACM 创建证书

转到 Amazon Certificate Manager。如果该区域中没有证书，请单击“预配证书”下的“入门”，
否则，请单击“申请证书”。

应选择“申请公共证书”，然后选择“申请证书”。下一页
应标题为“添加域名”。您应该同时添加顶级域，例如`ethereal-engine.io`,
以及所有子域的通配符，例如`*.ethereal-engine.io`，然后单击下一步。

在下一页上选择 DNS 验证，然后单击下一步。您可以跳过添加标签，只需单击“查看”，
，然后在最后一页上确认。

您应被发送到标题为“验证”的页面。单击每个域旁边的箭头以打开更多域
选项。单击在 Route 53 中创建记录按钮以打开确认模式，并在该模式中打开
单击“创建”。

如它所示，验证这些域最多可能需要 30 分钟。如果单击“完成”
触发每个记录创建后，您应该被发送回证书页面。
打开刚创建的证书将显示每个域的验证状态。

如果您打开此证书的详细信息，则应该有一个字段“ARN”，其值看起来
类似的东西`arn:aws:acm:<region>:<AWS account ID>:certificate/<a UUID>`.记下这一点，以便以后使用，
当你去安装 ingress-nginx 时。

您应该按照上述说明制作第二个证书`resources.<domain>`.
请注意，此证书必须在 us-east-1 中制作，无论其他所有内容位于哪个区域
设置在;在撰写本文时，CloudFront 只能在 us-east-1 中使用证书。

## 为每个部署安装 Agones、ingress-nginx 和 redis 的副本

现在群集已启动并运行，我们可以将所有内容安装到其上。
当您使用 eksctl 创建集群时，它应该已创建一个指向
它在kubectl中。跑`kubectl config get-contexts`获取它所知道的所有上下文;
旁边有星星的那个应该被命名为`<your_AWS_username>@<cluster_name>`.
如果不存在，则必须编辑配置以生成适当的上下文。

接下来，您需要通过运行以下命令将 Agones、ingress-nginx 和 redis Helm 图表添加到 helm 中
`helm repo add agones https://agones.dev/chart/stable`,`helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`和`helm repo add redis https://charts.bitnami.com/bitnami`.
此时您还应该通过以下方式添加Ethereal Engine的存储库：`helm repo add xrengine https://helm.xrengine.io`.

如果您怀疑图表已过期，请运行`helm repo update`以将其全部更新为最新版本。

### 安装阿贡斯

从此存储库的顶层，运行`helm install -f ./packages/ops/configs/agones-default-values.yaml agones agones/agones`.
这表示从“agones”图表中的“agones”包中安装一个名为“agones”的服务，并将其配置为
在 /packages/ops/configs/agones-default-values.yaml 找到的文件。

### 为每个部署安装 redis

Ethereal Engine的每个部署都使用一个redis集群来协调“feathers-sync”库。
每个 redis 部署的名称需要与将使用它的部署相同。对于
名为“dev”的空灵引擎部署，需要命名相应的 redis 部署
'dev-redis'.

跑`helm install  -f packages/ops/configs/redis-values.yaml <deployment_name>-redis redis/redis`安装，例如
`helm install  -f packages/ops/configs/redis-values.yaml dev-redis redis/redis`.
如果将 redis 节点组命名为“ng-redis-1”以外的名称，则必须更改
packages/ops/configs/redis-values.yaml 位于 redis 节点组名称的两个位置。
如果您没有仅为 redis 创建节点组，则必须省略`-f packages/ops/configs/redis-values.yaml`,
因为该配置使 redis pod 在特定节点组上运行。

#### 将 redis 安装为 Ethereal 引擎图表的一部分（不建议用于生产）

Redis可以作为以太坊引擎图表的一部分进行安装，只要以太坊引擎安装的配置文件将'redis.enabled'设置为true。
在这种情况下，您应该跳过上述单独安装 redis 的步骤。不建议用于生产
但是，由于升级到 Ethereal Engine 安装通常会重新启动 redis 服务器，
导致所有实例服务器由于它们的 redis 连接被切断而崩溃。

这打破了 Agones 保持已分配实例服务器正常运行的正常行为，直到每个用户都离开并缓慢替换
旧的 Ready 实例服务器与新的实例服务器，始终维护一个活动的实例服务器池。你会遇到一个时期
根本没有活动实例服务器（不建议这样做）以及所有正在使用的实例服务器的时间
会立即下降。

### 安装 ingress-nginx

**在完全验证关联的 ACM 证书之前，此步骤无法完成**
打开文件`packages/ops/configs/nginx-ingress-aws-values.yml`.记下该行
`service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "<ACM Certificate ARN for SSL>"`
将尖括号中的位（包括尖括号）替换为证书的 ARN
您为顶级域和所有通配符子域制作，例如
`service.beta.kubernetes.io/aws-load-balancer-ssl-cert: "arn:aws:acm:us-west-1:103947711118:certificate/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"`

不要在插入 ARN 的情况下提交此文件;完成此步骤后，将文件还原回去
到它所承诺的状态。

从此存储库的顶层，运行`helm install -f ./packages/ops/configs/nginx-ingress-aws-values.yml nginx ingress-nginx/ingress-nginx`
这表示从“ingress-nginx”图表中的“ingress-nginx”包中安装名为“nginx”的服务，并将其配置为
在 /packages/ops/configs/nginx-ingress-aws-values.yml 上找到的文件。

## 设置简单电子邮件服务

您需要设置简单电子邮件服务，以便可以发送登录链接。

在 AWS Web 客户端中，转到 SES -> 域。点击验证新域名，然后进入顶级域名
域并选中生成 DKIM 设置复选框，然后单击验证此域。
在弹出的模式上，应该有一个按钮用于在 Route 53 中创建所有记录;
单击它。然后单击“关闭”。

### 创建 SMTP 凭据

您需要创建 SMTP 凭据才能授权 SES。这些将显示为 IAM 用户，
但是您必须通过特定于SES的过程才能获得有效的凭据;只需创建一个 IAM 用户
使用SESFullAccess将不起作用。

转到 SES 页面并选择“SMTP 设置”，然后单击“创建我的 SMTP 凭据”按钮。
您可以将默认 IAM 用户名保留原样;单击创建按钮。您应该被带到屏幕
表示已成功创建用户。单击“显示用户 SMTP 安全凭据”。

您将看到用户名和密码。用户名与任何其他 IAM 用户 ID 类似，但密码
需要转换以使其成为有效的机密。

这些凭据将进入 Helm 配置文件。您还必须填写您拥有的区域
在 中创建这些凭据，在 \<SES_REGION> api.extraEnv.SMTP_HOST 中替换。

### 将 SES 移出沙盒

默认情况下，SES 域处于沙盒模式，只能将电子邮件发送到已验证的电子邮件地址。
要请求将域移出沙盒模式，请转到 SES->电子邮件发送>发送统计信息。
点击“编辑您的帐户详细信息”按钮以打开模式。将“启用生产访问”设置为“是”，
将邮件类型保留在“事务性”上，然后填写网站URL，添加用例描述（基本上
只需向他们保证这仅用于帐户登录，而不是其他任何内容），单击复选框以同意
到他们的TOD，然后点击“提交以供审核”按钮。

他们最多可能需要几天时间才能采取行动。如果请求被拒绝，请解决他们的疑虑。
获得批准后，电子邮件登录应该适用于任何电子邮件地址。

#### 验证测试电子邮件

在生产使用SES域之前，为了登录，您必须验证特定的电子邮件
具有 SES 的地址。转到 SES->Identity Management->Email Addresses。点击“验证新电子邮件”按钮
地址'。输入您要用来测试的地址，然后点击“验证此电子邮件地址”。你应该很快
收到一封电子邮件，其中包含用于验证它的链接（它可能会转到您的“垃圾邮件”文件夹）。点击链接后，
您可以使用该地址登录。

## 设置简单通知服务

SNS用于从空灵引擎平台发送文本消息。

在 AWS Web 客户端中，转到 SNS ->主题并创建新主题。
为其命名，并选择“标准”作为类型，然后单击“创建主题”。

## 为静态资源和 Cloudfront 分发设置 S3 存储桶

各种静态文件存储在 Cloudfront 分配后面的 S3 中。

### 创建 S3 存储桶

在 AWS Web 客户端中，转至 S3 -> 存储桶，然后单击创建存储桶。
为存储桶命名`<name>-static-resources`，例如`ethereal-engine-static-resources`，并将其放在区域 us-east-1 中。
在“对象所有权”下，选择“启用 ACL”，然后在该选项下选择“对象编写器”。
在阻止存储桶的公有访问设置下，取消选中阻止复选框*都*公共访问;
您需要存储桶可公开访问。
选中弹出的复选框，确认您知道内容是公开的。
所有其他设置可以保留其默认值;单击创建存储桶。

打开存储桶的设置，然后转到权限选项卡。中间是“访问控制列表”。编辑它，然后
选中“对象：列表”和“存储桶 ACL：读取”的“所有人（公有访问）”框。单击包含
出现警告标签，显示“我了解这些更改对我的对象和存储桶的影响”，
，然后点击保存更改。
“权限”选项卡的底部是一个跨源资源共享 （CORS） 框。
它应具有以下设置;如果没有，请单击编辑并将其复制到：

    [
        {
            "AllowedHeaders": [],
            "AllowedMethods": [
                "HEAD",
                "GET",
                "POST"
            ],
            "AllowedOrigins": [
                "*"
            ],
            "ExposeHeaders": []
        }
    ]

### 创建云前端分配

在 AWS Web 客户端中，转到 Cloudfront -> 分配，然后单击创建分配。
在“网站”下，点击开始使用。

在源设置下，单击源域名旁边的框，然后选择您刚刚创建的 S3 存储桶的名称。

在“默认缓存行为设置”下，“允许的 HTTP 方法”应设置为“GET、HEAD、OPTIONS”。
缓存和源请求设置应保留在“使用缓存策略和源请求策略”上。
对于源请求策略，请选择“托管 CORS-S3原始”

在“分发设置”下，您可以将价格等级更改为“仅使用美国加拿大和欧洲”以节省一些费用。
对于备用域名，输入“资源”。`<domain>`'，例如`resources.ethereal-engine.io`.
对于 SSL 证书，选择自定义 SSL 证书，然后在单击该框时，选择
“资源。`<domain>`'您之前制作的证书。

其他所有内容都可以保留为默认值，请单击“创建分布”。

## 设置 DNS 记录

**Nginx 负载均衡器必须完全设置并运行，才能完成此步骤**

在 AWS Web 客户端中，转到 Route 53，然后转到您之前创建的托管区域。
单击“创建记录”。如果它在“快速创建记录”下启动，请单击链接
“切换到向导”;这不是必需的，但向导很方便。

在“路由策略”下，将其保留在“简单路由”上，然后单击“下一步”。然后单击“定义简单记录”。

第一条记录应针对顶级域，例如`ethereal-engine.io`，因此请保留记录名称
文本字段为空。在“值/路由流量到”下，单击下拉列表并选择
网络负载均衡器的别名。选择集群所在的区域。
在显示“选择负载平衡器”的位置，单击下拉列表，然后选择已创建的 NLB。
将记录类型保留为“A - 将流量路由到 IPv4 地址和某些 AWS 资源”，然后单击
定义简单记录。

您可以继续单击“定义简单记录”以在一个批处理中生成更多记录。当您在
完成后，单击“创建记录”。

您应该向负载均衡器创建以下“A”记录，将您的域替换为“ethereal-engine.io”：

*   ethereal-engine.io
*   \*.ethereal-engine.io
*   @.ethereal-engine.io
*   api-dev.ethereal-engine.io
*   api.ethereal-engine.io
*   dev.ethereal-engine.io
*   instanceserver.ethereal-engine.io
*   instanceserver-dev.ethereal-engine.io

您还需要创建一个“A”记录，将“resources.ethereal-engine.io”指向您之前创建的 CloudFront 分配。

## 创建 Ethereal Engine 存储库的 GitHub 分叉。

Ethereal Engine代码库最容易部署，方法是分叉它并配置一些Secrets，以便包含GitHub
操作可以为您运行部署。您可以运行`<dev/prod>`-部署操作手动运行
如果您愿意，在这种情况下，您不需要分叉GH存储库。

转到 https://github.com/XRFoundation/XREngine。在右上角，有一个“分叉”按钮。点击它，
然后单击要将其分叉到的帐户/组织。你应该在短时间内被带到你的叉子。

您需要为 GitHub 操作设置多个机密（运行时变量）。默认情况下，GitHub 操作应完全
已启用，但您可以通过转到“设置>操作”进行双重检查。“允许所有操作”应在“操作”下选择
权限。

接下来，单击“设置”下的“机密”。默认情况下不应有。单击顶部附近的“新建存储库机密”
这个页面来做一个新的。您将需要使用以下名称和值创建多个机密：

*   AWS_ACCESS_KEY -> Github-Actions-User IAM 用户的公有密钥
*   AWS_REGION -> ECR 存储库和 EKS 群集的区域
*   AWS_SECRET -> Github-Actions-User IAM 用户的密钥
*   CLUSTER_NAME -> EKS 集群的名称
*   DEPLOYMENTS_ENABLED -> 设置为`true`
*   DEV_REPO_NAME -> 开发 ECR 存储库的基本名称，例如`ethereal-engine-dev`（所有对生成器和服务存储库的引用都将追加`-builder`/`-<service>`到此值）
*   DOCKER_LABEL -> 这几乎可以是任何东西，但你可以使用`lagunalabs/xrengine`
*   ECR_URL -> 存储库的根ECR_URL，即`/ethereal-engine-dev-builder`，例如`11111111111.dkr.ecr.us-west-1.amazonaws.com`或`public.ecr.aws/a1b2c3d4`
*   PRIVATE_ECR -> 将其设置为`true`如果您的ECR存储库是私有的，如果它们是公开的，则根本不需要设置

如果转到“操作”选项卡，可能会看到一些带有绿色复选标记的工作流运行。如果是这样，您将重新运行
`dev-deploy`工作流很快;它的初始运行只是运行了一个检查，看看它是否应该基于
`DEPLOYMENTS_ENABLED`，并且由于未设置为 true，因此它没有执行任何其他操作。现在，这已设置为 true，
重新运行它将触发部署。

如果在转到选项卡时要求您启用操作，并且在启用操作后未列出任何运行，则必须
通过将新代码推送到开发分支来触发工作流。

## 授予 Github-Actions-User 对集群的访问权限

默认情况下，只有设置 EKS 集群的 IAM 用户才能访问该集群。
为了允许其他用户访问集群，您必须将 aws-auth 配置映射应用于集群
向特定 IAM 用户授予访问权限。此文件的模板可以在 packages/ops/config/aws-auth-template.yml 中找到。

您需要为此文件提供一些值。找到`<rolearn>`，在 AWS 中转到 EKS->Clusters->
`<your cluster>`->计算>选择一个节点组。 详细信息中应为“节点 IAM 角色 ARN”;复制此
并替换`<rolearn>`在 aws-auth 文件中。`<account_id>`是您的 AWS 账户的 ID;在上部
AWS 客户端的右上角应为`<your_username>@<abcd-1234-efgh>`.12 个字符的字符串
在 @ 之后是帐户 ID。请确保删除`-`粘贴时，它来自帐户 ID。
`<IAM_username>`是您要授予访问权限的 IAM 用户的用户名，例如`Github-Actions-User`.

您可以通过复制`- groups:`部分`mapUsers`，例如

      mapUsers: |
        - groups:
          - system:masters
          userarn: arn:aws:iam::abcd1234efgh:user/Github-Actions-User
          username: Github-Actions-User
        - groups:
          - system:masters
          userarn: arn:aws:iam::acbd1234efgh:user/FSmith
          username: FSmith

当 aws-auth 配置文件填写完毕后，只需运行`kubectl apply -f path/to/aws-auth.yml`.

## 使用 Helm 部署到 EKS

设置完所有网络后，您终于可以将代码库部署到 EKS。
这有几个步骤，这将涉及部署大部分但不是全部需要的东西
配置值，然后让部署过程填充其余部分。

### 用变量填写 Helm 配置文件

用于开发和生产部署的模板 Helm 配置文件可以在 packages/ops/configs/\<dev/prod>.template.values.yaml 上找到。
在填写它们之前，在其他地方创建一个副本，将其称为“\<dev/prod>.values.yaml”，然后编辑该副本。
生成器和主部署应使用相同的配置文件。当构建器为数据库设定种子时，
它需要许多值，这些值只需要为其他服务配置，因此所有值
需要在一个配置文件中定义。

有许多字段需要填写，大多数字段都标有`<>`.并非所有情况都是必需的 - 如果您不是
例如，使用社交登录，您不需要Github / Google / Facebook /等的凭据。

### 值得注意的配置变量

以下是一些配置变量，您可能需要根据特定设置更改这些变量

#### \<api/client/analytics>.affinity.nodeAffinity

在 api、客户端、实例服务器等的配置部分中，有一个部分看起来
像这样：

      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: eks.amazonaws.com/nodegroup
                    operator: In
                    values:
                      - ng-1

值，`ng-1`在此示例中，必须更改以匹配节点组的任何名称
该服务将在其上运行，例如，如果您为名为
`abcd-instanceservers-5`，然后您将在`values:`

如果您的 EKS 设置为您创建了一个节点组，并且您希望将其用于 API、客户端和
分析服务器，请确保将它们的关联值更改为名为
初始节点组。

#### builder.extraEnv.PRIVATE_ECR

如果您使用的是私有 ECR 存储库，请在构建器配置文件中将其设置为“true”。

#### （everything）.image.repository

您需要将每个都替换为\<repository_name>非构建器存储库的完整ECR_URL，例如`abcd1234efgh.dkr.ecr.us-west-1.amazonaws.com/ethereal-engine-dev-api`.
每项服务都必须具有适当的`-<service>`其后缀，例如`-api`,`-client`等。

### 运行 Helm 安装

跑`helm install -f </path/to/*.values.yaml> <stage_name>-builder xrengine/xrengine-builder`
和运行`helm install -f </path/to/*.values.yaml> <stage_name> xrengine/xrengine`

这将使用 Helm 配置文件（\<dev/prod..values.yaml）启动主部署和生成器部署>。
两者都不能完全工作，因为存储库中还没有有效的图像。The GitHub
操作和构建器流程将生成这些映像，并使用它们构建的映像的标记更新部署
以便他们可以下拉并使用这些图像。

## 启动 GitHub 操作

在 GitHub 中，如果返回到“操作”选项卡，应会看到一个`dev-deploy`行动。单击它，您应该看到
显示其状态的页面，该状态应为所有绿色复选标记或指示事物未运行。在上部
向右，单击`Re-run all jobs`.这将再次启动它，现在`DEPLOYMENTS_ENABLED`设置为 true，它应该
尝试构建和部署构建器。

（如果操作最初被禁用，则必须将其他代码合并到开发分支中，以使其启动开发部署过程）

### 构建过程概述

完整的生成和部署过程的工作方式如下：

1.  GitHub Actions构建的Ethereal Engine monorepo刚好足以获取任何已安装的Ethereal Engine项目。
2.  GitHub Actions 将此构建器 Docker 映像推送到存储库`xrengine-<release>-builder`在 ECR 中
3.  GitHub 操作会更新生成器部署，以指向它刚刚创建的生成器映像。
4.  构建器部署在其单个节点上启动构建器 Docker 映像
5.  构建器连接到部署的数据库并检查是否存在表`user`.这是一个代理
    对于正在设定种子的数据库;如果它不存在，它用基本的空灵引擎模式为数据库设定种子，
    将默认项目种子化到数据库和存储提供程序中，并为各种类型设定种子。
6.  构建器将下载部署已添加的任何 Ethereal Engine 项目。
7.  构建器使用这些项目并发为每个服务构建 Docker 映像，将它们构建到客户端文件中，并复制它们，以便 API 和实例服务器可以访问它们。
8.  构建器将这些最终的 Docker 映像推送到存储库`xrengine-<release>-<service>`在 ECR 中
9.  构建器将更新主部署以指向它刚刚创建的最终映像。
10. 主部署为 API、分析、客户端和实例服务器服务启动最终的 Docker 映像。

## 使用 Helm for Server Logs 安装 Elastic Search 和 Kibana

要安装 Elasticsearch，请在 Helm 中添加 Elastic 存储库：`helm repo add elastic https://helm.elastic.co`

现在，使用 curl 命令下载包含配置信息的 values.yaml 文件：

`curl -O https://raw.githubusercontent.com/elastic/helm-charts/master/elasticsearch/examples/minikube/values.yaml`

使用 helm install 命令和 values.yaml 文件来安装 Elasticsearch helm 图表：

`helm install elasticsearch elastic/elasticsearch -f ./values.yaml`

\-f 选项允许使用模板指定 yaml 文件。如果您希望在特定命名空间中安装 Elasticsearch，请添加 -n 选项，后跟命名空间的名称：`helm install elasticsearch elastic/elasticsearch -n [namespace] -f ./values.yaml`

现在检查集群成员是否已启动：`kubectl get pods --namespace=default -l app=elasticsearch-master -w`

另一个选项是使用 helm test 命令来检查群集的运行状况：`helm test elasticsearch`

要在 Elasticsearch 之上安装 Kibana：：`helm install kibana elastic/kibana`
检查所有 Pod 是否已准备就绪：`kubectl get pods`

设置端口转发后，通过键入` http://localhost:5601  `在浏览器中

为了将记录器与 elasticsearch 连接起来，请更新 config file（values.yml） for Xr env`api.extraEnv.ELASTIC_HOST`例如：`http://<username>:<password>@<host>:<port>`

### 升级现有的 Helm 部署

Helm 的功能之一是能够使用新值轻松升级部署。命令
这样做与安装命令非常相似：

`helm upgrade --reuse-values -f </path/to/*.values.yaml> --set api.image.tag=<latest_github_commit_SHA>,client.image.tag=<latest_github_commit_SHA>,instanceserver.image.tag=<latest_github_commit_SHA> <stage_name> xrengine/xrengine`

`--reuse-values`表示继承上一个部署中的所有配置值。这是最重要的
对于标记，因为它们通常与`helm install/upgrade`命令，而不是 Helm 配置。
用`-f <config_file>`和`--set <variables>`之后，它将在
结转值。

如果您没有部署代码库的新版本，则可以跳过整个`--set *.image.tag=<SHA>`.
