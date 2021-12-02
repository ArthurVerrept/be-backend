## Description

A project that uses arduino inputs to send info via websockets to an interactive front end. Arduino code written in javascript using [firmata](https://www.arduino.cc/en/reference/firmata) and [johnny-five](http://johnny-five.io/).

<br>


# Setup


Before we start you need to download:
1. [python](https://www.python.org/downloads/macos/)
2. [node-gyp](https://www.npmjs.com/package/node-gyp)

Connect the arduino and all the sensors as listed in diagram making sure sensors start at A0 and go up from there.

### Setup firmata and Connect to Arduino
1. Open the arduino IDE
2. Under tools make sure you have the correct board and port selected
3. Select File > Examples > Firmata > StandardFirmataPlus
4. Click upload to board

### Open VSCode and run script
1. Open VScode project and run
```bash
$ npm i
```

2. Run script using
```bash
$ node index.js
```

If all has worked a local server will be running on localhost:4000 you can access using a websocket client.

