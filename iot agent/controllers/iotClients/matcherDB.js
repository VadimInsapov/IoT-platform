const Device = require("../../models/device");
const util = require("util");
exports.matchDevicesAndGetObjectForDB = (deviceId, clientAttributes) => {
    //добавить проверку нашли, не нашли
    const device = Device.find(deviceId);
    // console.log(device);
    const brokerId = device.entityName;
    const brokerNewAttributes = getObjectWithNewAttributes(clientAttributes, device.attributes);
    //к преобразованию типа подготовить
    return {
        id: brokerId,
        attributes: brokerNewAttributes,
    };
}
const getObjectWithNewAttributes = (mqttAttributes, deviceAttributes) => {
    let brokerNewAttributes = {};
    for (const mqttAttr in mqttAttributes) {
        let newAttr = deviceAttributes[mqttAttr].name;
        let type = deviceAttributes[mqttAttr].type;
        //преобразовать к типам
        let newValue = mqttAttributes[mqttAttr];
        brokerNewAttributes[newAttr] = newValue;
    }
    return brokerNewAttributes;
}