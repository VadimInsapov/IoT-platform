const devices = new Map();

module.exports = class Device {
    constructor(deviceId, entityName, dynamicAttributes) {
        this.key = deviceId;
        this.value = this.getValueForDevices(entityName, dynamicAttributes);
    }

    static find(deviceId) {
        return devices.get(deviceId);
    }

    save() {
        devices.set(this.key, this.value);
    }

    static getAll() {
        return devices;
    }

    getValueForDevices(entityName, dynamicAttributes) {
        let a = {};
        a["entityName"] = entityName;
        let attributes = dynamicAttributes.reduce((attributes, currentValue) => {
            attributes[currentValue.objectId] = {
                type: currentValue.type,
                name: currentValue.name,
            }
            return attributes;
        }, {});
        a["attributes"] = attributes;
        return a;
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
//     }
// };
