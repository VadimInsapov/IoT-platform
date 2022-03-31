const express = require("express");
const appSouth = express();
const appNorth = express();
const jsonParser = express.json();
const mqtt = require('mqtt');
const mqttClient = mqtt.connect('mqtt://localhost:1234');
const deviceController = require('./controllers/userApplication/deviceController');
const httpController = require('./controllers/iotClients/httpClients/httpController');
const mqttController = require('./controllers/iotClients/mqttClients/mqttController');


appSouth.post("/devices", jsonParser, deviceController.addDevice(mqttClient));
appNorth.post("/iot", jsonParser, httpController.matchFromDevicesAndSendDataToDB);
appSouth.listen(4041);
appNorth.listen(7896);
mqttClient.on('message', mqttController.matchFromDevicesAndSendDataToDB);