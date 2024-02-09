---
sidebar_label: Locations
---
# Our first Location


## Installing and running projects
Ethereal Engine can be extended with projects.
They are equivalent to "projects" in other engines, except they are modular like npm packages (they are npm packages too).

Ethereal Engine scans for projects mounted in the `/packages/projects/projects` sub-folder of Ethereal Engine.

From a bash shell in the Ethereal Engine folder we can install, run and visit a project with:
```bash
git clone https://github.com/EtherealEngine/ee-tutorial-basic packages/projects/packages/ee-tutorial-basic
npm install
npm run dev
```

## Creating a Location
Once Ethereal Engine is running, from the web admin panel of Ethereal Engine create a 'location' for the scene.   
- Navigate to https://localhost:3000/admin/locations.  
- Map the scene to the name 'basic'.  
- Run the project on the web by visiting it with the URL you just created: https://localhost:3000/location/basic
