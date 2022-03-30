const Device = require('../../models/device.js');
const util = require('util');

exports.addDevice = function (client) {
    return function (request, response) {
        const settings = request.body;
        const protocol = settings.transport;
        const deviceId = settings.device_id;
        const dynamic_attributes = settings.dynamic_attributes;
        if (protocol === "MQTT") {
            client.subscribe(deviceId);
            const device = new Device(deviceId, dynamic_attributes);
            device.save();
            console.log(util.inspect(Device.getAll(), false, null, true))
        }
        if (protocol === "HTTP") {

        }

        // сделать ответ response

        // mapOfDevices.set(request.body.device_id, request.body);
    }
};