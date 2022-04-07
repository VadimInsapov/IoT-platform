const IoTAgentDevice = require('../../models/IoTAgentDevice.js');
const util = require('util');
const {body, validationResult, checkSchema} = require('express-validator/check');
const sendResponseWithErrors = (response, errors) => response.status(400).json({errors: errors.array()});

exports.addDevice = function (mqttClient) {
    return function (request, response) {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            sendResponseWithErrors(response, errors);
            return;
        }
        const {
            deviceId,
            entityName,
            transport: protocol,
            endpoint,
            dynamicAttributes = [],
            commands = []
        } = request.body;
        //добавить в бд
        if (protocol === "MQTT") {
            mqttClient.subscribe(`/${deviceId}/attrs`);
        }
        const iotAgentDevice = new IoTAgentDevice(deviceId, entityName, endpoint, dynamicAttributes, commands);
        iotAgentDevice.save();
        console.log(util.inspect(IoTAgentDevice.getAll(), false, null, true))
        response.status(200).json("IoTAgentDevice was made");
    }
};


exports.validate = (method) => {
    switch (method) {
        case 'addDevice': {
            return [
                body('deviceId')
                    .not().isEmpty()
                    .withMessage('The deviceId is required')
                    .custom(deviceId => !IoTAgentDevice.find(deviceId))
                    .withMessage('The deviceId already in use'),
                body('entityName')
                    .not().isEmpty()
                    .withMessage('The entityType is required')
                    .matches(/broker:.+?:\d{3}/)
                    .withMessage("Invalid entityName")
                    .custom(entityName => !IoTAgentDevice.find(entityName))
                    .withMessage('The entityName already in use'),
                body('entityType')
                    .not().isEmpty()
                    .withMessage('The entityType is required')
                    .custom((value, {req}) => value === (req.body.entityName).split(':')[1])
                    .withMessage("Invalid entityType, check entityName"),
                body('transport')
                    .not().isEmpty()
                    .withMessage('The transport is required')
                    .isIn(['HTTP', 'MQTT'])
                    .withMessage('Wrong transport')
                    .custom((protocol, {req}) => {
                        if (protocol === "HTTP" && req.body.commands) {
                            return req.body.endpoint;
                        }
                        return true;
                    })
                    .withMessage("Device with HTTP transport and commands must have endpoint"),
                body('endpoint')
                    .optional({checkFalsy: true})
                    .matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
                    .withMessage("Invalid endpoint"),
                body(['dynamicAttributes', 'commands'])
                    .custom((value, {req}) => req.body.dynamicAttributes || req.body.commands)
                    .withMessage('At least dynamicAttributes or commands must exist'),
                body('dynamicAttributes')
                    .optional({checkFalsy: true})
                    .isArray()
                    .withMessage('The dynamicAttributes is not array'),
                body('dynamicAttributes.*.type')
                    .not().isEmpty()
                    .withMessage('The dynamicAttributes.type is required')
                    .isIn(['number', 'text', 'boolean'])
                    .withMessage('Wrong the dynamicAttributes.type, type is unknown'),
                body('dynamicAttributes.*.objectId')
                    .not().isEmpty()
                    .withMessage('The dynamicAttributes.objectId is required'),
                body('dynamicAttributes.*.name')
                    .not().isEmpty()
                    .withMessage('The dynamicAttributes.name is required'),
                body('commands')
                    .optional({checkFalsy: true})
                    .isArray()
                    .withMessage('The commands is not array'),
                body('commands.*.type')
                    .not().isEmpty()
                    .withMessage('The commands.type is required')
                    .custom((value, {req}) => value === "command")
                    .withMessage('The commands.type is not command'),
                body('commands.*.name')
                    .not().isEmpty()
                    .withMessage('The commands.name is required'),
                body('staticAttributes')
                    .optional({checkFalsy: true})
                    .isArray()
                    .withMessage('The staticAttributes is not array'),
                body('staticAttributes.*.name')
                    .not().isEmpty()
                    .withMessage('The staticAttributes.name is required'),
                body('staticAttributes.*.value')
                    .not().isEmpty()
                    .withMessage('The staticAttributes.value is required'),
                body('staticAttributes.*.type')
                    .not().isEmpty()
                    .withMessage('The staticAttributes.type is required')
                    .isIn(['number', 'text', 'boolean', 'array', 'relationship'])
                    .withMessage('Wrong the staticAttributes.type, type is unknown'),
                body('staticAttributes.*')
                    .custom((staticAttribute, {req}) => {
                        const type = staticAttribute.type;
                        const value = staticAttribute.value;
                        if (type === 'number') {
                            return typeof value === 'number';
                        }
                        if (type === 'text') {
                            return typeof value === 'string';
                        }
                        if (type === 'relationship') {
                            const regularExp = /broker:.+?:\d{3}/;
                            return regularExp.test(value);
                        }
                        if (type === 'array') {
                            return Array.isArray(value);
                        }
                        if (type === 'boolean') {
                            return (typeof value === "boolean");
                        }
                    })
                    .withMessage("Invalid staticAttributes.value, look at staticAttributes.type")
            ]
        }
    }
}

