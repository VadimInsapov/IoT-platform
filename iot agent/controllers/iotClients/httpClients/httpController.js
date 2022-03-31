const Device = require("../../../models/device.js");
const matcherDB = require("../matcherDB");
const loggerClients = require("../loggerClients");

exports.matchFromDevicesAndSendDataToDB = (request, response) => {
    const deviceId = request.query.deviceId;
    const httpClientAttributes = request.body;
    loggerClients.got("http-client", deviceId, httpClientAttributes);
    const objectForDB = matcherDB.matchDevicesAndGetObjectForDB(deviceId, httpClientAttributes);
    const id = objectForDB.id;
    const attributes = objectForDB.attributes;
    loggerClients.send( id, attributes);
}
