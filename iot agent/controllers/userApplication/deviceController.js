const Device = require('../../models/device.js');
const util = require('util');

exports.addDevice = function (mqttClient) {
    return function (request, response) {
        const settings = request.body;
        const protocol = settings.transport;
        const deviceId = settings.device_id;
        const entityName = settings.entity_name;
        const dynamicAttributes = settings.dynamic_attributes;
        //проверить что всё ок с устройством
        //добавить в бд
        if (protocol === "MQTT") {
            mqttClient.subscribe("/" + deviceId + "/attrs");
            const device = new Device(deviceId, entityName, dynamicAttributes);
            device.save();
            console.log(util.inspect(Device.getAll(), false, null, true))
        }
        if (protocol === "HTTP") {

        }
        // сделать ответ response
    }
};