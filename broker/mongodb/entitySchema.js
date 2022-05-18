const mongoose = require("mongoose");

const EntitySchema = new mongoose.Schema({
	_id: { type: String, required: true },
}, { strict: false })

module.exports = EntitySchema
