const EntitySchema = require("../mongodb/entitySchema.js")
const mongoose = require('mongoose')
const { validationResult } = require('express-validator/check');
const sendResponseWithErrors = (response, errors) => response.status(400).json({ errors: errors.array() });
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient('mongodb://127.0.0.1');
const checkSubscriptions = require('../subs/checkSubs.js')

class EntitiesController {
	async getAllEntities(req, res) {
		try {
			let collection_names = new Array()
			if (req.query.hasOwnProperty("type")) {
				collection_names = req.query.type.split(",")
			}
			else {
				collection_names =
					await client.connect().then(client =>
						client.db('things').listCollections().toArray())
						.then(async cols => {
							let collections = new Array()
							for (let col of cols) {
								collections.push(col.name)
							}
							return collections
						})
						.finally(() => client.close());
				collection_names.splice(collection_names.indexOf("subs"), 1)
				collection_names.splice(collection_names.indexOf("time_subs"), 1)
			}
			let entities = new Array()
			for (let collection of collection_names) {
				var EntityModel = mongoose.model(collection, EntitySchema)
				const entitiesOfType = await EntityModel.find().lean()
				entities = entities.concat(entitiesOfType)
			}
			res.send(entities)
		} catch (e) {
			res.send(`entities ${req.method} error`);
		}
	}

	async createEntity(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else {
			const { type, attributes } = req.body;
			var EntityModel = mongoose.model(type, EntitySchema)
			const last_entity = await EntityModel.find().sort({ _id: -1 }).limit(1).lean();
			let empty_object = true;
			for (let key in last_entity) {
				empty_object = false;
				break;
			}
			let _id = ""
			if (empty_object) _id = "broker:" + type + ":001"
			else {
				const id_num = Number(last_entity[0]._id.split(':')[2]) + 1
				if (id_num < 10) {
					_id = "broker:" + type + ":00" + id_num
				}
				else if (id_num < 100) {
					_id = "broker:" + type + ":0" + id_num
				}
				else _id = "broker:" + type + ":" + id_num
			}
			EntityModel.findById(_id).exec(function (err, found_entity) {
				if (err) { return next(err); }
				if (found_entity) {
					res.send("entity already exist");
				}
				else {
					let entity = {
						"_id": _id,
					}
					for (let attr of attributes) {
						entity = Object.assign(entity, attr)
					}
					console.log(entity);
					EntityModel.create(entity);
					res.send(entity)
				}
			});
		}
	}

	async getEntity(req, res) {
		try {
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById(req.params.id, '-__v')
			return res.json(entity)
		} catch (e) {
			res.send(`entities id=${req.params.id} ${req.method} error`);
		}
	}

	async deleteEntity(req, res) {
		try {
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findByIdAndDelete(req.params.id)
			return res.json(entity)
		} catch (e) {
			res.send(`entities id=${req.params.id} ${req.method} error`);
		}
	}

	async getEntityAttributes(req, res) {
		try {
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const attributes = await EntityModel.findById(req.params.id, '-_id -__v')
			return res.json(attributes)
		} catch (e) {
			res.send(`entities id=${req.params.id} attrs ${req.method} error`);
		}
	}

	async replaceAllEntityAttributes(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else {
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			let new_entity = {
				"_id": req.params.id
			}
			new_entity = Object.assign(new_entity, req.body)
			await EntityModel.replaceOne({ _id: req.params.id }, new_entity)
			let changes = new_entity
			checkSubscriptions(changes)
			res.send(new_entity)
		}
	}

	async updateOrAppendEntityAttributes(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else {
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({ _id: req.params.id }).lean()
			let changes = { _id: req.params.id }
			for (let attr in req.body) {
				entity[attr] = req.body[attr]
				changes[attr] = req.body[attr]
			}
			await EntityModel.replaceOne({ _id: req.params.id }, entity)
			checkSubscriptions(changes)
			res.send(entity)
		}
	}

	async updateExistingEntityAttributes(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else {
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({ _id: req.params.id }).lean()
			let changes = { _id: req.params.id }
			for (let attr in req.body) {
				if (attr in entity) {
					entity[attr] = req.body[attr]
					changes[attr] = req.body[attr]
				}
			}
			await EntityModel.replaceOne({ _id: req.params.id }, entity)
			checkSubscriptions(changes)
			res.send(entity)
		}
	}
}

module.exports = new EntitiesController
