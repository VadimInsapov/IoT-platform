const matcherDB = require("../matcherDB");
const logger = require("../../logger");
const IoTAgentDevice = require("../../../models/IoTAgentDevice.js");
const mongoose = require("mongoose");
const deviceScheme = require("../../../models/Device");
const parseMessage = (message) => JSON.parse(message);
exports.matchFromDevicesAndSendDataToDB = (topic, message) => {
    const deviceId = topic.split('/')[1];
    const mqttClientAttributes = parseMessage(message);
    logger.got("mqtt-client", deviceId, mqttClientAttributes);
    const iotAgentDeviceValue = IoTAgentDevice.find(deviceId);
    const brokerId = matcherDB.getBrokerId(iotAgentDeviceValue);
    const newAttributes = matcherDB.getBrokerAttributes(iotAgentDeviceValue, mqttClientAttributes);
    const entityType = brokerId.split(':')[1];
    const Device = mongoose.model(entityType, deviceScheme);
    Device.findByIdAndUpdate(brokerId, newAttributes, logger.showError);
    logger.send(brokerId, newAttributes);
}

