require('dotenv').config()
const SubscriptionSchema = require("../mongodb/subsSchema")
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const checkCondition = require('./checkCondition')

async function CheckSubscriptionsWithChanges(changes) {
	var SubscriptionModel = mongoose.model("subs", SubscriptionSchema)
	let subscriptions = await SubscriptionModel.find().lean()
	subscriptions = Array.from(subscriptions)
	let right_subs = new Array()
	const symbols = /(<=|>=|!=|>|<|=)/
	for (let sub of subscriptions) {
		const type = changes._id.split(':')[1];
		const id = changes._id;
		for (let entity of sub.subject) {
			const typePattern = new RegExp(entity.typePattern)
			const idPattern = new RegExp(entity.idPattern)
			if (typePattern.test(type) && idPattern.test(id)) {
				if (entity.hasOwnProperty('attrs')) {
					let right_sub = false
					for (let i = 1; i < Object.keys(changes).length; i++) {
						right_sub = right_sub || entity.attrs.includes(Object.keys(changes)[i])
					}
					if (right_sub) {
						if (entity.hasOwnProperty('condition')) {
							let true_condition = true
							let conditions = new Array
							conditions = entity.condition.split(";")
							for (let cond of conditions) {
								const condition = cond.split(symbols)
								true_condition = true_condition && await checkCondition(condition, changes).then(b => { return b })
								if (true_condition && right_subs.indexOf(sub) == -1) {
									right_subs.push(sub)
								}
							}
						} else if (right_subs.indexOf(sub) == -1) right_subs.push(sub)
					}
				} else if (right_subs.indexOf(sub) == -1) right_subs.push(sub)
			}
		}
	}
	console.log(right_subs)
	for (let sub of right_subs) {
		if (sub.hasOwnProperty("handler")) {
			let data = {}
			data[sub.handler.command] = {
				type: "command",
				value: ""
				// type: "number",
				// value: 0
			}
			console.log(data)
			const handler_response = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities/${sub.handler.id}/attrs`, {
				method: "PATCH",
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(data)
			}).then(response => {
				return response.json()
			})
		}
		if (sub.hasOwnProperty("notification")) {
			const notification_response = await fetch(sub.notification.url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(changes)
			}).then(response => {
				return response.json()
			})
		}
	}
	return subscriptions
}

module.exports = CheckSubscriptionsWithChanges
