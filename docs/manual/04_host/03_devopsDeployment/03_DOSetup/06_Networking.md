# Networking Configuarations
## Adding the domain in DNS
You will have to add a domain in on the DO control pannel by going to the Networking -> Domains. Lets assume we want to add a domain called `theoverlay.io`. Under the domain section, you will have to add that TLD and once added, you can expand that to check if the name server records have been created agains that domain.
You will also have to add a few more records for various services of Ethere engine in under this Domain as per the following. 

- `CNAME` record with Hostname `resources-dig.theoverlay.io` and Value `etherealengine-static-resources.sfo2.cdn.digitaloceanspaces.com.` (CDN URL of DO Spaces Object Storage)
- `A` record with Hostname `dig.theoverlay.io` and value `\<Ingress-Loadbalancer-IP>`
- `A` record with Hostname `instanceserver-dig.theoverlay.io` and value `\<Ingress-Loadbalancer-IP>`
- `A` record with Hostname `api-dig.theoverlay.io` and value `\<Ingress-Loadbalancer-IP>`
- `A` record with Hostname `theoverlay.io` and value `\<Ingress-Loadbalancer-IP>`

These records are created to be able to route the traffic to the loadbalancers and then the relevent services with in the Ethereal Engine. 

## Firewall
Under the same Networking -> Firewalls you will have to add the TCP and UDP port rules to allow inbound traffic from Ports 7000-8000 and from ports 30000-32767. Similarly you will have to add the outbound rules for All Ports.

## Adding a wildcard certificate
To make aur domains and subdomains secure, we would also be adding an SSL certificate that can ensure the security of our domains and subdomains. We could get our SSL certificate from any valid Certificate Authority. For DO we are at the moment using the Let's Encrypt certificate that gets created from with in the Digital Ocean Control pannel but if you have aquired a certificate of your own, you can also get that added in to the DO.

To create a certificate go to the [DO Website](https://cloud.digitalocean.com) and in the left hand pane under `Settings` click on the `Security` tab and the click on the `Add Certificate` button to add the certificate. Then click on the `Let's Encrypt` certificate since we want to create a new certificate. Under the domain section, add the wildcard comain for `*.theoverlay.io` since we need to also make sure that this certificate is valid for our subdomains. Give your certificate a valid name and then click `Generate Certificate` 
Make sure that you have added the following Name server record with the domain registrar for `theoverlay.io` or for whichever domain you are using.

- ns1.digitalocean.com.
- ns2.digitalocean.com.
- ns3.digitalocean.com.

If the DO is able to validate the doamin then the certificate will be created in a few minutes and you would be able to see that certificate in certificate list. This is the certifiate whose ID will be added in the ngnx-ingress configurations in the values.yaml file. 

## Adding certificate with DO SOS
Under the spaces Object storage, you can click on the settings and then the Change button in front of the CDN settings to edit the CDN settings. In there, you can add a certificate to make sure that your DO SOS are secure. If you click on the custom domain a list of the available certifiate should appear in which there will be a wildcard certificate for `*.theoverlay.io`, you can get that added.
