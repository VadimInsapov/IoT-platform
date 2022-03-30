const devices = new Map();

module.exports = class Device{
    constructor(deviceId, dynamic_attributes){
        this.deviceId = deviceId;
        this.attributes = new ValueForDevices(dynamic_attributes);
    }
    save(){
        devices.set(this.deviceId, this.attributes);
    }
    static getAll(){
        return devices;
    }
}
function ValueForDevices(dynamic_attributes) {
    this["entity_name"] = "broker:Motion:001";
    let attributes = dynamic_attributes.reduce((attributes, currentValue) => {
        attributes[currentValue.object_id] = {
            type: currentValue.type,
            name: currentValue.name,
        }
        return attributes;
    }, {});
    this["attributes"] = attributes;
}
// let a = {
//     "motion001": {
//         entity_name: "broker:Motion:001",
//         attributes: {
//             c: {
//                 type: "number",
//                 name: "count"
//             }
//         }
//     }
// };
