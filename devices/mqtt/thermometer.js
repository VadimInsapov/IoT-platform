const mqtt = require('mqtt');
const thermometerFunctions = require('../thermometerFunctions');
const infoDevice = require('../infoDevice');
const dgram = require('dgram');
const {default: axios} = require("axios");
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
const socketDevice = dgram.createSocket("udp4");
socketDevice.on('message', (message, serverInfo) => {
    message = JSON.parse(message);
    if (fullDeviceInfo.macAddress !== message.deviceId) {
        return;
    }
    console.log(message);
    socketDevice.send("Ok", serverInfo.port, serverInfo.address, (err) => {
        socketDevice.close();
    });
    const client = mqtt.connect(message.brokerAddress);
    client.on('connect', () => {
        console.log("The Device connected successfully!")
    })
    setInterval(() => {
        client.publish(message.topicAttributes, JSON.stringify(thermometerFunctions.getMessage()))
        console.log(`${message.topicAttributes} -m ${JSON.stringify(thermometerFunctions.getMessage())}`);
    }, ms)
});
socketDevice.on('listening', () => {
    socketDevice.setBroadcast(true);
    console.log(`server listening ${socketDevice.address().address}:${socketDevice.address().port}`);
});
socketDevice.bind({
    port: 8000,
});

const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
console.log(fullDeviceInfo);
