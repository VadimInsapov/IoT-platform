require('dotenv').config()
const CronJob = require('cron').CronJob;
const fetch = require('node-fetch');
const checkCondition = require('./checkCondition')

function CreateTimeSub(time_sub) {
	const job = new CronJob(`0 ${time_sub.time.split(':')[1]} ${time_sub.time.split(':')[0]} * * *`, () => CheckTimeSub(time_sub), 'Asia/Yekaterinburg');
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
	if (time_sub.hasOwnProperty('handler') && true_condition) {
		let data = {}
		// data[sub.handler.command] = {
		// 	type: "command",
		// 	value: ""
		// 	// type: "number",
		// 	// value: 0
		// }
		data[id]=sub.handler.id
		data[command]=sub.handler.command
		const handler_response = await fetch(`http://${process.env.LOCALHOST}:${process.env.COMMAND_PORT}/update`, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(data)
		}).then(response => {
			return response.json()
		})
	}
	if (time_sub.hasOwnProperty('notification') && true_condition) {
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

module.exports = CreateTimeSub
