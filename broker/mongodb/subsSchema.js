const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
	_id:{type:String},
	description: {type:String},
	//time: {type: Date},
	subject: {type: Object},
	handler: {type: Object},
	notification: {type: Object},
}, {strict: false}) 

module.exports = SubscriptionSchema
