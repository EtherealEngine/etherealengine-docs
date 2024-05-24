Since there are no valid certificates for this domain, you'll have to tell your browser to ignore the insecure connections when you try to load the application.

Go to \<https://local.etherealengine.org/>, you should see a warning about an invalid certificate; accept this invalid cert to get to the home page. Next if it keeps displaying 'loading routes' progress for a long time, it is due to the fact that you have to allow certificates. You'll have to open the dev tools for your browser and go to the 'Console' tab. You will see some errors in URL address starting with 'wss'. Replace 'wss' with 'https' and open it in new tab. Accept the certificate and reload your iR Engine tab. You need to do this for following domains:

- wss://api-local.etherealengine.org -> https://api-local.etherealengine.org
- wss://instanceserver-local.etherealengine.org -> https://instanceserver-local.etherealengine.org
- https://localhost:9000

> You can open Developer tools in Chrome by clicking the side menu with three dots, then More tools > Developer tools (or use Ctrl+Shift+I)
