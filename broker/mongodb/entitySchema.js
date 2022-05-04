const mongoose = require("mongoose");
const attributeSchema = require('./attributesSchema')

const EntitySchema = new mongoose.Schema({
	_id:{type:String, required: true},
	//type: {type: String, required: true},
}, {strict: false}) 

module.exports = EntitySchema
