const random = require('random');
const axios = require('axios').default;
let deviceId = 'mac:http:motion002'

const getMessage = () => {
    return {
        c:  String(random.int(0, 1)),
    }
}
const getConfig = () => {
    return {
        params: {
            deviceId: deviceId
        },
    };
}
console.log("HTTP датчик движения");
console.log("http://localhost:7896/iot");
console.log("MAC-address: "+ deviceId);
setInterval(() => {
    axios.post('http://localhost:7896/iot', getMessage(), getConfig())
        .catch(err => {
            console.log(err.response.status);
            console.log(err.response.data);
        })
}, 5000);


