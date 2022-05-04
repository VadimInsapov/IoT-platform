const EntitySchema = require ("../mongodb/entitySchema.js")
const mongoose = require('mongoose')
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient('mongodb://127.0.0.1');

class TypesController {
	//no
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
			var EntityModel = mongoose.model(req.params.type, EntitySchema)
			const entities = await EntityModel.find()
			return res.json(entities)
		}catch(e){
			res.send(`types type=${req.params.type} ${req.method} error`);
		}
	}
}

module.exports = new TypesController;
