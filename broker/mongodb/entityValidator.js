const {body} = require('express-validator/check');

exports.validate = [
	// body('_id')
	// 	.not().isEmpty().withMessage('id is required')
	// 	.matches(/broker:.+?:\d{3}/).withMessage("invalid id"),
	body('type')
		.not().isEmpty()
		.withMessage('type is required'),
		// .custom((value, {req}) => value === (req.body._id).split(':')[1])
		// .withMessage("invalid type"),
	body('attributes')
		.not().isEmpty().withMessage('attribute value is required')
		.isArray().withMessage('attributes field is not array'),
	body('attributes.*.*.value')
		.not().isEmpty().withMessage('attribute value is required'),
	body('attributes.*.*.type')
		.not().isEmpty().withMessage('attribute type is required')
		.isIn(['number', 'text', 'boolean', 'array', 'relationship']).withMessage('type is unknown'),
	body('attributes.*.*')
		.custom((attribute, {req}) => {
			const type = attribute.type;
			const value = attribute.value;
			if (type === 'number') {
				return typeof value === 'number';
			}
			if (type === 'text') {
				return typeof value === 'string';
			}
			if (type === 'array') {
				return Array.isArray(value);
			}
			if (type === 'boolean') {
				return (typeof value === "boolean");
			}
			if (type === 'relationship') {
				const regularExp = /broker:.+?:\d{3}/;
				return regularExp.test(value);
			}
		}
		).withMessage("invalid attribute value")
	]

	