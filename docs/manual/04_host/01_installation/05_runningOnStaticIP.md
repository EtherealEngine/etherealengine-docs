# Running on Static IP under WSL2

Follow these steps to run the engine on a static IP instead of localhost. In
most cases you should be able to simply access the engine using the public IP
assigned to your device, but if you run into any issues or if you are running
the stack on WSL2 then you can refer to the following directions.

1. Replace all localhost values with the static IP you want to run the stack on
   in your `.env.local` file.
2. Open a PowerShell terminal as admin. And run the `wsl2-port-forwarding.ps1`
   script present under `/scripts` directory.
  Note: Make sure all of the required ports are present in ports array of the
   `wsl2-port-forwarding.ps1` script.
3. And now just run the engine as you normally would and everything should be
   accessible over the static IP.
4. If you get any errors related to **localhost:8642**, then make sure that none of
   the assets in your scene have been saved localhost path. If there are then
   replace localhost with the static IP in the respective asset's path too.
