# Running on Static IP under WSL2

When using a Static IP you should be able to, in most cases, simply access the engine using the public IP assigned to your device.  
But if you run into any issues, or if you are running the stack on WSL2, then use the following directions:
1. Replace all `localhost` values in your `.env.local` file with the static IP you want to run the stack on.
2. Open a PowerShell terminal as admin. Run the `wsl2-port-forwarding.ps1` script stored in the `/scripts` directory.
   _Note: Make sure all of the required ports are present in ports array of the `wsl2-port-forwarding.ps1` script._
3. Run the engine as you normally would. Everything should be accessible over the static IP.

> If you get any errors related to **localhost:8642**:  
> Make sure that the assets in your scene have not been saved with a `localhost` path.   
> If there are, replace `localhost` with your static IP in the respective asset's path.
