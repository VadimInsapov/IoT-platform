const axios = require('axios').default;
let motionInfo = () => {
    return {
        "deviceId": "mac:mqtt:thermometer001",
        "entityName": "broker:Thermometer:002",
        "model" : "SThM",
        "relationships": [
            {
                "name": "refStore",
                "value": "broker:room:001"
            }
        ]
    }
}

const sendPostRequest = async () => {
    try {
        const resp = await axios.post('http://localhost:4041/devices/model', motionInfo());
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();