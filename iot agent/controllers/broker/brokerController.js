const Device = require('../../models/IoTAgentDevice');
const senderCommands = require('./senderCommands');
exports.updateState = function (mqttClient) {
    return function (request, response) {
        const {id: entityName, command} = request.body;
        const {deviceId, commands} = Device.findDeviceByEntityName(entityName);
        if (!deviceId) {
            response.status(400).json(`The object ${entityName} wasn't found in IoT-Agent!`);
        }
        if (!commands.includes(command)){
            response.status(400).json(`The object ${entityName} doesn't include command ${command}!`);
        }
        const endpoint = Device.getEndpointByEntityName(entityName);
        if (endpoint) {
            senderCommands.sendHttpCommand(endpoint, command);
        } else {
            senderCommands.sendMqttCommand(mqttClient, deviceId, command);
            response.status(200).json(`The command ${command} was sent!`);
        }
    }
};
// {
//     id:"broker:Bell:001",
//     command:"ring"
// }
