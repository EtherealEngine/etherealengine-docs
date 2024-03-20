# DNS records
## Set up DNS records
**The Nginx Load Balancer must be fully set up and running before this step can be completed**

In the AWS web client, go to Route 53, then go into the Hosted Zone you made earlier.
Click on Create Record. If it starts you under Quick Create Record, click the link
'Switch to Wizard'; it's not necessary, but the wizard is handy.

Under Routing Policy, leave it on Simple Routing and click Next. Then click Define Simple Record.

The first record should be for the top-level domain, e.g. ```etherealengine.org```, so leave the Record Name
text field blank. Under Value/Route Traffic To, click on the dropdown and select
Alias to Network Load Balancer. Select the region that your cluster is in.
Where it says Choose Load Balancer, click the dropdown, and select the NLB that was created.
Leave the Record Type as 'A - Route traffic to an IPv4 address and some AWS resources', then click
Define Simple Record.

You can keep clicking Define Simple Record to make more records in one batch. When you're
done, click Create Records.

You should make the following 'A' records to the loadbalancer, substituting your domain for 'etherealengine.org':

* etherealengine.org
* *.etherealengine.org
* @.etherealengine.org
* api-dev.etherealengine.org
* api.etherealengine.org
* dev.etherealengine.org -- Only if serving client files from client/API pods
* instanceserver.etherealengine.org
* instanceserver-dev.etherealengine.org

You also need to make an 'A' record pointing 'resources.etherealengine.org' or '\<RELEASE_NAME\>.etheralengine.org' to the
CloudFront distribution you made earlier.
Instead of 'Alias to Network Load Balancer', select 'Alias to Cloudfront distribution', then click the text box that appears
that says 'Choose distribution'. A selector should appear with the subdomain you're routing as well as the Cloudfront
distribution's domain name, which you should click on. Then click Define simple record.
