const axios = require('axios').default;
let lampInfo = () => {
    return {
        "deviceId": "mac:http:lamp001",
        "entityName": "broker:Lamp:002",
        "entityType": "Lamp",
        "transport": "HTTP",
        "endpoint": "http://127.0.0.1:3001/mac:http:lamp001/commands",
        "commands": [
            {
                "type": "command",
                "name": "on",
            },
            {
                "type": "command",
                "name": "off",
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