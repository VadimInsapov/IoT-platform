const axios = require('axios').default;
exports.sendHttpCommand = (endpoint, command, responseForBroker) => {
    const message = {}
    message['command'] = command;
    console.log(endpoint)
    axios.post(endpoint, message)
        .catch(err => {
            responseForBroker.status(400).json(`The device is not available`);
        });
    responseForBroker.status(200).json(`The command ${command} was sent!`);
};
exports.sendMqttCommand = (mqttClient, deviceId, command, responseForBroker) => {
    const topic = `/${deviceId}/commands`;
    const message = {}
    message['command'] = command;
    mqttClient.publish(topic, JSON.stringify(message));
    responseForBroker.status(200).json(`The command ${command} was sent!`);
};