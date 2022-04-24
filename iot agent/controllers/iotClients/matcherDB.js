const IoTAgentDevice = require("../../models/IoTAgentDevice");
const util = require("util");
exports.getBrokerId = iotAgentDeviceValue => iotAgentDeviceValue.entityName;
exports.getBrokerAttributes = (iotAgentDeviceValue, clientAttributes) => {
    const iotAgentAttributes = iotAgentDeviceValue.attributes;
    let brokerNewAttributes = {};
    for (const mqttAttr in clientAttributes) {
        let newAttr = iotAgentAttributes[mqttAttr].name;
        let type = iotAgentAttributes[mqttAttr].type;
        let newValue = clientAttributes[mqttAttr];
        if (type === "number") {
            newValue = +newValue
        } else if (type === "text") {
            newValue = String(newValue);
        } else if (type === "boolean") {
            if (newValue === "true" || newValue === "false") {
                newValue = Boolean(newValue);
            }
        };
        brokerNewAttributes[newAttr] = newValue;
    }
    return brokerNewAttributes;
};