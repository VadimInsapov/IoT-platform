const express = require("express");
const app = express();
const jsonParser = express.json();
const axios = require('axios').default;
const mqtt = require('mqtt');
const showDataFromMqttClient = require('./js/mqtt-client/showHandler');
const client = mqtt.connect('mqtt://localhost:1234');
const userApplicationController = require('./controllers/userApplicationController');
let mapOfDevices = new Map();


app.post("/devices", jsonParser, userApplicationController.addDevice(client, mapOfDevices));
app.listen(4041);



let infoToUserApplication = (topic, message) => {
    message = message.toString();
    let a = mapOfDevices.get(topic);
    sendNewMeasure(a);
}
client.on('message', showDataFromMqttClient);



const sendNewMeasure = async (a) => {
    try {
        const resp = await axios.post('http://localhost:80/changes', a);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};