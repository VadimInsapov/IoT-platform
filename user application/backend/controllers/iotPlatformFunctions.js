const {default: axios} = require("axios");


exports.postDeviceInAgent = (object) => {
    return axios({
        method: "post",
        url: "http://localhost:4041/devices/model",
        data: object
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

/**
 * "description", - описание, строка, опционально
 * "time"
 * "subject": { - на что подписываемся, объект, обязательно
 * 	"entities": [ - массив сущностей, на которые подписываемся, обязательно
 * 		{
 * 			"idPattern", - либо явный айдишник ?только число или полностью?, либо регулярка, строка, обязательно
 * 			"typePattern" - либо явный тип, либо регулярка, строка, обязательно
 * 			"attrs": [] - массив атрибутов, за изменениями в которых будем следить, строки, обязательно
 * 			"condition": - условие реагирования
 * 		}
 * 	],
 * "handler": {
 * 	"id",
 * 	"command"
 * }
 * "notification": { - способ уведомления
 * 	"http_url", - куда отправляется уведомление
 * 	"attrsFormat"
 * }
 */
