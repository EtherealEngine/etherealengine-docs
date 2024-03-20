---
sidebar_label: Windows 10+
---

# Installing on Windows 10+
1. Install Python 3 and add python installation directory path to `PATH` env variable.
2. Install Node.js 18
3. Install Visual Studio Community Edition with build tools.
   > Note: If mediasoup is not installed properly then modify Visual studio setup to add c++ and Node.js support.
4. Add the path to `MSbuild.exe` _(which stored in Visual Studio's folder)_ into the `PATH` env variable  
  _eg: `C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin`_
5. Make sure to install all windows prerequisites for Mediasoup as mentioned on: [https://mediasoup.org/documentation/v3/mediasoup/installation/#windows](https://mediasoup.org/documentation/v3/mediasoup/installation/#windows)
6. Install all dependencies using `npm install` from the root folder where you cloned Ethereal Engine.

> Troubleshooting:  

> 7. If the error persists: Check for typos in your environment variables.  

> 8. _(Optional):_ you can use `docker-compose` to start the `scripts/docker-compose.yml` file, or install MariaDB and copy the credentials _(database name, username, password)_ from docker-compose or `.env.local`. You will need to create an empty database with the matching name.
> Note: `./start-db.sh` only needs to be run once. If the docker image has stopped, start it again with:  
  `docker container start etherealengine_db`

> 9. Check your WSL config for any incorrect networking settings.  
>    https://docs.microsoft.com/en-us/windows/wsl/wsl-config#network
