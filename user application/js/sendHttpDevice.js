const axios = require('axios').default;

function getInfoFromUser() {
    return {
        "MAC_address": "mac:mqtt:thermometer001",
    }
}

let motionInfo = () => {
    return {
        "device_id": "mac:http:thermometer002",
        "entity_name": "broker:Thermometer:002",
        "entity_type": "Thermometer",
        "transport": "HTTP",
        "dynamic_attributes": [
            {
                "type": "number",
                "object_id": "h",
                "name": "humidity"
            },
            {
                "type": "number",
                "object_id": "t",
                "name": "temperature"
            },
        ],
        "static_attributes": [
            {
                "name": "refStore",
                "type": "relationship",
                "value": "broker:Room:001"
            }
        ]
    }
}

const sendPostRequest = async () => {
    try {
        const resp = await axios.post('http://localhost:4041/devices', motionInfo());
        console.log(resp.data);
    } catch (err) {
        console.error(err);
    }
};
sendPostRequest();