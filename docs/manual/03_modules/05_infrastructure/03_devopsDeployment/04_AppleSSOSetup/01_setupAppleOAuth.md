# How to set up Apple SSO to be able to let users sign in
Just as we have other OAuth providers that allow users to sign in user their accounts created on other well known platforms, we also have enabled Apple SSO support for IR Studio. This guide scripts down the blueprints to be able to enable it for any particular application.

# Pre Requisites
- Apple Developer Account
- An Apple Account add into the developer account with all the right permissions to be able to edit and udpate app details.
- An app where you want to enable Apple SSO, `IR Studio` in our case. 


Go to [Apple Developer Account](https://idmsa.apple.com/IDMSWebAuth/signin?appIdKey=891bd3417a7776362562d2197f89480a8547b108fd934911bcbea0110d07f757&path=%2Faccount%2F&rv=1) and sign in with and apple Developer account which should have been added to the developer account previously and must have the right permissions. There, you will need to create an App ID, a Service ID and later on a Private Key, these will give you the credentials that you can then use in your app to be able to let users log in using their Apple IDs.

# Create an App ID
In the Apple Developer account, do the following. 

1. Go to Section named as `Certificates, Ids & Profiles` and click Identifiers.
2. Create a new identifier, which usually can be created by clicking a small '+' icon besides the identifiers headline. If you do not see that, your logged in user might not have the necessary permissions to add the app ID. Please get your users the right permissions before moving ahead. 
3. Click "App IDs", App and click "Continue".
4. Fill in the form that opens up.
  a. Enter the description.
  b. Enter the Bundle ID which could be a reverse-domain styled string i.e. 'com.domainname.appname'
  c. Scroll down to "Capabilities" section and check `Sign In with Apple` and click continue. 
  d. Verify details and click register.

# Create a Service ID
In the Apple Developer account, do the following. 

1. Go to section named as `Certificates, Ids & Profiles` and click Identifiers.
2. Click the '+' button beside the 'identifiers'.
3. Click "Service IDs" and click "Continue".
  a. Enter the description.
  b. Enter the Bundle ID which could be a reverse-domain styled string i.e. 'com.domainname.appname'
  c. Click "Continue" and "Register".
4. Edit the service ID that you just created. Check `Sign In with Apple` and click on the "Configure" button beside the checked option.
 a. You will see a screen for "Web Auhentication Configuration". Select the App ID we created previously as the "Primary App ID". You can add the domains and the Return URLs on which the user will be redirected once it is authentication by Apple. 
 b. Click "Continue", verify the details and click "Save".

 :::Note: Please note that the Service ID that you just created will serve as your Client ID while sending authentication requests from your app.

# Create the Secret Key
We will also need to create a secret key that we can then use to generate the `Client Secret` which again will be used while sending an authentication request to Apple.

1. Go to "Certificates, Identifiers & Profiles > Keys". 
2. Give a Key Name and check the "Sign In With Apple" checkbox.
3. Click Configure and select the App ID we previously created under the "Choose a Primary App ID" key. 
4. Click save, verify the details and click Register.
5. Download the Key and Keep it in a safe and secure place. `Please note that this can only be downloaded once, so save it to a safe and secure location`.
6. Click Done.

:::Note: You can keep one App ID and a Secret Key and multiple Service IDs for each environment. But a better practice would be to decouple the App IDs, Service ID and Secret Key for different environments
