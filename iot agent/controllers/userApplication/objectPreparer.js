module.exports = (body) => {
    const {entityName, name = "", dynamicAttributes = [], commands = [], relationships = []} = body;
    let device = {};
    if (name) {
        device["name"] = {
            type:"text",
            value: entityName,
        };
    }
    device["_id"] = entityName;
    for (const attribute of dynamicAttributes) {
        device[attribute.name] = 'null';
    }
    for (const command of commands) {
        device[command.name] = {
            type: "command",
            value: "",
        };
    }
    for (const relation of relationships) {
        const refBrokerId = relation.value;
        const type = refBrokerId.split(':')[1];
        const propertyName = relation.name;
        device[propertyName] = {};
        device[propertyName]["$ref"] = type;
        device[propertyName]["id"] = refBrokerId;
    }
    return device;
}