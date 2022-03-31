const random = require('random');
const axios = require('axios').default;
let deviceId = 'mac:http:thermometer002'


setInterval(() => {
    axios.post('http://localhost:7896/iot', {
        t: String(random.int(15, 20)),
        h: String(random.int(30, 50)),
    }, {
        params: {
            deviceId: deviceId
        },
    })
}, 5000);


