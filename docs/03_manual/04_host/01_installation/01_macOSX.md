# Installing on Mac OS X

1. Go to the root folder where Ethereal Engine is stored and run
```bash
npm install
npm run dev-docker
npm run dev-reinit
```
Or if you are on a M1 based Mac
```bash
# Recommended
1. Duplicate the Terminal app, and configure it to run in Rosetta
2. Run the above commands in Rosetta Terminal

# Not recommended
yarn install
```
_This is because on Apple chips node-darwin sometimes doesn't get installed properly and using yarn fixes the issue._

2. Have docker started in the background and then in the terminal type
```bash
npm run dev
```
This will open the mariaDB and SQL scripts on the docker and will start the servers

3. To make sure your environment is set and running properly go to
   https://localhost:3000/location/default and you should be able to walk around an empty 3D scene

_Note: Make sure you are on Node >= 16 and have docker running._

## Troubleshooting Mac
- If you find issues on your terminal saying  
  `access-denied for user server@localhost`  
  then you can use this command:  
```bash
brew services stop mysql
```

- If you find issue on your terminal that saying  
  `An unexpected error occurred: "expected workspace package`  
  while using yarn then you can use this command in your terminal
```bash
yarn policies set-version 1.18.0
```
_Note: This issue happens because yarn > 1.18 sometimes doesn't work properly with lerna_
