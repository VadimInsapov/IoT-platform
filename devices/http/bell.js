const express = require("express");
const infoDevice = require("../infoDevice");
const app = express();
const shortDeviceInfo = {
    name: "Звонок HTTP",
    transport: "HTTP",
    type: "Actuator",
    macAddress: "mac:http:bell001",
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
const {actuatorSettings, deviceRoute} = fullDeviceInfo;
console.log(fullDeviceInfo);
app.post(deviceRoute, express.json(), function(request, response){
    const res = request.body.command === "ring" ? true : false;
    if (res)   console.log('\x1b[32m%s\x1b[0m', "State has changed! The bell is ringing!");
});
app.listen(actuatorSettings.port);
