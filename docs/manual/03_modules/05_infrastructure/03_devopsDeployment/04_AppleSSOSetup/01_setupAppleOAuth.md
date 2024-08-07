# How to set up Apple SSO to be able to let users sign in
Just as we have other OAuth providers that allow users to sign in using their accounts created on other well known platforms, we also have enabled Apple SSO support for IR Studio. This guide scripts down the blueprints to be able to enable it for any particular application.

# Pre Requisites
- Apple Developer Account
- An Apple Account added into the developer account with all the right permissions to be able to edit and udpate app details.
- An app where you want to enable Apple SSO, `IR Engine` in our case. 


Go to [Apple Developer Account](https://idmsa.apple.com/IDMSWebAuth/signin?appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757&path=%2Faccount%2F&rv=1) and sign in with and apple Developer account which should have been added to the developer account previously and must have the right permissions. There, you will need to create an App ID, a Service ID and later on a Private Key, these will give you the credentials that you can then use in your app to be able to let users log in using their Apple IDs.

# Create an App ID
In the Apple Developer account, do the following. 

- Go to section named as `Certificates, Ids & Profiles` and click Identifiers.
- Create a new identifier, which usually can be created by clicking a small '+' icon besides the identifiers headline. If you do not see that, your logged in user might not have the necessary permissions to add the app ID. Please get your users the right permissions before moving ahead. 
- Click "App IDs" click "Continue".
- Click "App" in next window and click "Continue".
- Fill in the form that opens up.
  - Enter the description.
  - Enter the Bundle ID which could be a reverse-domain styled string i.e. 'com.domainname.appname'
  - Scroll down to "Capabilities" section and check `Sign In with Apple` and click continue. 
  - Verify details and click register.

# Create a Service ID
In the Apple Developer account, do the following. 

- Go to section named as `Certificates, Ids & Profiles` and click Identifiers.
- Click the '+' button beside the 'identifiers'.
- Click "Service IDs" and click "Continue".
  - Enter the description.
  - Enter the Bundle ID which could be a reverse-domain styled string i.e. 'com.domainname.appname'
  - Click "Continue" and "Register".
- Edit the service ID that you just created. Check `Sign In with Apple` and click on the "Configure" button besides the checked option.
  - You will see a screen for "Web Auhentication Configuration". Select the App ID we created previously as the "Primary App ID". You can add the domains e.g, `ir-engine-qat-dev-api.theinfinitereality.io` and the Return URLs e.g, `https://ir-engine-qat-dev-api.theinfinitereality.io/oauth/apple/callback` on which the user will be redirected once it is authentication by Apple. 
- Click "Continue", verify the details and click "Save".

 **NOTE**
 The Service ID that you just created will serve as your Client ID while sending authentication requests from your app.

# Create the Secret Key
We will also need to create a secret key that we can then use to generate the "Client Secret" which again will be used while sending an authentication request to Apple.

- Go to "Certificates, Identifiers & Profiles > Keys".
- Click the '+' button beside the 'keys'.
- Give a Key Name and check the "Sign In With Apple" checkbox.
- Click Configure next to the "Sign In With Apple" checkbox and select the App ID we previously created under the "Choose a Primary App ID" key. 
- Click save, verify the details and click Register.
- Download the Key and Keep it in a safe and secure place. `Please note that this can only be downloaded once, so save it to a safe and secure location`.
- Click Done.

**NOTE**
You can keep one App ID and a Secret Key and multiple Service IDs for each environment. But a better practice would be to decouple the App IDs, Service ID and Secret Key for each environments.