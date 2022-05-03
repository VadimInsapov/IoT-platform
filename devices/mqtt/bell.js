const mqtt = require('mqtt');
const infoDevice = require("../infoDevice");
const shortDeviceInfo = {
    name: "Звонок MQTT",
    transport: "MQTT",
    type: "Actuator",
    macAddress: "mac:mqtt:bell001",
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
console.log(fullDeviceInfo);
const {topic, brokerSettings} = fullDeviceInfo;
const client = mqtt.connect(brokerSettings);
client.on('connect', () => {
    console.log("The Device connected successfully!")
    client.subscribe(topic);
})
client.on('message', (topic, message) => {
    const res = JSON.parse(message).command === "ring" ? true : false;
    if (res)   console.log('\x1b[32m%s\x1b[0m', "State has changed! The bell is ringing!");
});
