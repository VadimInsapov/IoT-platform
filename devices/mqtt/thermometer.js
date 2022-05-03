const mqtt = require('mqtt');
const thermometerFunctions = require('../thermometerFunctions');
const infoDevice = require('../infoDevice');
const ms = thermometerFunctions.getMs();
const shortDeviceInfo = {
    name: "Термометр MQTT",
    transport: "MQTT",
    type: "Sensor",
    macAddress: "mac:mqtt:thermometer001",
    functionForDataGenerate: {
        type: 'interval',
        ms: ms,
        attributes: {
            t: "15-17",
            h: "40-50",
        },
    }
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
console.log(fullDeviceInfo);
const {topic, brokerSettings} = fullDeviceInfo;
const client = mqtt.connect(brokerSettings);
client.on('connect', () => {
    console.log("The Device connected successfully!")
})
setInterval(() => {
    client.publish(topic, JSON.stringify(thermometerFunctions.getMessage()))
    console.log(`${topic} -m ${JSON.stringify(thermometerFunctions.getMessage())}`);
}, ms)
