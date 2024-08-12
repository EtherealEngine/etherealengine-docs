# Generate Client Secret for Apple SSO

We will need to generate a Client Secret for Apple to be able to send authentication requests to Apple.

# Pre Requisites

You must have the following credentials already with you.

- **Developer Account's secret Key file**: This refers to the file that you had created while creating the secret key on Apple Developer account for this deployment. The path of the file could look something simiar to `/home/SecretFiles/AuthKey_M98LQ25T3Z.p8`
- **Key ID**: Key ID of the Secret key that you may have generated on Apple Developer account for this deployment. e.g. "M98LQ25T3Z". Note that the key identifier in your secret key file name is matching with the Key ID.
- **Team ID**: The team ID of the developer account. It can be obtained from the App ID that you have created for this deployment. e.g, "ZLWKHWSK48"
- **Client ID**: This is the service ID that you have created which can now be used as a client ID. e.g. "com.ir-engine.qat-dev.id" 

# Generate the Client Secret

You can make a request to Apple with the required credentials and generate the Client Secret. You can use the script written in the IR Engine's repository under `scripts/generate-apple-sso-token.ts` and generate an Apple key secret by running the following command on the root folder. Please refer to the Pre-Req section for details of the values being used in the command below. 

```
npm run generate-apple-client-secret -- --secretKeyPath <Secret_Key_Path>  --keyId <Secret_Key_ID> --teamId <Developer_Account_Team_ID> --clientId <ClientID_For_ServiceID>
```

For Instance.

```
npm run generate-apple-client-secret -- --secretKeyPath '/home/SecretFiles/AuthKey_M98LQ25T3Z.p8'  --keyId 'M98LQ25T3Z' --teamId 'ZLWKHWSK48'--clientId 'com.ir-engine.qat-dev.id'
```

**NOTE**
The Client Secret's expiry could at maximum be set to 6 months, so we will have to regenerate it after that.

# Updating the Client Secret in IR Studio

Every 6 months, when the Client Secret will expire, you will have to get it updated in the running instances of IR Studio as per the following.

- Generate a new Client Secret as mentioned above.
- On the deployed instance, go to '/admin/settings#authentication'.
- Update the Apple Client Secret and hit save, it should take a couple of minutes to restart the API pods and should be done then.
- Also update the Client Secret value in the "Values.yaml" file for both the main release and builder. You can use the following command as reference for updating the Client Secret in Values.yaml files of the deployments. Run the command separately for Main and Builder release while updating the corresponding values accordingly.
 
```
helm repo update && helm upgrade --reuse-values --set api.extraEnv.APPLE_CALLBACK_URL=\<CallbackURL> --set api.extraEnv.APPLE_CLIENT_ID=\<ClientID> --set api.extraEnv.APPLE_CLIENT_SECRET=\<ClientSecret> --set media.extraEnv.APPLE_CALLBACK_URL=\<CallbackURL> --set media.extraEnv.APPLE_CLIENT_ID=\<ClientID> --set media.extraEnv.APPLE_CLIENT_SECRET="\<ClientSecret>" \<Main and builder Release Name> etherealengine/etherealengine
```

# Future Work/Recommendations

We could always make the client Secret generation automatic, provided that the Secret Key is placed in a separate and security accesable location which then can be used to generate Client secrets on the go. We could update the App's code to be able to dynamically generate and save the client secret so you do not have to mannually get it updated every 6 months. At the moment we are figuring out to place the Secret file in a secure yet accessable location and we can then update our code to generate the Client secret automatically.
