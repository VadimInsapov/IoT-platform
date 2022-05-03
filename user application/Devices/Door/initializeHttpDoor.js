const axios = require('axios').default;
let lampInfo = () => {
    return {
        "deviceId": "mac:http:door001",
        "entityName": "broker:Door:002",
        "entityType": "Door",
        "transport": "HTTP",
        "endpoint": "http://127.0.0.1:3002/mac:http:door001/commands",
        "commands": [
            {
                "type": "command",
                "name": "open",
            },
            {
                "type": "command",
                "name": "close",
            },
        ],
        "dynamicAttributes": [
            {
                "type": "text",
                "objectId": "st",
                "name": "status"
            }
        ],
    }
}

const sendPostRequest = async () => {
    try {
        const response = await axios.post('http://localhost:4041/devices', lampInfo());
        console.log(response.status);
        console.log(response.data);
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();