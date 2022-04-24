const random = require('random');
const axios = require('axios').default;
let deviceId = 'mac:http:thermometer002'

const getMessage = () => {
    return {
        t: String(random.int(15, 18)),
        h: String(random.int(40, 50)),
    }
}
const getConfig = () => {
    return {
        params: {
            deviceId: deviceId
        },
    };
}
console.log("HTTP термометр");
console.log("http://localhost:7896/iot");
console.log("MAC-address: "+ deviceId);
setInterval(() => {
    axios.post('http://localhost:7896/iot', getMessage(), getConfig())
        .catch(err => {
            console.log(err.response.status);
            console.log(err.response.data);
        })
}, 5000);


