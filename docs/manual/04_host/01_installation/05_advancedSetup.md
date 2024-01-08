import AcceptCertificates from '../_partials/acceptCertificates.md'

# Advanced Setup

The advanced setup is recommended for users who want to understand the internals of how the Ethereal Engine's deployment stack works.
These instructions will explain how to manually setup Ethereal Engine docker instances, client, server and/or instance-server.  

## 1. Install dependencies
```bash
cd path/to/etherealengine
npm install
npm run dev-docker
npm run dev-reinit
```
_Note how you don't need to use sudo for any of these commands._

> If you find errors with mediasoup:
> - Follow the [Mediasoup Installation](https://mediasoup.org/documentation/v3/mediasoup/installation/) instructions
> - Check that your version of python is up to date: `python --version`
> - Make sure that the path where you installed Ethereal Engine has no whitespaces

## 2. Start the MySQL database
Make sure you have a MySQL database installed and running. Our recommendation is `MariaDB`.

We provide a docker container for easily setting up the database. This command will create a Docker container of MariaDB named `etherealengine_db`:
```bash
cd scripts && sudo bash start-db.sh
```
> Note: You must have docker installed on your machine for this script to work.  
If you do not have Docker installed, and do not wish to install it, you will have to manually create a MariaDB server.


The default database information is:
| | |
|-|-|
| Username | `server` |
| Password | `password` |
| Database | `etherealengine` |
| Hostname | `127.0.0.1` |
| Port     | `3306` |
> Note: If you have errors connecting to the local database, you might need to shut off your local firewall.


## 3. Start Agones
Open a new terminal and start the Agones sidecar in local mode
```bash
cd scripts && sudo bash start-agones.sh
```
Alternatively, you can also go to `etherealengine/vendor/agones/` and run:
- Linux: `./sdk-server.linux.amd64 --local`
- Windows: `sdk-server.windows.amd64.exe --local`
- Mac: `./sdk-server.darwin.amd64 --local`

## 4. Start the server in database seed mode
Several tables in the database need to be seeded with default values.  
To do so, run:
- Unix: `npm run dev-reinit`
- Windows: `npm run dev-reinit-windows`

There should be no more logging after several seconds.  
If the database has been correctly seeded, some of the final lines should read like this:
```bash
Server Ready
Executing (default): SET FOREIGN_KEY_CHECKS = 1
Server EXIT
```

## 5. Local file server configuration (Optional)
If the `.env.local` file you have has this line, the Scene Editor will save components, models, scenes, etc. locally, instead of storing them on the `S3` cloud server:  
```bash
STORAGE_PROVIDER=local
```
You will need to start a local server to serve these files and make sure that your `.env.local` file has this line:
```bash
LOCAL_STORAGE_PROVIDER="localhost:8642"
```
In a new terminal, go to `packages/server` and run
```bash
npm run serve-local-files
```
This will start up the `http-server` that will serve local files from `packages/server/upload` on `localhost:8642`.  
> Note: You may have to accept the invalid self-signed certificate in the browser the first time it is loaded. See the `Allow local file http-server connection with invalid certificate` section below.

## 6. Start the API server, instance-server and client
Open two/three separate terminals and run:
- Run `npm run dev` inside `packages/server`.  
  This will launch the API, world, media and file servers.  
  _Note: If you are not using instanceservers, you can instead run `npm run dev-api-server` inside the API server folder._
- Run `npm run dev` inside `packages/client`  
  _Note: If you are on windows you need to use `npm run dev-windows` instead of `npm run dev`._

## 7. Open the Engine
If everything went well, you can now open the engine by navigating to [this link](https://localhost:3000/location/default) in your browser.  

The database seeding process creates a default empty location called `default`, which can be accessed by opening `https://localhost:3000/location/default`.

## 8. Accept the Certificates
<AcceptCertificates />

