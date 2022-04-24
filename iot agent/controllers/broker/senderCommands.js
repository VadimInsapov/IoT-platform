const axios = require('axios').default;
exports.sendHttpCommand = (endpoint, command, responseForBroker) =>{
    const message = {}
    message['command'] =  command;
    axios.post(endpoint, message)
        .then((response) => {
            responseForBroker.status(200).json(`The command ${command} was sent!`);
        })
        .catch(err => {
            responseForBroker.status(400).json(`The device is not available`);
        });
};
exports.sendMqttCommand = (mqttClient, deviceId, command) =>{
    const topic = `/${deviceId}/commands`;
    const message = {}
    message['command'] =  command;
    mqttClient.publish(topic, JSON.stringify(message));
};