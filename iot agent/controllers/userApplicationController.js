exports.addDevice = function (client, mapOfDevices){
    return function (request, response) {
        const setting = request.body;
        const protocol = setting.transport;
        if (protocol === "MQTT") {
            let topic = setting.device_id;
            client.subscribe(topic);
        }
        if (protocol === "HTTP") {

        }

        // сделать ответ response

        // mapOfDevices.set(request.body.device_id, request.body);
    }
};