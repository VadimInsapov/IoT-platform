const mqtt = require('mqtt');
const readline = require("readline");
const lamp = require("../gateFunctions").makeLamp();
const validateCommandAndSendNewState = require('../gateFunctions').validateCommandAndSendNewState;
const infoDevice = require("../infoDevice");
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function loop() {
    input.question("Enter command: ", (command) => {
        validateCommandAndSendNewState(lamp, command, "mqtt", mqttClient, topicAttributes);
        loop();
    });
}

const shortDeviceInfo = {
    name: "Лампа MQTT",
    transport: "MQTT",
    type: "Gate",
    macAddress: "mac:mqtt:lamp001",
    functionForDataGenerate: {
        type: 'readline',
        attributes: {
            st: "on || off"
        },
    }
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
const {topicAttributes, topicCommands, brokerSettings} = fullDeviceInfo;
console.log(fullDeviceInfo);

const mqttClient = mqtt.connect(brokerSettings);
mqttClient.on('connect', () => {
    console.log("The Device connected successfully!");
    mqttClient.subscribe(topicCommands);
    loop();
});
mqttClient.on('message', (topic, message) => {
    let {command} = JSON.parse(message);
    validateCommandAndSendNewState(lamp, command, "mqtt", mqttClient, topicAttributes);
});
