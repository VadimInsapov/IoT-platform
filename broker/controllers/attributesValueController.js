const EntitySchema = require ("../mongodb/entitySchema.js")
const mongoose = require('mongoose')


class AttributeValueController {
	async getAttributeValue (req, res) {
		try{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({_id: req.params.id})
			res.send(`${entity[req.params.name]["value"]}`)
		} catch(e) {
			res.send(`entities id=${req.params.id} attrs name=${req.params.name} value ${req.method} error`);
		}
	}

	async updateAttributeValue (req, res) {
		try{
			const {value} = req.body;
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({_id: req.params.id})
			let right_type
			switch(entity[req.params.name]["type"]) {
				case 'number':{
					right_type = typeof(value) === 'number'
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
			if(!right_type) return res.send("uncorrect type of value")
			entity[req.params.name]["value"] = value
			await EntityModel.replaceOne({_id: req.params.id}, entity)
			res.send(entity)
		} catch(e) {
			res.send(`entities id=${req.params.id} attrs name=${req.params.name} value ${req.method} error`);
		}
	}

}

module.exports = new AttributeValueController
