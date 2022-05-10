const SubscriptionSchema = require ("../mongodb/subsSchema")
const mongoose = require('mongoose');
const { type } = require("express/lib/response");
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient('mongodb://127.0.0.1');

async function CheckSubscriptionsWithChanges(changes) {
	var SubscriptionModel = mongoose.model("subs", SubscriptionSchema)
	let subscriptions = await	SubscriptionModel.find().lean()
	subscriptions = Array.from(subscriptions)
	let right_subs = new Array()
	for(let sub of subscriptions)
	{
		const type = changes._id.split(':')[1];
		const id = changes._id.split(':')[2];
		for(let entity of sub.subject.entities)
		{
			const typePattern = new RegExp(entity.typePattern)
			if(typePattern.test(type))
			{
				const idPattern = new RegExp(entity.idPattern)
				if(idPattern.test(id))
				{
					if(entity.attrs.includes(changes.attr))
					{
						right_subs.push(sub)
					}
				}	
			}
		}
	}
	console.log(right_subs)
	return subscriptions
}

module.exports = CheckSubscriptionsWithChanges
