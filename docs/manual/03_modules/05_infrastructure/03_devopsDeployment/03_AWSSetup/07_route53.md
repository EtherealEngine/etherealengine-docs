# Route 53
## Create Route 53 Hosted Zone and set up ACM certificates

Before installing Nginx to the cluster, you'll need to have all of the networking squared away.
This requires creating the necessary SSL certificates and creating some DNS records to point 
various subdomains to the right place.

### Purchase and register domain through Route53 (optional)
If you do not have a domain for your application already, it's easiest to register it through Route53.
Go to Route53->Domains->Registered domains, then click the 'Register Domain' button, and follow the
workflow to register a domain name.

### Create Route 53 Hosted Zone
In the AWS web client, go to Route 53. Make a hosted zone for the domain you plan to use for
your setup of iR Engine. You'll be coming back here later to create DNS records.

Open the Hosted zone, then click on 'Hosted zone details' to see more information. The value 'Hosted zone id'
is used in the dev/prod.values.yaml file for 'ROUTE53_HOSTED_ZONE_ID'

#### Point external registrar subdomains to use Route53 Nameservers (only if your domain is registered outside Route53)
If you already have a domain registered with another registrar service, you'll need to add some DNS records
in there to point the specific subdomains you'll be using to AWS' nameservers.

First, go to Route53->Hosted Zones and open the domain you'll be using by clicking on the domain name (or
highlighting the row and clicking the 'View details' button). There should be two records under Records.
Look for the one of type 'NS'; under 'Value/Route traffic to', there should be four lines that all start
with 'ns-'. These will be used shortly.

Go to your external registrar and go to the DNS records page. For each subdomain that will be in use, you
need to add four records of type 'NS'. The Name wil be the subdomain, and the Nameserver will be one of
the four lines under the 'NS'. You need a record for each of the four lines.

If you're setting up multiple deployments, e.g. both a dev and prod deployment, you'll need a set of four
NS records for each subdomain that those deployments will be behind.

### Create certificates with ACM

Go to Amazon Certificate Manager. If there are no certs in that region, click on Get Started under Provision Certificates,
otherwise click on Request a Certificate.

You should select Request a Public Certificate, then select Request a Certificate. The next page
should be headed Add Domain Names. You should add both the top-level domain, such as ```etherealengine.org```, 
as well as a wildcard for all subdomains e.g. ```*.etherealengine.org```, then click Next.

Choose DNS Validation on the next page and click Next. You can skip adding tags and just click Review,
then Confirm on the final page.

You should be sent to a page headed Validation. Click on the arrow next to each domain to open more
options. Click on the button Create Record in Route 53 to open a confirmation modal, and in that modal
click Create.

As it indicates, it can take up to 30 minutes for these domains to be validated. If you click on Complete
after triggering the record creation for each of them, you should be sent back to the Certificates page.
Opening the cert you just made will show the validation status of each domain.

If you open the details of this certificate, there should be a field 'ARN' with a value that looks
something like ```arn:aws:acm:<region>:<AWS account ID>:certificate/<a UUID>```. Take note of this for later,
when you go to install ingress-nginx.

#### If you are serving client files from client or API pods
You should follow the above instructions to make a second certificate for ```resources.<domain>```.
Note that this certificate MUST be made in us-east-1, regardless of which region everything else is
set up in; as of this writing, CloudFront can only use certificates in us-east-1.

#### If you are serving client files from the Storage Provider
You should follow the above instructions to make a second certificate for ```<RELEASE_NAME>.<domain>```.
Note that this certificate MUST be made in us-east-1, regardless of which region everything else is
set up in; as of this writing, CloudFront can only use certificates in us-east-1.
