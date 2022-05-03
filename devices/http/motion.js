const axios = require('axios').default;
const infoDevice = require('../infoDevice');
const readline = require("readline");
const shortDeviceInfo = {
    name: "Датчик движения HTTP",
    transport: "HTTP",
    type: "Sensor",
    macAddress: "mac:http:motion001",
    functionForDataGenerate: {
        type: 'readline',
        attributes: {
            с: "0-1"
        },
    }
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
console.log(fullDeviceInfo);
const {iotAgentEndpoint} = fullDeviceInfo;
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function loop() {
    input.question("Enter command: ", (answer) => {
        answer = answer.toLowerCase();
        console.log(answer);
        if (answer === "comein") {
            const message = {c: 1};
            sendData(message);
            console.log('\x1b[32m%s\x1b[0m', "The motion sensor detected someone!");
        }
        if (answer === "comeout") {
            const message = {c: 0};
            sendData(message);
            console.log('\x1b[32m%s\x1b[0m', "No motion sensor detected!");
        }
        loop();
    });
};
function sendData(message) {
    axios.post(iotAgentEndpoint, message)
        .catch(err => {
            console.log(err.response.status);
            console.log(err.response.data);
        })
}
loop();
