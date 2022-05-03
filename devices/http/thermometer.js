const random = require('random');
const infoDevice = require("../infoDevice");
const thermometerFunctions = require("../thermometerFunctions");
const axios = require('axios').default;
const ms = thermometerFunctions.getMs();
const shortDeviceInfo = {
    name: "Датчик движения HTTP",
    transport: "HTTP",
    type: "Sensor",
    macAddress: "mac:http:thermometer001",
    functionForDataGenerate: {
        type: 'interval',
        ms: ms,
        attributes: {
            t: "15-17",
            h: "40-50",
        },
    }
};
const fullDeviceInfo = infoDevice.getDevice(shortDeviceInfo);
console.log(fullDeviceInfo);
const {iotAgentEndpoint} = fullDeviceInfo;
setInterval(() => {
    axios.post(iotAgentEndpoint, thermometerFunctions.getMessage())
        .then(() => {
        })
        .catch(err => {
            console.log(err.response.status);
            console.log(err.response.data);
        })
}, ms);


