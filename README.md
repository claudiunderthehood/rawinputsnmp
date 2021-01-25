# snmprawsendereceiver
A simple application made in Angular and Express js that handles SNMP requests.

# DETAILED DESCRIPTION
This simple application is meant to send some inputs through a web form to a raspberry pi via SNMP and command a relay switch(to be implemented).

To run the API just go into raw-input-angualar/input-api and run "npm start" to run the express api.

The receiver folder contains the Node.js application to run into the raspberry pi for running it go into the folder and type in the console "node index.js".

Running the angular app will require you to run "ng serve --proxy-config proxy.conf.json" in the main angular app folder.
