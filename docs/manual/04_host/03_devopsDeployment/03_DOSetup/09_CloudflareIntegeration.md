# Why Cloudflare

With IR Engine on the AWS, we had AWS configured on the front end of the IR Engine, which used to manage the routing and distribution of the content to our end users. Since Cloudfront was inherent to AWS, we may not have been able to use the same for the IR Engine on DO. So we had to look for alternatives and cloudflare used to be relevently a better option.

The CDN functionaly was built into the SOS of DO so that may not have been an issue but we had to route our requests to the SOS files properly and that's where Cloudflare would be of great help.

# Cloudflare workers

Similar to the Cloudfront Functions, Clourflare also has a functionality to maniuplate the incoming requests and route it based on any criteria. The Cloudflare workers enable you to write edge code that gets executed once the request lands on cloudflare before it could enter the application itself.

We had written a small Cloudflare worker code that routes the incoming requests to relvent parts of the IR Engine. Following is the code section. It could be update and optimized as per the need.

```
export default {
  async fetch(request){
    const url = new URL(request.url);
    let urlString = url.toString();
    const regex = 'https:.*[.]theoverlay[.]io'; //You can update this regex, as per your own domain.
    const repReg = new RegExp(regex);
    const match = repReg.exec(urlString);
    let stringNewURL = "";
    if (match){
      stringNewURL = match[0]
    }
    let trimmmedURL = urlString.replace(repReg,"");
    var routeRegexRoot = '^/login$|^/location/|^/auth/|^/ecommerce$|^/room$|^/editor$|^/editor/|^/studio$|^/studio/|^/capture/|^/chat$';
    var routeRegex = new RegExp(routeRegexRoot);
    var publicRegexRoot = '^/android-chrome-192x192.png|^/android-chrome-512x512.png|^/apple-touch-icon.png|^/assets/|^/browserconfig.xml|^/draco_decoder_gltf.wasm|^/draco_encoder.wasm|^/facetracking/|^/favicon-16x16.png|^/favicon-32x32.png|^/favicon.ico|^/index.html|^/loader_decoders/|^/manifest.webmanifest|^/mstile-150x150.png|^/service-worker.js|^/service-worker.js.map|^/sfx/|^/static/|^/workbox-31a33059.js|^/workbox-31a33059.js.map|^/workers/';
    var publicRegex = new RegExp(publicRegexRoot);
    if (routeRegex.test(trimmmedURL)) {
        urlString = stringNewURL+'/client/index.html';
    }

    if (publicRegex.test(trimmmedURL)) {
      urlString = stringNewURL+'/client' + trimmmedURL;
    }
    const destinationURL = new URL(urlString);
    var destinationRequest = new Request(destinationURL, new Request(request));
    const originalResponse = await fetch(destinationRequest);
    return new Response(originalResponse.body);
  }
}

```

Once the worker process is in place, you can update the IR Engine code to be able to serve the static files from SOS rather than those being served from the API pods. In order to do that, you will have to do the following. 

- Change `SERVE_CLIENT_FROM_STORAGE_PROVIDER` to "true" in both api.extraEnv and builder.extraEnv
- Change client.serveFromApi to false
- Set STORAGE_CLOUDFRONT_DOMAIN to `dig.theoverlay.io` or Whatever domain you have configured for the IR engine. 

Once the above changes are done, the requests should be landing on Cloudflare and the Cloudflare worker would get executed, which would send the requests to SOS and other relevent parts of the application accordingly. 
