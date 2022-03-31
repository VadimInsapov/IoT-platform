const matcherDB = require("../matcherDB");
const loggerClients = require("../loggerClients");
const parseMessage = (message) => JSON.parse(message);
exports.matchFromDevicesAndSendDataToDB = (topic, message) => {
    const deviceId = topic.split('/')[1];
    const mqttClientAttributes = parseMessage(message);
    loggerClients.got("mqtt-client", deviceId, mqttClientAttributes);
    const objectForDB = matcherDB.matchDevicesAndGetObjectForDB(deviceId, mqttClientAttributes);
    const id = objectForDB.id;
    const attributes = objectForDB.attributes;
    loggerClients.send( id, attributes);
}


