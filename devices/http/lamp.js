const readline = require("readline");
const express = require("express");
const app = express();
const infoDevice = require("../infoDevice");
const {default: axios} = require("axios");
const lamp = require("../gateFunctions").makeLamp();
const validateCommandAndSendNewState = require('../gateFunctions').validateCommandAndSendNewState;
const logger = require('../logger');
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function changeStateHandleWrapper(lamp, command, protocol, iotAgentEndpoint) {
    const result = validateCommandAndSendNewState(lamp, command, protocol, iotAgentEndpoint);
    if (!result) {
        loop();
        return;
    }
    result.then(response => logger.printSuccessfulResponseFromIotAgent(response))
        .catch(err => logger.printErrorFromIotAgent(err))
        .finally(() => loop());
}

const shortDeviceInfo = {
    name: "Лампа HTTP",
    transport: "HTTP",
    type: "Gate",
    macAddress: "mac:http:lamp001",
    functionForDataGenerate: {
        type: 'readline',
        attributes: {
            st: "on || off"
        },
    }
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
const {deviceRoute, actuatorSettings, iotAgentEndpoint} = fullDeviceInfo;

app.post(deviceRoute, express.json(), function (request, response) {
    let {command} = request.body;
    changeStateHandleWrapper(lamp, command, "http", iotAgentEndpoint);
});
app.listen(actuatorSettings.port);

function loop() {
    input.question("Enter command: ", (command) => {
        changeStateHandleWrapper(lamp, command, "http", iotAgentEndpoint);
    });
}

console.log(fullDeviceInfo);
loop();
