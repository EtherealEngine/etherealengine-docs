# Code Formatting

Prettier helps us maintain consistent code formatting across our projects.

## Setting up Prettier in VS Code

### Step 1. Install the Prettier Extension
   1. Press `Ctrl` + `P` to open the command palette.
   2. Type `ext install esbenp.prettier-vscode` and press `Enter`.
   3. Follow the prompts to install the Prettier extension.

### Step 2. Open VS Code Settings
Press `Ctrl` + `,` together to open the VS Code settings.

### Step 3. Enable Format on Save
   1. In the search bar at the top, type `Format on Save`.
   2. You will see three tabs: **User**, **Remote**, and **Workspace**.
   3. Check the box next to **Editor: Format on Save** under the User and Remote tabs. 
   
   :::note
   Do not check the box under the **Workspace** tab.
   :::

### Step 4. Set Prettier as the Default Formatter
   1. Open any file in your workspace.
   2. Right-click within the file editor.
   3. Select **Format Document With...**.
   4. Choose **Configure Default Formatter...**.
   5. Select **Prettier - Code Formatter** from the list.



## Verifying Your Setup

To ensure code is automatically formatted upon saving:
1. Open a file with some unformatted code.
2. Make a small edit and save the file (`Ctrl` + `S`).
3. Check if the code is automatically formatted upon saving.

By following these steps, you ensure that Prettier is set up as the default code formatter and that formatting occurs automatically on save, reducing formatting issues across the team.
