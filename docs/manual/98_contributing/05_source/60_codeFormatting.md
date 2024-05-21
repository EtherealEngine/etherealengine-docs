# Code Formatter

We use prettier to format our code.

## Format on Save

### Setting Up Prettier in VS Code

1. **Install Prettier Extension (if not already installed):**
   - Press `Ctrl` + `P` to open the command palette.
   - Type `ext install esbenp.prettier-vscode` and press `Enter`.
   - Follow the prompts to install the Prettier extension.

2. **Open Settings:**
   - Press `Ctrl` + `,` together to open the VS Code settings.

3. **Enable Format on Save:**
   - In the search bar at the top, type `Format on Save`.
   - You will see three tabs: User, Remote, and Workspace.
   - Check the box next to `Editor: Format on Save` under both User and Remote tabs. **Do not check the box under the Workspace tab.**

4. **Set Prettier as Default Formatter:**
   - Open any file in your workspace.
   - Right-click within the file editor.
   - Select `Format Document With...`.
   - Choose `Configure Default Formatter...`.
   - Select `Prettier - Code Formatter` from the list.



### Verifying Your Setup

1. **Test Format on Save:**
   - Open a file with some unformatted code.
   - Make a small edit and save the file (`Ctrl` + `S`).
   - Verify that the code is automatically formatted upon saving.

By following these steps, you ensure that Prettier is set up as the default code formatter and that formatting occurs automatically on save, reducing formatting issues across the team.
