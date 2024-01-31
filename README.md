# Simple Metaverse Prototype

A Metaverse prototype is developed using Express.js and Socket.IO, facilitating server hosting and client connections. The frontend utilizes Three.js to render a dynamic map scene within the client's browser. During the initial run, all map data is generated dynamically.

---
## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node
- #### Node installation on Windows

Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v18.17.1

    $ npm --version
    9.6.7

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


## Install

    $ git clone https://github.com/tomstrasevskis/metaverse-prototips
    $ cd metaverse-prototips
    $ npm install

## Configure app

To customize the application, open `src/config.js` and modify the following parameters to suit your preferences.

### Basic Server Settings:
- `port`  
  - Default: `3000`
- `mapPath`  
  - Default: `./src/mapData.json`
- `mapAlgorithm`  
  - Default: `./src/mapAlgorithm.js`

### Map Scene Settings:
- `mapSize`  
  - Default: `4`
- `landSize`  
  - Default: `10`

### Scene Color Settings:
- `backgroundColor`  
  - Default: `0xffeeee`
- `landColor`  
  - Default: `0x00ff00`
- `ownedLandColor`  
  - Default: `0xff0000`

This configuration allows you to fine-tune the basic server parameters, map scene characteristics, and color settings for a personalized experience.

## Running the project

    $ npm run server
