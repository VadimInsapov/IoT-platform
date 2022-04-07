const IoTAgentDevice = require("../../../models/IoTAgentDevice.js");
const matcherDB = require("../matcherDB");
const loggerClients = require("../loggerClients");

exports.matchFromDevicesAndSendDataToDB = (request, response) => {
    const deviceId = request.query.deviceId;
    const httpClientAttributes = request.body;
    loggerClients.got("http-client", deviceId, httpClientAttributes);

    const iotAgentDeviceValue = IoTAgentDevice.find(deviceId);
    if (!iotAgentDeviceValue) response.status(400).json("The Device wasn't found in IoT Platform!");

    const objectForDB = matcherDB.matchDevicesAndGetObjectForDB(iotAgentDeviceValue, httpClientAttributes);
    const id = objectForDB.id;
    const attributes = objectForDB.attributes;
    loggerClients.send(id, attributes);
}
