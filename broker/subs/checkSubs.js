require('dotenv').config()
const SubscriptionSchema = require("../mongodb/subsSchema")
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const checkCondition = require('./checkCondition')

async function CheckSubscriptionsWithChanges(changes) {
	var SubscriptionModel = {}
	if (mongoose.models.hasOwnProperty(`subs`))
		SubscriptionModel = mongoose.models[`subs`]
	else
		SubscriptionModel = mongoose.model("subs", SubscriptionSchema)
	let subscriptions = await SubscriptionModel.find().lean()
	subscriptions = Array.from(subscriptions)
	let right_subs = new Array()
	const symbols = /(<=|>=|!=|>|<|=)/
	const logical = /(&&|\|\||\(|\))/
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
	//console.log(right_subs)
	for (let sub of right_subs) {
		let fullCondition_value = true
		let bools_subs = new Array()
		for (let subject of sub.subject) {
			//console.log(subject)
			const typePattern = new RegExp(subject.typePattern)
			const idPattern = new RegExp(subject.idPattern)
			let check_subject = true
			let probably_types = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/types`).then(response => {
				return response.json()
			})
			for (let type of probably_types) {
				let changed_type_name = type[0].toUpperCase() + type.slice(1, -1)
				//console.log(changed_type_name)
				if (typePattern.test(changed_type_name)) {
					//console.log(type)
					let probably_entities = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities?type=${type}`).then(response => {
						return response.json()
					})
					for (let entity of probably_entities) {
						if (idPattern.test(entity._id)) {
							//console.log(entity)
							if (subject.hasOwnProperty("condition")) {
								const condition = subject["condition"].split(symbols)
								const attribute = entity[condition[0]]
								let checked_object = {}
								checked_object["_id"] = entity._id
								checked_object[condition[0]] = attribute
								check_subject = check_subject && await checkCondition(condition, checked_object).then(b => { return b })
							}
							//console.log(check_subject)
						}
					}
				}
			}
			bools_subs.push(check_subject)
		}
		if (sub.hasOwnProperty("fullCondition")) {
			const fullCondition = sub.fullCondition.split(logical)
			for (let part of fullCondition) {
				if (!logical.test(part)) {
					fullCondition[fullCondition.indexOf(part)] = bools_subs[part]
				}
			}
			//console.log(fullCondition)
			fullCondition_value = eval(fullCondition.join(''))
			//console.log(fullCondition_value)
		}
		//console.log(sub)
		//let handler_sended = true
		
		//console.log(fullCondition_value)
		if (sub.hasOwnProperty("handler") && fullCondition_value) {
			for (let handler of sub.handler) {
				const idPattern = new RegExp(handler.id)
				let probably_handlers = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities?type=${handler["id"].split(":")[1]}`).then(response => {
					return response.json()
				})
				for (let hand of probably_handlers) {
					//console.log(hand)
					if (idPattern.test(hand._id)) {
						// let handler_status = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities/${hand._id}/attrs/status`).then(response => {
						// 	return response.json()
						// })
						//console.log(handler_status)
						//if (handler_status.value != handler.command) {
							handler_sended = true
							let data = {}
							data["id"] = hand._id
							data["command"] = handler.command
							//console.log(data)
							const handler_response = await fetch(`http://${process.env.LOCALHOST}:${process.env.COMMAND_PORT}/update`, {
								method: "POST",
								headers: {
									'Content-Type': 'application/json;charset=utf-8'
								},
								body: JSON.stringify(data)
							}).then(response => {
								return response.json()
							})
							//console.log(handler_response)
						//}
						//else handler_sended = false
						//console.log(handler_sended)
					}
				}
			}
		}
		if (sub.hasOwnProperty("notification")  && fullCondition_value) {
			let data = {}
			data["idSub"] = sub._id
			if (sub.hasOwnProperty("description")) data["nameSub"] = sub.description
			Object.assign(data, changes)
			//console.log(data)
			const notification_response = await fetch(sub.notification.url, {
				method: "POST",
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify(data)
			}).then(response => {
				return response.json()
			})
		}
	}
	return subscriptions
}

module.exports = CheckSubscriptionsWithChanges
