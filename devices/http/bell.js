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
    console.log(request.body);
});
app.listen(actuatorSettings.port);
