require('dotenv').config()
const fetch = require('node-fetch');
const CreateTimeSub = require('./timeSubs')

async function StartTimeSubs() {
	let entities = await fetch(`http://${process.env.LOCALHOST}:${process.env.PORT}/iot/entities?type=time_subs`).then(response => {
		return response.json()
	})
	for (let time_sub of entities) {
		CreateTimeSub(time_sub)
	}
}

module.exports = StartTimeSubs
