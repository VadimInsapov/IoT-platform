const IoTAgentDevice = require("../../models/IoTAgentDevice");
const util = require("util");

exports.matchDevicesAndGetObjectForDB = (iotAgentDeviceValue, clientAttributes) => {
    const brokerId = iotAgentDeviceValue.entityName;
    const brokerNewAttributes = getObjectWithNewAttributes(clientAttributes, iotAgentDeviceValue.attributes);
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
        let newValue = mqttAttributes[mqttAttr];
        // switch (type) {
        //     case "number" :
        //         newValue = +newValue;
        //         break;
        //     case "text" :
        //         newValue = String(newValue);
        //         break;
        //     case "boolean" :
        //         newValue = Boolean(newValue);
        //         break;
        // }
        brokerNewAttributes[newAttr] = newValue;
    }
    return brokerNewAttributes;
}