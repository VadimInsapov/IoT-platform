const {default: axios} = require("axios");

exports.updateCommandInAgent = (object) => {
    return axios({
        method: "post",
        url: "http://localhost:4041/update",
        data: object
    }).then((res) => res.data);
}
exports.postDeviceInAgent = (object) => {
    return axios({
        method: "post",
        url: "http://localhost:4041/devices/model",
        data: object
    }).then((res) => res.data);
}
exports.deleteDeviceInAgent = (entityName) => {
    return axios({
        method: "delete",
        url: `http://localhost:4041/devices/${entityName}`,
    }).then((res) => res.data);
}
exports.postObjectInBroker = (object) => {
    return axios({
        method: "post",
        url: "http://localhost:5500/iot/entities",
        data: object
    }).then((res) => res.data);
}
exports.getAllObjectsByType = (type) => {
    return axios({
        method: "get",
        url: `http://localhost:5500/iot/entities?type=${type}`,
    }).then((res) => res.data);
}
exports.getObjectById = (id) => {
    return axios({
        method: "get",
        url: `http://localhost:5500/iot/entities/${id}`,
    }).then((res) => res.data);
}

exports.deleteObjectById = (id) => {
    return axios({
        method: "DELETE",
        url: `http://localhost:5500/iot/entities/${id}`,
    }).then((res) => res.data);
}
exports.getAllDevicesShortFormat = () => {
    return axios({
        method: "get",
        url: `http://localhost:4041/devices?form=short`,
    }).then((res) => res.data);
}
exports.createSubscriptionForDevice = (idPattern, typePattern, attributes, notification) => {
    let subscription = {
        subject: [
            {
                idPattern: idPattern,
                typePattern: typePattern,
                attrs: attributes
            }
        ],
        notification: {
            url: notification
        }
    }

    console.log(subscription);
    return axios({
        method: "post",
        url: `http://localhost:5500/iot/subscriptions`,
        data: subscription
    }).then((res) => res.data);
}
