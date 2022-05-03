const axios = require('axios').default;
let motionInfo = () => {
    return {
        "deviceId": "mac:http:bell001",
        "entityName": "broker:Bell:001",
        "entityType": "Bell",
        "transport": "HTTP",
        "endpoint": "http://127.0.0.1:3001/mac:http:bell001/commands",
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