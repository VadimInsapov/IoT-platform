const axios = require('axios').default;

function getInfoFromUser() {
    return {
        "MAC_address": "mac:mqtt:thermometer001",
    }
}

let motionInfo = () => {
    return {
        "deviceId": "mac:http:motion002",
        "entityName": "broker:Motion:002",
        "entityType": "Motion",
        "transport": "HTTP",
        "dynamicAttributes": [
            {
                "type": "number",
                "objectId": "c",
                "name": "count"
            },
        ]
    }
}

const sendPostRequest = async () => {
    try {
        const resp = await axios.post('http://localhost:4041/devices', motionInfo());
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();