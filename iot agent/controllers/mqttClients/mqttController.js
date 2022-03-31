const Device = require("../../models/device.js");
const util = require('util');

exports.matchFromDevicesAndSendDataToDB = (topic, message) => {
    const deviceId = topic.split('/')[1];
    const mqttAttributes = parseMessage(message);


    //добавить проверку нашли, не нашли

    const device = Device.find(deviceId);
    // console.log(device);
    const brokerId = device.entityName;
    const brokerNewAttributes = getObjectWithNewAttributes(mqttAttributes, device.attributes);
    //к преобразованию типа подготовить
    console.log(`меняем ${brokerId}, его новые атрибуты: ${util.inspect(brokerNewAttributes, false, null, true)}!`)
    // sendNewMeasure(a);
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
const parseMessage = (message) => JSON.parse(message);