const hbs = require("hbs");
const iotPlatform = require("./iotPlatformFunctions");
const entities = require("../entities");
hbs.registerHelper('getDeviceAttributes', function (device) {
    delete device["name"];
    delete device["_id"];
    delete device["type"];
    // console.log(Object.entries(device));
    return Object.entries(device);
});
hbs.registerHelper('myFunc', function (a, b) {
    // console.log(`${a}:${b}`)
    return false;
});
hbs.registerHelper('isCommand', function (str) {
    return str === "command";
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


function expandDeviceInfo(devices) {
    devices.map(device => {
        const type = device["_id"].split(":")[1];
        const deviceMustBe = entities.typesOfDevices[type];
        const attributesOfDevice = deviceMustBe.attributes;
        device.type = deviceMustBe.text;
        console.log(deviceMustBe);
        for (const attribute of attributesOfDevice) {
            const attrName = attribute.name;
            const attrRussianName = attribute.russianName;
            device[attrName].text = attrRussianName;
            const attrValueFromBroker = device[attrName].value;
            device[attrName].value = attribute.value(attrValueFromBroker);
            if ("commandsDependsOnAttribute" in attribute && attrValueFromBroker) {
                const commandsDependsOnAttribute = attribute.commandsDependsOnAttribute(attrValueFromBroker);
                // console.log(attrValueFromBroker)
                for (const command of commandsDependsOnAttribute) {
                    const commandName = command.name;
                    const commandRussianName = command.russianName;
                    device[commandName].text = commandRussianName;
                }
            }
        }
        for (const command of deviceMustBe.commands) {
            const commandName = command.name;
            const commandRussianName = command.russianName;
            device[commandName].text = commandRussianName;
        }
        for (const key in device) {
            const deviceAttribute = device[key];
            if (deviceAttribute.type === "command" && !deviceAttribute.text) {
                delete device[key];
            }
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
                text: entities.typesOfDevices[type].text,
                isSelected: filterType === type,
            };
    }
    return deviceTypes;
}