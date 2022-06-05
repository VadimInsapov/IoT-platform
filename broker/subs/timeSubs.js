require('dotenv').config()
const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');
const checkCondition = require('./checkCondition')

function CreateTimeSub(time_sub) {
	const job = new CronJob(`0 ${time_sub.time["minute"]} ${time_sub.time["hour"]} * * ${time_sub.time["days"]}`, () => CheckTimeSub(time_sub), 'Asia/Yekaterinburg');
	job.start();
}

async function CheckTimeSub(time_sub) {
	let true_condition = true
	if (time_sub.hasOwnProperty('subject')) {
		const symbols = /(<=|>=|!=|>|<|=)/
		for (let subject of time_sub.subject) {
			const typePattern = new RegExp(subject.typePattern)
			const idPattern = new RegExp(subject.idPattern)
			let conditions = new Array
			conditions = subject.condition.split(";")
			let existing_types = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/types`).then(response => {
				return response.json()
			})
			existing_types = Object.values(existing_types)
			for (let type of existing_types) {
				if (typePattern.test(type)) {
					let entities = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities?type=${type}`).then(response => {
						return response.json()
					})
					for (let entity of entities) {
						if (idPattern.test(entity._id)) {
							for (let cond of conditions) {
								const condition = cond.split(symbols)
								true_condition = true_condition && await checkCondition(condition, entity).then(b => { return b })
							}
						}
					}
				}
			}
		}
	}
	let handler_sended = true
	if (time_sub.hasOwnProperty('handler') && true_condition) {
		for (let handler of time_sub.handler) {
			const idPattern = new RegExp(handler.id)
			let probably_handlers = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities?type=${handler["id"].split(":")[1]}`).then(response => {
				return response.json()
			})
			for (let hand of probably_handlers) {
				if (idPattern.test(hand._id)) {
					let handler_status = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities/${hand._id}/attrs/status`).then(response => {
						return response.json()
					})
					//console.log(handler_status)
					if(handler_status.value != handler.command)
					{
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
					}
					else handler_sended = false
					//console.log(handler_sended)
			}
			}
		}
	}
	if (time_sub.hasOwnProperty('notification') && true_condition && handler_sended) {
		let data = {}
		data["idSub"] = time_sub._id
		if(time_sub.hasOwnProperty("description")) data["nameSub"] = time_sub.description
		Object.assign(data, changes)
		//console.log(data)
		const notification_response = await fetch(time_sub.notification.url, {
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

module.exports = CreateTimeSub
