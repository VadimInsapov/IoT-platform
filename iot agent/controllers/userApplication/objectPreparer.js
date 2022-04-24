module.exports = (body) => {
    const { entityName, dynamicAttributes = [], commands = [], relationships = []} = body;
    let device = {};
    device["_id"] = entityName;
    for (const attribute of dynamicAttributes) {
        device[attribute.name] = 'null';
    }
    for (const command of commands) {
        device[command.name] = '';
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