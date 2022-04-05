const Device = require('../../models/device.js');
// {
//     id:"broker:Bell:001",
//     command:"ring"
// }
exports.updateState = function (mqttClient) {
    return function (request, response) {
        const {id: entityName, command} = request.body;
        //кто нибудь подписан? и ответ нет никого
        const deviceId = Device.findByEntityName(entityName);
        const topic = `/${deviceId}/commands`;
        const message = {command: command};
        console.log(topic)
        console.log(message)
        mqttClient.publish(topic,  JSON.stringify(message));
    }
};