const axios = require('axios').default;
module.exports = async (brokerId, newAttributes) => {
    const obj = {
        _id: brokerId,
        attributes: Object.keys(newAttributes),
    };
    try {
        await axios.post('http://localhost:5500/iot/agent', obj);
    }
    catch (err) {
        if(err) console.log(err);
    }
}
