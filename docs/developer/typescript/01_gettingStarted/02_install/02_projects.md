---
sidebar_label: Sub Projects
---
# Installing and running sub projects
Ethereal Engine can run sub-projects or 'locations'.   
This pattern is different from what you may be used to because Ethereal Engine runs on the 'outside' and the sub-project is kept in a folder of Ethereal Engine.

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

