# Client Files
## Ways of serving client files in production

There are multiple ways to serve built client files in a production environment.
You should decide how you want to serve them now, because a few later steps will be affected
by that choice, and changing your AWS configuration after everything has been set up one way
is a little tricky:

* From client pods (separate from API pods)
* From API pods
* From the storage provider, such as S3/Cloudfront

### Serve client files from client pods
This is the default method. The Helm charts assume that the deployment will have client pods
to serve client files, and the client ingress will point traffic to the client pods. The client
URL will be pointed to the EKS Load Balancer, and you will not need a separate client certificate.

This option gives you slightly more flexibility in scaling a deployed cluster than serving
from the API pods, since you can scale the number of API and client pods independently.

Note that, as of this writing, this is tentatively going to be deprecated by a future re-architecture
of how projects are built and served, and serving from the Storage Provider may end up being the only
allowable option.

### Serve client files from API pods
This will make your builder build and serve the client service from the API pods. The Helm
chart will not have a client deployment, serviceaccount, configmap, etc., and the client
ingress will point to the API pods. The client URL will be pointed to the EKS Load Balancer,
and you will not need a separate client certificate.

To enable this, set client.serveFromApi to `true` in your Helm config file when you are configuring it.
This needs to be applied to both the builder deployment and the main deployment, but if you set this
before deploying anything, it will be applied to both.

This option can save you some money by requiring fewer nodes in order to host all of the
API+client pods you desire, as you do not need capacity for separate client pods. It offers
slightly less flexibility in scaling since you cannot scale the number of API and client pods
separately; more client capacity would require more API capacity, and vice versa. It also
will result in slightly longer deployment times, as the combined API+client Docker images
are larger than an API-only or client-only image (though smaller than the sum of the two
separate images), which will mean a few more seconds to download to each node.

Note that, as of this writing, this is tentatively going to be deprecated by a future re-architecture
of how projects are built and served, and serving from the Storage Provider may end up being the only
allowable option.

### Serve client files from Storage Provider (S3 + Cloudfront)
This will make the client build process push all of its built files to S3 and serve them via
Cloudfront. Static resources will also be served from the client domain instead of a separate
resources domain. The client URL will be pointed to the Cloudfront distribution, not the EKS Load
Balancer; only API and instanceserver traffic will go to the EKS cluster. You will need a separate
client certificate, but you will not need a resources domain certificate.

As of this writing, only Amazon S3/Cloudfront is supported as a storage provider
in a cloud environment.

To enable this, set builder.extraEnv.SERVE_CLIENT_FROM_STORAGE_PROVIDER to `true` in the
Helm config file when you are configuring it. Also make sure that builder.extraEnv.STORAGE_PROVIDER is set to `s3`.

This option can greatly speed up the time it takes for users to fully load your worlds,
since every client file can be served from a CDN close to them, rather than
having to fetch them all from the closest physical server. It will also slightly speed up build times and deployment
times since the client build does not need to be pushed to a Docker repo (though a cache of the build will still
be pushed to speed up future builds).
