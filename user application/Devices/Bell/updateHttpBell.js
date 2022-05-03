const axios = require('axios').default;

let motionInfo = () => {
    return {
        "id": "broker:Bell:001",
        "command": "ring",
    }
}

const sendPostRequest = async () => {
    try {
        const resp = await axios.post('http://localhost:4041/update', motionInfo());
    } catch (err) {
        console.log(err.response.status);
        console.log(err.response.data);
    }
};
sendPostRequest();