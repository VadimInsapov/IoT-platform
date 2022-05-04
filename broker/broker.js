const express = require('express');
const mongoose = require('mongoose');
const broker = express();
const router = require('./routes/routes')
const entitiesRouter = require('./routes/entitiesRoute')
const expressValidator = require('express-validator')
const jsonParser = express.json();
const {MongoClient} = require('mongodb')

const PORT = 5500
const DB = 'mongodb://127.0.0.1/diploma_try'
const client = new MongoClient('mongodb://127.0.0.1', { useUnifiedTopology: true });

broker.use(jsonParser)
broker.use(expressValidator())
broker.use('/v2', router)
broker.use("/entities", entitiesRouter);


const start = async ()=>{
	try{
		await mongoose.connect(DB, { useUnifiedTopology: true }) 
		broker.listen(PORT, () => console.log('broker is running'));
	} catch (e){
			console.log(e);
	}
}

start();
