const hbs = require("hbs");
const iotPlatform = require("./iotPlatformFunctions");
const entities = require("../entities");
hbs.registerHelper('getDeviceAttributes', function (device) {
    delete device["name"];
    delete device["_id"];
    // console.log(Object.entries(device));
    return Object.entries(device);
});
hbs.registerHelper('myFunc', function (a, b) {
    // console.log(`${a}:${b}`)
    return false;
});
exports.index = async function (request, response) {
    const {filterType = ""} = request.query;
    const rooms = await iotPlatform.getAllObjectsByType("Room");
    let shortDevicesIds = await iotPlatform.getAllDevicesShortFormat();
    shortDevicesIds = Object.values(shortDevicesIds);
    const deviceTypes = getDeviceTypes(shortDevicesIds, filterType);
    if (filterType) {
        shortDevicesIds = shortDevicesIds.filter(item => {
            return item.split(":")[1] === filterType
        });
    }
    const devices = await Promise.all(shortDevicesIds.map(async (deviceId) => await iotPlatform.getObjectById(deviceId)));
    expandDeviceInfo(devices);
    const shortRooms = rooms.map(item => ({
        id: item["_id"],
        roomName: item["roomName"].value
    }));
    response.render("index.hbs", {
        str: "str",
        shortRooms: shortRooms,
        devices: devices,
        deviceTypes: deviceTypes,
        filterType: filterType,
    });
};
exports.storeDevice = async function (request, response) {
    try {
        const res = await iotPlatform.postDeviceInAgent(request.body);
        const idPattern = res.entityName;
        const typePattern = res.entityType;
        const attributes = res.dynamicAttributes.map((item) => item.name);
        const notification = "http://localhost:80/subscription/indication";
        await iotPlatform.createSubscriptionForDevice(idPattern, typePattern, attributes, notification);
    } catch (err) {
        console.log(err.response.data);
    }
    response.redirect(301, './')
};

function expandDeviceInfo(devices) {
    devices.map(device => {
        const type = device["_id"].split(":")[1];
        console.log( entities.deviceTypes[type].attributes);
        for (const attribute of entities.deviceTypes[type].attributes) {
            device[attribute[0]].text = attribute[1];
        }
    })
    console.log(devices);
}

function getDeviceTypes(shortDevicesIds, filterType) {
    const deviceTypes = {};
    for (const id of shortDevicesIds) {
        const type = id.split(":")[1];
        if (!(type in deviceTypes))
            deviceTypes[type] = {
                text: entities.deviceTypes[type].text,
                isSelected: filterType === type,
            };
    }
    return deviceTypes;
}