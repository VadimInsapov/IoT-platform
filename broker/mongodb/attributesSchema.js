const mongoose = require("mongoose");

const AttributesSchema = new mongoose.Schema({
	type: String,
	value: String
})

module.exports = AttributesSchema
