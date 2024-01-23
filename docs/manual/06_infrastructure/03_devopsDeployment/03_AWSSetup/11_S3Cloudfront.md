## Set up S3 bucket for static resources and Cloudfront distribution

Various static files are stored in S3 behind a Cloudfront distribution. If you are serving the client files
from the Storage Provider, then all client files will be stored and served from these as well.

### Create S3 bucket
In the AWS web client, go to S3 -> Buckets and click Create Bucket.
Name the bucket `<name>-static-resources`, e.g. ```etherealengine-static-resources```, and have it be in Region us-east-1.
Under Object Ownership, select 'ACLs enabled', and under that select 'Object Writer'.
Under Block Public Access Settings For The Bucket, uncheck the checkbox Block *all* Public Access; 
you need the bucket to be publicly accessible.
Check the box that pops up confirming that you know the contents are public.
All other settings can be left to their default values; click Create Bucket.

Open the bucket's settings and go the Permissions tab. Midway down is 'Access control list'. Edit that, and
Check the boxes for Objects:List and Bucket ACL:Read for 'Everyone (public access)'. Click the box with the
warning label that appears that says "I understand the effects of these changes on my objects and buckets",
then click Save Changes.
At the bottom of the Permissions tab is a Cross-origin Resource Sharing (CORS) box. 
It should have the following settings; if not, click Edit and copy this in:
```
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
```

### Create Cloudfront distribution
In the AWS web client, go to Cloudfront -> Distributions and click on Create Distribution.
Under 'Web', click on Get Started.

Under `Origin`, click on the text box under `Origin domain`, and select the name of the S3 bucket you just made.
The `Name` field should be automatically populated, and should be left as whatever that value is.

Several fields in `Default cache behavior` will be changed.

Under `Viewer -> Viewer protocol policy`, select 'Redirect HTTP to HTTPS'
Under `Viewer -> Allowed HTTP methods`, select 'GET, HEAD, OPTIONS', and check `Cache HTTP methods -> OPTIONS`.

In `Cache key and origin requests`, leave it on `Cache policy and origin request policy`.
If this option is not available, see the below subsection for `Legacy cache settings`

For `Cache policy`, you will need to make a new policy, which is easily done by clicking the link `Create policy`
underneath the selector; this will open a new tab. Name this policy anything you want, e.g. 'Cached-on-headers',
then under `Cache key settings`, click on the `Headers` selector and select 'Include the following headers'. A new
selector should appear under that titled `Add header`. Click the selector, and check 'Origin',
'Access-Control-Request-Method', and 'Access-Control-Request-Headers', then click away from the menu. Click the 'Create'
button to create the new policy.

Once the policy has been created, go back to the tab that you were creating the CloudFront distribution in.
Click the refresh button to the right of the `Cache policy` selector to fetch your new policy, then click the selector, 
and your new policy should appear in the selector at the bottom of the list under the header 'Custom'. Select it.

For `Origin request policy`, select the option 'CORS-S3Origin'.

You should also make a custom response header policy so that files are served with the `Origin-Agent-Cluster`
header, which will tell most browsers to isolate resources for same-site cross-origin requests. To do that,
you will need to make a custom response header policy. Under `Response headers policy`, select `Create Policy`. 
This will open a separate tab. Name this something like `Origin-Agent-Cluster`, then under `Custom headers`,
click `Add header`. For name, enter `Origin-Agent-Cluster`, and for `Value`, enter `?1`. Then click the `Create`
button at the bottom.

Go back to the tab where you were creating the Cloudfront distribution. Click the refresh button to the right of
the `Response headers policy` selector to fetch the new policy, then click the selector, and your new policy should
appear in the selector at the bottom of the list under the header `Custom`. Select it.

Under `Settings`, you can change `Price class` to 'Use Only North America and Europe' to save some money.
For Alternate Domain Names, click 'Add item', then in the text box that appears, enter 'resources.`<domain>`', e.g.
```resources.etherealengine.org```, or '\<RELEASE_NAME\>.`<domain>`', e.g. ```dev.etherealengine.org```, depending on
whether you are serving the client files from client/API pods or the Storage Provider, respectively. 
Under `Custom SSL Certificate`, click on the selector that says 'Choose certificate', then select the 
'resources.`<domain>`'/'`<RELEASE_NAME>.<domain>`' certificate you made earlier. If you are serving the client
files from the Storage Provider, under `Default root object`, enter `client/index.html`; if you are serving
the client files from client/API pods, leave this blank.

Everything else can be left at the default values, click Create Distribution.

#### Legacy cache settings
If for some reason `Cache policy and origin request policy` is not available for you, and you have to use
`Legacy cache settings`, the under `Headers`, select 'Include the following headers'. Under `Add header` that appears,
click on the selector titled 'Select headers', and in the menu that opens, check 'Host', 'Origin',
'Access-Control-Request-Method', and 'Access-Control-Request-Headers', then click away.
