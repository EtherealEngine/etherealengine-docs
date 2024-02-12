## Create ECR repositories for built images.
The Ethereal Engine deployment process will be building multiple Docker images, and those need to be stored somewhere.
In AWS, that somewhere is [Elastic Container Registry](https://us-west-1.console.aws.amazon.com/ecr/get-started).
You need to make those repositories in the same AWS region where the EKS cluster is running.

Go to the ECR link above and click Get Started under Create a Repository. If you're very concerned about any of your
Ethereal Engine project codebase(s) getting out, you can choose Private for Visibility Settings, but normally Public is fine.
You'll be needing to create multiple repositories for each deployment, e.g. several repos for a `dev` deployment,
several more for a `prod` deployment, etc.

Assuming you're first doing a `dev` deployment, name the first repo `etherealengine-<RELEASE_NAME>-builder` under Repository
Name, e.g. `etherealengine-dev-builder`. You shouldn't need to change any other settings, though if you're using a Private 
repo and want to turn on Tag Immutability, that's fine. The image tags that are generated should never collide, but it
will prevent any manual overwriting of a tag. Click Create Repository.

You will need to make four more repos for each of the services that are deployed as part of the Ethereal Engine stack -
`api`, `client`, `instanceserver` and `taskserver`, which are also in the form `etherealengine-<RELEASE_NAME>-<service_name>`.
e.g. `etherealengine-dev-api`, `etherealengine-dev-client`, `etherealengine-dev-instanceserver` and `etherealengine-dev-taskserver`.
Everything else can be left alone for those, too.

On the [repositories page](https://us-west-1.console.aws.amazon.com/ecr/repositories), you should see all of 
the repositories you made. If you don't see any, you may be on the wrong tab up top - click Private or Public to switch
between them. Also check that you're in the right AWS region. You'll see a column 'URI'. If you made public repos,
the URIs should be in the form `public.ecr.aws/<identifier>/etherealengine-<RELEASE_NAME>(-builder)`; if you made private 
repos, the URIs should be in the form `<AWS_account_id>.dkr.ecr.<AWS_region>.amazonaws.com/etherealengine-<deployment>(-builder)`. 
Take note of everything before the `/etherealengine-<RELEASE_NAME>` - you'll need to add that as a variable in later steps.
It will be called `ECR_URL` there.
