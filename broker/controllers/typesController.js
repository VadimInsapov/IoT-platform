const EntitySchema = require ("../mongodb/entitySchema.js")
const mongoose = require('mongoose')
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient('mongodb://127.0.0.1');
const fetch = require('node-fetch');
const { body } = require("express-validator/check");
const CheckTimeSub = require('../subs/timeSubs')
const CronJob = require('cron').CronJob;

class TypesController {
	async getAllTypes (req, res){
		try{
			client.connect().then(client =>
				client.db('diploma_try').listCollections().toArray())
				.then(cols => {
						let collection_names = new Array()
						for(let col of cols){
							collection_names.push(col.name)
						}
						res.send(collection_names)})
				.finally(() => client.close());
		} catch(e){
			res.send(`entities ${req.method} error`);
		}
	}

	async getType (req, res) {
		try{
			const time_sub = {
				"_id": "broker:subs:001",
				"subject": [
					{
						"idPattern": "broker:type4:00.",
						"typePattern": "type4",
						"attrs": [
							"attr1"
						],
						"condition": "attr1<100"
					}
				],
			}
			const job = new CronJob(`0 * * * * *`, CheckTimeSub(time_sub), 'Asia/Yekaterinburg');
			job.start();			
		}catch(e){
			res.send(`types type=${req.params.type} ${req.method} error`);
			console.log(e)
		}
	}
}

module.exports = new TypesController;
