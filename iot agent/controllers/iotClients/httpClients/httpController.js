const IoTAgentDevice = require("../../../models/IoTAgentDevice.js");
const matcherDB = require("../matcherDB");
const logger = require("../../logger");
const mongoose = require("mongoose");
const deviceScheme = require("../../../models/Device");

exports.matchFromDevicesAndSendDataToDB = (request, response) => {
    const deviceId = request.query.deviceId;
    const httpClientAttributes = request.body;
    logger.got("http-client", deviceId, httpClientAttributes);
    const iotAgentDeviceValue = IoTAgentDevice.find(deviceId);
    if (!iotAgentDeviceValue) {
        logger.httpClientIsEmpty();
        response.status(400).json("The Device wasn't found in IoT Platform!");
        return;
    }
    const brokerId = matcherDB.getBrokerId(iotAgentDeviceValue);
    const newAttributes = matcherDB.getBrokerAttributes(iotAgentDeviceValue, httpClientAttributes);
    const entityType = brokerId.split(':')[1];
    const Device = mongoose.model(entityType, deviceScheme);
    Device.findByIdAndUpdate(brokerId, newAttributes, logger.showError);
    logger.send(brokerId, newAttributes);
}
