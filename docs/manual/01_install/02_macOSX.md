---
sidebar_label: Mac OS X
---
# Installing on Mac OS X

1. Go to the root folder where Ethereal Engine is stored and run
```bash
npm install
npm run dev-docker
npm run dev-reinit
```
Or if you are on a M1 based Mac:
```bash
# Recommended
1. Duplicate the Terminal app, and configure it to run in Rosetta
2. Run the above commands in Rosetta Terminal

# Not recommended
yarn install
```
> _`node-darwin` sometimes doesn't get installed properly On Apple chips. Using yarn fixes this issue._

2. Start docker in the background and then run:
```bash
npm run dev
```
This will open the MariaDB and SQL scripts on the docker and will start the servers

3. To make sure your environment is set and running properly go to:  
   https://localhost:3000/location/default  
   You should be able to walk around an empty 3D scene.

> _Note: Make sure you are on Node.js >= 18 and have docker running._

## Troubleshooting Mac
- If you find issues on your terminal saying  
  `access-denied for user server@localhost`  
  then you can use this command:  
```bash
brew services stop mysql
```

- If you find issues on your terminal saying  
  `An unexpected error occurred: "expected workspace package`  
  while using yarn then you can use this command  
```bash
yarn policies set-version 1.18.0
```
> _Note: This happens because yarn > 1.18 sometimes doesn't work properly with `lerna`_
