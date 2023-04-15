# Installing on Windows 10+
1. Install python 3 and add python installation directory path to 'PATH' env variable.
2. Install node js
3. Install Visual studio community edition with build tools.
> Note: If mediasoup is not installed properly then modify Visual studio setup to add c++ and Node.js support.
4. Add path of MSbuild.exe (which is present in visual studio folder) into 'path' env variable (for example:` C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin`)
5. Make sure to install all windows prerequisites for mediasoup as mentioned on: <https://mediasoup.org/documentation/v3/mediasoup/installation/#windows>
6. Install all dependencies using `npm i`.
7. If error persists then check for typos in environment variables.
8. If you are on Windows, you can use docker-compose to start the `scripts/docker-compose.yml` file, or install mariadb and copy credentials (database name, username, password) from docker-compose or `.env.local` -- you will need to create an empty database with the matching name.

`./start-db.sh` only needs to be run once. If the docker image has stopped, start it again with:

```
docker container start etherealengine_db
```

8. Check your WSL config for any incorrect networking settings.
   https://docs.microsoft.com/en-us/windows/wsl/wsl-config#network
