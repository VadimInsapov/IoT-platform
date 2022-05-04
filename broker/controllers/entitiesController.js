const EntitySchema = require ("../mongodb/entitySchema.js")
const mongoose = require('mongoose')
const {validationResult} = require('express-validator/check');
const sendResponseWithErrors = (response, errors) => response.status(400).json({errors: errors.array()});
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient('mongodb://127.0.0.1');

class EntitiesController {
	async getAllEntities (req, res) {
		try{ res.send(`entities ${req.method} `)
		} catch(e){
			res.send(`entities ${req.method} error`);
		}
	}	

	async createEntity (req, res, next) {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				sendResponseWithErrors(res, errors);
				return;
			}
			else
			{
				const {_id, attributes} = req.body;
				const type = _id.split(':')[1];
				var EntityModel = mongoose.model(type, EntitySchema)
				EntityModel.findById(_id) .exec( function(err, found_entity) {
					if (err) { return next(err); }
						if (found_entity) {
							res.send("entity already exist");
							}
						else {
							let entity = {
								"_id": _id
							}
							for(let attr of attributes){
								entity = Object.assign(entity, attr)
							}
							EntityModel.create(entity);
							res.send(entity)
						}
				});
			}
	}

	async getEntity (req, res) {
		try{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById(req.params.id, '-__v')
			return res.json(entity)
		} catch(e){
			res.send(`entities id=${req.params.id} ${req.method} error`);
		}
	} 

	async deleteEntity (req, res) {
		try{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findByIdAndDelete(req.params.id)
			return res.json(entity)
		} catch(e){
			res.send(`entities id=${req.params.id} ${req.method} error`);
		}
	}

	async getEntityAttributes (req, res) {
		try{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const attributes = await EntityModel.findById(req.params.id, '-_id -__v')
			return res.json(attributes)
		} catch(e){
			res.send(`entities id=${req.params.id} attrs ${req.method} error`);
		}
	}

	async replaceAllEntityAttributes (req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			let new_entity = {
				"_id": req.params.id
			}
			new_entity = Object.assign(new_entity, req.body)
			await EntityModel.replaceOne({_id: req.params.id}, new_entity)
			res.send(new_entity)
		}
	}

	async updateOrAppendEntityAttributes (req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({_id: req.params.id}).lean()
			for(let attr in req.body)
			{
					entity[attr] = req.body[attr]
			}
			await EntityModel.replaceOne({_id: req.params.id}, entity)
			res.send(entity)
		}
	}

	async updateExistingEntityAttributes (req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			sendResponseWithErrors(res, errors);
			return;
		}
		else{
			const type = req.params.id.split(':')[1];
			var EntityModel = mongoose.model(type, EntitySchema)
			const entity = await EntityModel.findById({_id: req.params.id}).lean()
			for(let attr in req.body)
			{
				if(attr in entity)
				{
					entity[attr] = req.body[attr]
				}
			}
			await EntityModel.replaceOne({_id: req.params.id}, entity)
			res.send(entity)
		}
	}
}

module.exports = new EntitiesController

