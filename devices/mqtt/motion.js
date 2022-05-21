const mqtt = require('mqtt');
const random = require('random');
const infoDevice = require('../infoDevice');
const readline = require("readline");
const shortDeviceInfo = {
    name: "Датчик движения MQTT",
    transport: "MQTT",
    type: "Sensor",
    macAddress: "mac:mqtt:motion001",
    functionForDataGenerate: {
        type: 'readline',
        attributes: {
            с: "0-1"
        },
    }
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
console.log(fullDeviceInfo);
const {topic, brokerSettings} = fullDeviceInfo;
const client = mqtt.connect(brokerSettings);
client.on('connect', () => {
    console.log("The Device connected successfully!");
    loop();
})
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function loop() {
    input.question("Enter command: ", (answer) => {
        answer = answer.toLowerCase();
        console.log(answer);
        if (answer === "comein") {
            client.publish(topic, JSON.stringify({c: 1}))
            console.log('\x1b[32m%s\x1b[0m', "The motion sensor detected someone!");
        }
        if (answer === "comeout") {
            client.publish(topic, JSON.stringify({c: 0}))
            console.log('\x1b[32m%s\x1b[0m', "No motion sensor detected!");
            ;
        }
        loop();
    });
};