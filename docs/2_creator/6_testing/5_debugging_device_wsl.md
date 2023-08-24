--- 
hide_table_of_contents: true
---

# Debugging Engine in WSL on Phone/Headset

This section covers testing/debugging on phone/headset when engine stack hosted in WSL2 Ubuntu on Windows 11.

1. Ensure that your `.env.local` and database entries points to `localhost`.

2. Open a location i.e. `https://localhost:3000/location/apartment` through Windows 11 chrome. It should work fine.

3. Connect your device (currently tested on Samsung S22 Ultra) with PC and enabled USB debugging and access prompts as mentioned on <https://developer.chrome.com/docs/devtools/remote-debugging/>

4. Once your device is connected, then you can see your device's browser tabs in PC's Chrome as show in below image. `chrome://inspect/#devices`
![Device connected to PC Chrome](./images/debugging_device_wsl_1.png)

5. Make sure the check boxes marked in below are checked.
![Remote Devtool Options](./images/debugging_device_wsl_2.png)

6. Click on "Port forwarding" button and ensure you have entries as shown in below image. Also make sure to check the port forwarding checkbox in that modal.
![Port Forwarding Options](./images/debugging_device_wsl_3.png)

7. Once this is done and you have Port forwardings having green circles before them which means forwarding is working as shown in below image.
![Port Forwarding Enabled](./images/debugging_device_wsl_4.png)

8. Navigate to `https://localhost:3000/location/apartment` in your device's browser.

9. On your PC you can inspect this and allow if you face any certificate errors as shown in below image.
![Remote Debugging](./images/debugging_device_wsl_5.png)
