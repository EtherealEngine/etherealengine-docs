# Installation

import CloneInstructions from './_cloneInstructions.md'
import AcceptCertificates from './_acceptCertificates.md'

Getting up and running requires just a few steps, but this can be tricky, depending on your platform and current environment.
Please follow the directions for your specific environment.

## Pre-Install Checklist
1. Ensure you have at least 16GB of RAM  
  _You may run int issues running the full development setup with less_
2. Clone the repository to a location whose path **contains no spaces**.
3. Install Node.js 18  
  _(versions earlier than 16 are not guaranteed to work)_
4. Install Python >=3.6, [PIP](https://pypi.org/project/pip/), C++, and other build tools  
  _See the [Mediasoup install instructions](https://mediasoup.org/documentation/v3/mediasoup/installation/) for full details._
5. Install Docker  
  _Optionally: If you're NOT using docker, install MariaDB, Redis and MinIO manually and update repo's `.env.local` accordingly._

You should now be ready to follow the [Quick Start](#quick-start) instructions.

### Clone the repository
A lot has changed during development, and our monorepo has gotten quite large.  
To avoid cloning everything, use this command:

<CloneInstructions />

### Ensure you are running Node 18
The engine to date has only been confirmed to work with Node 16.x and 18.x.  
Earlier or later major versions are not guaranteed to work properly.

The best way to install and manage Node.js versions is by using a version manager:
1. Install [NVM](https://github.com/nvm-sh/nvm)
2. Install Node18 with `nvm install 18`
3. _(Optional)_ Make Node18 your default node version with `nvm alias default 18`

_Note: Polyglot [ASDF](https://github.com/asdf-vm/asdf) can also be used for managing node versions._

Before running the engine, please check `node --version`  
If you are using a node version below 16, please update or nothing will work.   
You will know you are having issues if you try to install packages at root with `npm install` and you get package dependency errors.

### Docker is your friend
You don't need to use [Docker](https://docs.docker.com/), but it will make your life much easier.  
If you don't wish to use Docker, you will need to setup mariadb and redis on your machine. You can find credentials in `/scripts/docker-compose.yml`

## Quick Start
If you are lucky, this will just work. However, you may encounter some issues.  
Make sure you are running Node 16, and check your dependencies.
```
cd path/to/etherealengine
cp .env.local.default .env.local
npm install
npm run dev-docker
npm run dev-reinit
npm run dev
```
Now run Ethereal Engine in your browser by navigating to [this link](https://localhost:3000/location/default).  

### Accept Certificates
<AcceptCertificates />

### Admin System and User Setup
You can administrate many features from the admin panel at the `/admin` route of your deployment.  
_eg: `https://localhost:3000/admin` when working in a local deployment._

To give administration rights to a user:
- Open any page in your Ethereal Engine deployment
- Open the user menu _(icon at the top-right of the screen)_
- Click on `Show API key`
- Copy that key to your clipboard _(note: there is an icon to the right of this box for this purpose)_
- Open a terminal and go to the folder where EtherealEngine was cloned.
- Run the command `npm run make-user-admin -- --id={COPIED_USER_ID}` where `COPIED_USER_ID` is the key you just copied on the previous step.  
  Example: `npm run make-user-admin -- --id=c06b0210-453e-11ec-afc3-c57a57eeb1ac`

![image](./images/userid.png)

> Alternate Method:  
> Open the `User` table of your deployment's database and change `userRole` to `admin`  
_(It helps to use a graphical database explorer, we recommend [beekeeperstudio.io](https://beekeeperstudio.io/))_

Test user Admin privileges by going to the `/admin` route of your deployment.


## Advanced Installation and Troubleshooting
If you run into any trouble with the Quick Start instructions:
- Please make sure you've followed the 
  [Mediasoup installation instructions](https://mediasoup.org/documentation/v3/mediasoup/installation/)
- Check your OS-specific instructions:
  - [Installing on Windows (10+)](./02_windows.md)
  - [Installing on Mac OS X](./01_macOSX.md)
- [Installation Troubleshooting](./06_troubleshooting.md)
- [Advanced Setup](./04_advancedSetup.md)
- [Vite dev server is stalling](https://vitejs.dev/guide/troubleshooting.html#dev-server)

