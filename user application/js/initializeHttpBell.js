const axios = require('axios').default;
let motionInfo = () => {
    return {
        "deviceId": "mac:http:bell002",
        "entityName": "broker:Bell:002",
        "entityType": "Bell",
        "transport": "HTTP",
        "endpoint": "http://127.0.0.1:3010/mac:http:bell002/commands",
        "commands": [
            {
                "type": "command",
                "name": "ring",
            },
        ],
        "staticAttributes": [
            {
                "name": "refStore",
                "type": "text",
                "value": "ss"
            }
        ]
    }
}

const sendPostRequest = async () => {
    try {
        const response = await axios.post('http://localhost:4041/devices', motionInfo());
        console.log(response.status);
        console.log(response.data);
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();