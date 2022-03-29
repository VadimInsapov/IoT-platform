const express = require("express");
const app = express();
const jsonParser = express.json();
const axios = require('axios').default;
const mqtt = require('mqtt');
const showDataFromMqttClient = require('./mqtt-client/showHandler');
const client = mqtt.connect('mqtt://localhost:1234');

let topic = '#';
let mapOfDevices = new Map();

let infoToUserApplication = (topic, message) => {
    message = message.toString();
    let a = mapOfDevices.get(topic);
    sendNewMesure(a);
}
app.post("/mqtt-devices",jsonParser, function (request, response) {
    console.log(request.body);
});
app.post("/device",jsonParser, function (request, response) {
    console.log("Подпишемся на " + request.body.device_id);
    topic = request.body.device_id;
    client.subscribe(topic);
    mapOfDevices.set(request.body.device_id, request.body);
});
client.on('message', infoToUserApplication);
app.listen(4041);



const sendNewMesure = async (a) => {
    try {
        const resp = await axios.post('http://localhost:80/changes', a);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};