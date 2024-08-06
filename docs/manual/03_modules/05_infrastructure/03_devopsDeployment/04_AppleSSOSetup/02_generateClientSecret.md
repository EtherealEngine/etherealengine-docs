# Generate Client Secret for Apple SSO

We will need to generate a Client Secret for Apple to be able to send authentication requests to Apple.

# Pre Requisites

You must have the following credentials already with you.

- Key ID,
- Team ID,
- Client ID,
- Developer Account's secret Key file

# Generate the Client Secret

You can make a request to Apple with the required credentials and generate the Client Secret. Following Code snippet can be used to request the Client Secret from Apple. This is written in Javascript but you can use pretty much any programming language to request a Client Secret from Apple provided that you have all what is listed in the Pre-Req section.

```
var jwt = require('jsonwebtoken');

const getAppleClientSecret = () => {
    const privateKey = fs.readFileSync('Path to the Apple Secret Key');
	AuthKey_2K4W7DYLQL.p8";
	const keyId = "XXXXXXXXXXX";
	const teamId = "XXXXXXXXXXX";
	const clientId = "Client ID for the deployment, you can get it from Apple and also from the Client ID variabels at Admin/Settings#Authentication";

	const headers = {
		kid: keyId,
		typ: "JWT",
	}
	const claims = {
		'iss': teamId,
		'aud': 'https://appleid.apple.com',
		'sub': clientId,
	}
	token = jwt.sign(claims, privateKey, {
		algorithm: 'ES256',
		header: headers,
		expiresIn: '180d'
	});

	return token

}
var AppleSecret = getAppleClientSecret();

```

:::Note: Please note that this Client Secret will expire in 6 months, we cannot increase the expiry duration of the Client Secret it could at maximum be set to 6 months, so we will have to regenerate it after that save it to wherever it was being used.

You can run the above script as an independent Javascript code to generate the Apple Client Secret or you can also use the script written in the IR Engine's repository and generate an Apple key secret by running the following command on the root folder.

```
npm run create-apple-sso-secret -- --secretKeyPath \<Secret_Key_Path>  --keyId \<Secret_Key_ID> --teamId \<Developer_Account_Team_ID> --clientId \<ClientID_For_ServiceID>
```

# Updating the Client Secret in IR Studio

Every 6 months, when the Client Secret will expire, you will have to get it updated in the running instances of IR Studio as per the following.

- Generate a new Client Secret as mentioned above.
- on the Deploed instance, go to '/admin/settings#authentication'.
- Update the Apple Client Secret and hit save, it should take a couple of minutes to restart the API pods and should be done then.
- Also update the client Secret value in the "Values.yaml" file for both the main release and builder. You can use the following command as reference for updating the Client Secret in Values.yaml files of the deployments. Run the command separately for Main and Builder release while updating the corresponding values accordingly.
 
```
helm repo update && helm upgrade --reuse-values --set api.extraEnv.APPLE_CALLBACK_URL=\<CallbackURL> --set api.extraEnv.APPLE_CLIENT_ID=\<ClientID> --set api.extraEnv.APPLE_CLIENT_SECRET=\<ClientSecret> --set media.extraEnv.APPLE_CALLBACK_URL=\<CallbackURL> --set media.extraEnv.APPLE_CLIENT_ID=\<ClientID> --set media.extraEnv.APPLE_CLIENT_SECRET="\<ClientSecret>" \<Main and builder Release Name> etherealengine/etherealengine
```

# Future Work/Recommendations

We could always make the client Secret generation automatic, provided that the Secret Key is placed in a separate and security accesable location which then can be used to generate Client secrets on the go. We could update the App's code to be able to dynamically generate and save the client secret so you do not have to mannually get it updated every 6 months. At the moment we are figuring out to place the Secret file in a secure yet accessable location and we can then update our code to generate the Client secret automatically.
