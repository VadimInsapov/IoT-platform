const mqtt = require('mqtt');
const readline = require("readline");
const infoDevice = require("../infoDevice");
const door = require("../gateFunctions").makeDoor();
const validateCommandAndSendNewState = require('../gateFunctions').validateCommandAndSendNewState;
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function loop () {
    input.question("Enter command: ", (command) => {
        validateCommandAndSendNewState(door, command, "mqtt", mqttClient, topicAttributes);
        loop();
    });
}
const shortDeviceInfo = {
    name: "Дверь MQTT",
    transport: "MQTT",
    type: "Gate",
    macAddress: "mac:mqtt:door001",
    functionForDataGenerate: {
        type: 'readline',
        attributes: {
            st: "open || close || lock || unlock"
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
    validateCommandAndSendNewState(door, command, "mqtt", mqttClient, topicAttributes);
});
