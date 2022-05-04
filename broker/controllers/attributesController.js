const EntitySchema = require ("../mongodb/entitySchema.js")
const mongoose = require('mongoose')
const {body, validationResult} = require('express-validator/check');
const sendResponseWithErrors = (response, errors) => response.status(400).json({errors: errors.array()});


class AtributesController {
	async getAttributeData (req, res) {
		try{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({_id: req.params.id}).lean()
			res.send(entity[req.params.name])
		} catch(e) {
			res.send(`entities id=${req.params.id} attrs name=${req.params.name} ${req.method} error`);
		}
	}

	async updateAttributeData (req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else{
			const {type, value} = req.body
			let right_type
			switch(type) {
				case "number":{
					right_type = typeof(value) === "number"
					break;
				}
				case 'text':{
					right_type = typeof(value) === 'string'
					break;
				}
				case 'array':{
					right_type = Array.isArray(value)
					break;
				}
				case 'boolean':{
					right_type = typeof(value) === 'boolean'
					break;
				}
				case 'relationship': {
						const regularExp = /broker:.+?:\d{3}/;
						return regularExp.test(value);
				}
			}
			if(!right_type)
			{return res.send("uncorrect type of value")
		}
			const entityType = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(entityType, EntitySchema)
			const entity = await EntityModel.findById({_id: req.params.id}).lean()
			entity[req.params.name] = {
				"type": type,
				"value": value
			}
			await EntityModel.replaceOne({_id: req.params.id}, entity)
			res.send(entity)
		}
	}

	async deleteAttribute (req, res) {
		try{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({_id: req.params.id}).lean()
			delete entity[req.params.name]
			await EntityModel.replaceOne({_id: req.params.id}, entity)
			res.send(entity)

		} catch(e) {
			res.send(`entities id=${req.params.id} attrs name=${req.params.name} ${req.method} error`);
		}
	}

}

module.exports = new AtributesController
