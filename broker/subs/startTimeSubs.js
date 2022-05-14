const fetch = require('node-fetch');
const CreateTimeSub = require('./timeSubs')

async function StartTimeSubs(){
	let entities = await fetch(`http://127.0.0.1:5500/iot/entities?type=time_subs`).then(response =>{
		return response.json()
	})
	for(let time_sub of entities)
	{
		CreateTimeSub(time_sub)
	}

}

module.exports = StartTimeSubs
