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
