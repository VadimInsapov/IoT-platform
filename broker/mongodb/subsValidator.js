const {body} = require('express-validator/check');

exports.validate = [
	// body('_id')
	// 	.not().isEmpty().withMessage('id is required'),
	body('description')
		.optional({checkFalsy: true}),
	body('time')
		.optional({checkFalsy: true}),
	body('subject')
		.optional(),
	// body('subject.entities')
	// 	.isArray().withMessage('entities field is not array'),
	body('subject.entities.*.idPattern')
		.not().isEmpty().withMessage('idPattern is required'),
	body('subject.entities.*.typePattern')
		.not().isEmpty().withMessage('typePattern is required'),
	body('subject.entities.*.attrs')
		.not().isEmpty().withMessage('attrs is required')
		.isArray().withMessage('attributes field is not array'),
	// body('subject.condition')
	// 	.not().isEmpty().withMessage('condition is required'),
	body('subject.condition.expression')
		.optional({checkFalsy: true}),
	body('handler')
		.optional({checkFalsy: true}),
	// body('handler.id')
	// 	.not().isEmpty().withMessage('id is required'),
	// body('handler.command')
	// 	.not().isEmpty().withMessage('id is required'),
	body('notification')
		.optional({checkFalsy: true}),
	// body('notification.url')
	// 	.not().isEmpty().withMessage('url is required'),
	// body('notification.attrsFormat')
	// .optional({checkFalsy: true}),
	]

	
/**
 * "description", - описание, строка, опционально
 * "time"
 * "subject": { - на что подписываемся, объект, обязательно
 * 	"entities": [ - массив сущностей, на которые подписываемся, обязательно
 * 		{
 * 			"idPattern", - либо явный айдишник ?только число или полностью?, либо регулярка, строка, обязательно
 * 			"typePattern" - либо явный тип, либо регулярка, строка, обязательно
 * 			"attrs": [] - массив атрибутов, за изменениями в которых будем следить, строки, обязательно
 * 		}
 * 	],
 * 	"condition": - условие реагирования
 * "handler": {
 * 	"id",
 * 	"command"
 * }
 * "notification": { - способ уведомления
 * 	"http_url", - куда отправляется уведомление
 * 	"attrsFormat"
 * }
 */
