require('dotenv').config();
const getMqttSensorTopic = (macId) => `/${macId}/attributes`;
const getMqttActuatorTopic = (macId) => `/${macId}/commands`;
const getHttpActuatorSettings = (name) => {
    let port = 3001;
    if (name === "Лампа HTTP"){
        port = +process.env.HTTP_LAMP_PORT;
    }
    if (name === "Дверь HTTP"){
        port = +process.env.HTTP_DOOR_PORT;
    }
    if (name === "Звонок HTTP"){
        port = +process.env.HTTP_BELL_PORT;
    }
    return {
        host: process.env.LOCALHOST,
        port: port
    }
};
const getIoTAgentNorthSettings = () => {
    return {
        host: process.env.IOT_AGENT_HOST,
        port: +process.env.IOT_AGENT_NORTH_PORT
    }
};
const getMqttBrokerSettings = () => {
    return {
        host: process.env.BROKER_HOST,
        port: +process.env.BROKER_PORT
    }
};
const getIotAgentEndpoint = (macId) => {
    const {host, port} = getIoTAgentNorthSettings();
    return `http://${host}:${port}${process.env.IOT_AGENT_HOST_ROUTE}?deviceId=${macId}`;
};
const getHttpActuatorEndpoint = (macId) => {
    const {host, port} = getHttpActuatorSettings();
    return `http://${host}:${port}/${macId}/commands`;
};
const getHttpActuatorRoute = (macId) => {
    return `/${macId}/commands`;
};
module.exports.getDevice = (device) => {
    const {transport, type, macAddress, name, functionForDataGenerate} = device;
    let obj = {};
    obj["name"] = name;
    obj["type"] = type;
    obj["macAddress"] = macAddress;
    if (transport === "MQTT") {
        obj["brokerSettings"] = getMqttBrokerSettings();
        if (type === "Sensor") {
            obj["topic"] = getMqttSensorTopic(macAddress);
        }
        if (type === "Actuator") {
            obj["topic"] = getMqttActuatorTopic(macAddress);
        }
        if (type === "Gate") {
            obj["topicAttributes"] = getMqttSensorTopic(macAddress);
            obj["topicCommands"] = getMqttActuatorTopic(macAddress);
        }
    }
    if (transport === "HTTP") {
        if (type === "Sensor") {
            obj["iotAgentSetting"] = getIoTAgentNorthSettings(macAddress);
            obj["iotAgentEndpoint"] = getIotAgentEndpoint(macAddress);
        }
        if (type === "Actuator") {
            obj["actuatorSettings"] = getHttpActuatorSettings(name);
            obj["deviceRoute"] = getHttpActuatorRoute(macAddress);
            obj["deviceEndPoint"] = getHttpActuatorEndpoint(macAddress);
        }
        if (type === "Gate") {
            obj["iotAgentSetting"] = getIoTAgentNorthSettings(macAddress);
            obj["iotAgentEndpoint"] = getIotAgentEndpoint(macAddress);
            obj["actuatorSettings"] = getHttpActuatorSettings(name);
            obj["deviceRoute"] = getHttpActuatorRoute(macAddress);
            obj["deviceEndPoint"] = getHttpActuatorEndpoint(macAddress);
        }
    }
    if (functionForDataGenerate) obj["functionForDataGenerate"] = functionForDataGenerate;
    return obj;
}
module.exports.getBroker = (brokerInfo) => {
    return {
        name: brokerInfo.name,
        brokerSettings: getMqttBrokerSettings(),
    }
};
