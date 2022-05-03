const IoTAgentDevices = new Map();

module.exports = class IoTAgentDevice {
    constructor(body) {
        const {
            deviceId,
            entityName,
            transport: protocol,
            endpoint = "",
            dynamicAttributes = [],
            commands = []
        } = body;
        this.key = deviceId;
        this.value = this.getValueForDevices(entityName, protocol, endpoint, dynamicAttributes, commands);
    }

    static find(deviceId) {
        return IoTAgentDevices.get(deviceId);
    }
    static getBrokerId(deviceId) {
        return this.find(deviceId).entityName;
    }
    static getProtocol(deviceId) {
        return this.find(deviceId).protocol;
    }
    static delete(deviceId) {
        return IoTAgentDevices.delete(deviceId);
    }

    static findDeviceByEntityName(entityName) {
        for (let [key, value] of IoTAgentDevices.entries()) {
            if (value.entityName === entityName)
                return {
                    deviceId: key,
                    commands: value.commands,
                };
        }
        return false;
    }
    static getProtocolByEntityName(entityName) {
        for (let [key, value] of IoTAgentDevices.entries()) {
            if (value.entityName === entityName)
                return value.protocol;
        }
    }
    static getEndpointByEntityName(entityName) {
        for (let [key, value] of IoTAgentDevices.entries()) {
            if (value.entityName === entityName)
                return value.endpoint;
        }
    }

    save() {
        IoTAgentDevices.set(this.key, this.value);
    }

    static getAll() {
        return IoTAgentDevices;
    }

    getValueForDevices(entityName, protocol, endpoint, dynamicAttributes, commands) {
        let a = {};
        a["entityName"] = entityName;
        a["protocol"] = protocol;
        if (dynamicAttributes.length !== 0) a["attributes"] = this.getAttributes(dynamicAttributes);
        if (commands.length !== 0) a["commands"] = this.getCommands(commands);
        if (endpoint !== "") a["endpoint"] = endpoint;
        return a;
    }

    getCommands(commands) {
        let ourCommands = commands.map(currentValue => (currentValue.name));
        return ourCommands;
    }

    getAttributes(dynamicAttributes) {
        let attributes = dynamicAttributes.reduce((attributes, currentValue) => {
            attributes[currentValue.objectId] = {
                type: currentValue.type,
                name: currentValue.name,
            }
            return attributes;
        }, {});
        return attributes;
    }
}
// let a = {
//     "motion001": {
//         entityName: "broker:Motion:001",
//         attributes: {
//             c: {
//                 type: "number",
//                 name: "count"
//             }
//         }
//         commands: [ring]
//         endpoint: "http://"
//     }
// };
