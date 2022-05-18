const { body } = require('express-validator/check');

exports.validate = [
	body('description')
		.optional({ checkFalsy: true }),
	body('time')
		.optional({ checkFalsy: true }),
	body('subject')
		.optional(),
	body('subject.*.idPattern')
		.not().isEmpty().withMessage('idPattern is required'),
	body('subject.*.typePattern')
		.not().isEmpty().withMessage('typePattern is required'),
	body('handler')
		.optional({ checkFalsy: true }),
	body('notification')
		.optional({ checkFalsy: true }),
]

/**
 * "description",
 * "time"
 * "subject": [
 * 		{
 * 			"idPattern",
 * 			"typePattern",
 * 			"attrs": [],
 * 			"condition"
 * 		}
 * 	],
 * "handler": {  
 * 	"id",
 * 	"command"
 * },
 * "notification": { 
 * 	"url"
 * }
 */
