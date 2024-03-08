# Locations
Explain what they are.  
Explain why they are required.

## Create a Location
There are two ways to create a location for our scene:
- The `Admin Panel`
- The `Publish` button inside the Studio Editor
Lets explore both of them.

### Publish Button
The easiest way to create a location for the current scene is with the `Publish` button in the Studio.
Follow these steps to create a new Location:
- Open your scene in the Studio. Navigate to https://localhost:3000/studio and click on your scene
- Click on the `Publish` button located at the top-right section of the screen
- Set the Location name to `hello`  
- Click on `Submit`
- Run the Location by visiting it with the URL you just created: https://localhost:3000/location/hello
:::note
This method is just a quick-link to the `Create Location` menu of the Admin Panel.  
The form opened with the `Publish` button is the same that can be accessed through the [Admin Panel: Locations](https://localhost:3000/admin/locations) section explained below.
:::

### Admin Panel
While the Publish button provides a really simple and easy way to create a Location for your Scene, it also lacks functionality beyond just creating a new one.

On the other hand, the [Admin Panel: Locations](https://localhost:3000/admin/locations) section provides utilities to manage your existing locations or edit any of their properties.

#### Creating a Location
Lets create another Location from Admin Panel. Once Ethereal Engine is running:  
- Navigate to the Admin Panel at https://localhost:3000/admin/locations  
- Click on `Create Location`
- Set the Location name to `hello2`  
- Select the desired scene that will be assigned to this location.
- Click on `Submit`
- Run the Location by visiting it with the URL you just created: https://localhost:3000/location/hello2

#### Editing a Location
Lets now edit our new Location to point to a different scene and have a different name.
- Navigate to the Admin Panel at https://localhost:3000/admin/locations
- Find the `hello2` location we just created
- Click on `View`
- Click on `Edit`, so we can change its properties
- Change the Location name to `new-hello`
- Change the `Scene` to a different one
- Click on `Submit`
- Run the Location by visiting it with the URL you just created: https://localhost:3000/location/new-hello

