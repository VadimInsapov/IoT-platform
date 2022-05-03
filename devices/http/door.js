const readline = require("readline");
const express = require("express");
const app = express();
const infoDevice = require("../infoDevice");
const {default: axios} = require("axios");
const door = require("../gateFunctions").makeDoor();
const validateCommandAndSendNewState = require('../gateFunctions').validateCommandAndSendNewState;
const logger = require('../logger');
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function changeStateHandleWrapper(door, command, protocol, iotAgentEndpoint) {
    const result = validateCommandAndSendNewState(door, command, protocol, iotAgentEndpoint);
    if (!result) {
        loop();
        return;
    }
    result.then(response => logger.printSuccessfulResponseFromIotAgent(response))
        .catch(err => logger.printErrorFromIotAgent(err))
        .finally(() => loop());
}

const shortDeviceInfo = {
    name: "Дверь HTTP",
    transport: "HTTP",
    type: "Gate",
    macAddress: "mac:http:door001",
    functionForDataGenerate: {
        type: 'readline',
        attributes: {
            st: "open || close || lock || unlock"
        },
    }
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
const {deviceRoute, actuatorSettings, iotAgentEndpoint} = fullDeviceInfo;


app.post(deviceRoute, express.json(), function (request, response) {
    let {command} = request.body;
    changeStateHandleWrapper(door, command, "http", iotAgentEndpoint);
});
app.listen(actuatorSettings.port);

function loop() {
    input.question("Enter command: ", (command) => {
        changeStateHandleWrapper(door, command, "http", iotAgentEndpoint);
    });
}

console.log(fullDeviceInfo);
loop();
