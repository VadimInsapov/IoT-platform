const matcherDB = require("../matcherDB");
const logger = require("../../logger");
const IoTAgentDevice = require("../../../models/IoTAgentDevice.js");
const mongoose = require("mongoose");
const objectScheme = require("../../../models/ObjectScheme");
const sendIdAndAttributesToBroker = require("../sendIdAndAttributesToBroker");
const parseMessage = (message) => JSON.parse(message);
exports.matchFromDevicesAndSendDataToDB = (topic, message) => {
    const deviceId = topic.split('/')[1];
    const mqttClientAttributes = parseMessage(message);
    logger.got("mqtt-client", deviceId, mqttClientAttributes);
    const iotAgentDeviceValue = IoTAgentDevice.find(deviceId);
    const brokerId = matcherDB.getBrokerId(iotAgentDeviceValue);
    const newAttributes = matcherDB.getBrokerAttributes(iotAgentDeviceValue, mqttClientAttributes);
    const entityType = brokerId.split(':')[1];
    const Device = mongoose.model(entityType, objectScheme);
    Device.findByIdAndUpdate(brokerId, newAttributes, logger.showError);
    sendIdAndAttributesToBroker(brokerId, newAttributes);
    logger.send(brokerId, newAttributes);
}


