const axios = require('axios').default;

function getInfoFromUser() {
    return {
        "MAC_address": "motion001",
    }
}


let motionInfo = () => {
    const infoFromUser = getInfoFromUser();
    const device_id = infoFromUser.MAC_address;
    return {
        "device_id": "motion001",
        "entity_name": "broker:Motion:001",
        "entity_type": "Motion",
        "transport": "MQTT",
        "attributes": [
            {
                "type": "Integer",
                "object_id": "c",
                "name": "count"
            }
        ],
        "static_attributes": [
            {
                "type": "Relationship",
                "name": "refStore",
                "value": "broker:Room:001"}
        ]
    }
}

let  a = {
    "device_id": "entity_name",
    "entity_type": "Motion",
    "attributes": [
    {
        "type": "Integer",
        "object_id": "c",
        "name": "count"
    }
],
    "static_attributes": [
    {
        "type": "Relationship",
        "name": "refStore",
        "value": "broker:Room:001"
    }
]
}


const sendPostRequest = async () => {
    try {
        const resp = await axios.post('http://localhost:4041/device', motionInfo());
        console.log(resp.data);
    } catch (err) {
        console.error(err);
    }
};
sendPostRequest();