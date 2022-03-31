const express = require("express");
const app = express();
const jsonParser = express.json();
const axios = require('axios').default;
const mqtt = require('mqtt');
const showDataFromMqttClient = require('./js/mqtt-client/showHandler');
const mqttClient = mqtt.connect('mqtt://localhost:1234');
const deviceController = require('./controllers/userApplication/deviceController');
const mqttController = require('./controllers/mqttClients/mqttController');


app.post("/devices", jsonParser, deviceController.addDevice(mqttClient));
app.listen(4041);
mqttClient.on('message', mqttController.matchFromDevicesAndSendDataToDB);



const sendNewMeasure = async (a) => {
    try {
        const resp = await axios.post('http://localhost:80/changes', a);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};