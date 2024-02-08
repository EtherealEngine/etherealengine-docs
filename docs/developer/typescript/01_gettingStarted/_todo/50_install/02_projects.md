---
sidebar_label: Projects
---
# Installing and running projects
thereal Engine can be extended with projects.
They are equivalent to "projects" in other engines, except they are modular like npm packages (they are npm packages too).

Ethereal Engine scans for projects mounted in the /packages/projects/projects sub-folder of Ethereal Engine.

From a bash shell in the Ethereal Engine folder we can install, run and visit a project like so:

```bash
gh repo clone EtherealEngine/ee-tutorial-basic
mv ee-tutorial-basic packages/projects/packages/ee-tutorial-basic
npm install
npm run dev
```

Once Ethereal Engine is running, from the web admin panel of Ethereal Engine create a 'location' for the project.   
See https://localhost:3000/admin.  
Map the project to the name 'basic'.  
Then run the project on the web by visiting it with the URL you created.  
See https://localhost:3000/location/pong

