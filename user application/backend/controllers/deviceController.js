const iotPlatform = require("./iotPlatformFunctions");
exports.index = async function (request, response) {
    try {
        let shortDevicesIds = await iotPlatform.getAllDevicesShortFormat();
        shortDevicesIds = Object.values(shortDevicesIds);
        const devices = await Promise.all(shortDevicesIds.map(async (deviceId) => await iotPlatform.getObjectById(deviceId)));
        response.json(devices);
    } catch (err) {
        console.log(err);
    }
}

exports.storeDevice = async function (request, response) {
    try {
        console.log(request.body);
        const res = await iotPlatform.postDeviceInAgent(request.body);
        const idPattern = res.entityName;
        const typePattern = res.entityType;
        const {dynamicAttributes = ""} = res;
        if ("dynamicAttributes" in res || "commands" in res) {
            let attributesAndCommands = [];
            if ("dynamicAttributes" in res) {
                attributesAndCommands = res.dynamicAttributes.map((item) => item.name);
            }
            if ("commands" in res) {
                attributesAndCommands.push(...res.commands.map(item => item.name))
            }
            const notification = "http://localhost:80/subscription/indication";
            console.log(attributesAndCommands);
            await iotPlatform.createSubscriptionForDevice(idPattern, typePattern, attributesAndCommands, notification);
        }
        response.redirect("back");
    } catch (err) {
        console.log(err);
    }
};

exports.destroyDevice = async function (request, response) {
    try {
        const {entityName} = request.params;
        console.log(entityName)
        const shortDevicesIds = await iotPlatform.getAllDevicesShortFormat();
        const shortDevicesIdsReverse = {};
        Object.entries(shortDevicesIds).forEach(([key, value]) => {
            shortDevicesIdsReverse[value] = key;
        });
        const macAddress = shortDevicesIdsReverse[entityName];
        await iotPlatform.deleteDeviceInAgent(macAddress);
    } catch (err) {
        console.log(err.response.data);
    }
    response.redirect(301, './')
};
exports.updateDevice = async function (request, response) {
    try {
        console.log(request.body)
        await iotPlatform.updateCommandInAgent(request.body);
        response.redirect("back");
    } catch (err) {
        console.log(err.response.data);
    }
}