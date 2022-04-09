const IoTAgentDevices = new Map();

module.exports = class IoTAgentDevice {
    constructor(body) {
        const {
            deviceId,
            entityName,
            endpoint,
            dynamicAttributes = [],
            commands = []
        } = body;
        this.key = deviceId;
        this.value = this.getValueForDevices(entityName, endpoint, dynamicAttributes, commands);
    }

    static find(deviceId) {
        return IoTAgentDevices.get(deviceId);
    }

    static findByEntityName(entityName) {
        for (let [key, value] of IoTAgentDevices.entries()) {
            if (value.entityName === entityName)
                return key;
        }
    }

    save() {
        IoTAgentDevices.set(this.key, this.value);
    }

    static getAll() {
        return IoTAgentDevices;
    }

    getValueForDevices(entityName, endpoint, dynamicAttributes, commands) {
        let a = {};
        a["entityName"] = entityName;
        if (dynamicAttributes) a["attributes"] = this.getAttributes(dynamicAttributes);
        if (commands) a["commands"] = this.getCommands(commands);
        if (endpoint) a["endpoint"] = endpoint;
        return a;
    }

    getCommands(commands) {
        let ourCommands = commands.reduce((commands, currentValue) => commands.push(currentValue.command), []);
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
