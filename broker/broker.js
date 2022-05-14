const express = require('express');
const mongoose = require('mongoose');
const broker = express();
const router = require('./routes/routes')
const expressValidator = require('express-validator')
const jsonParser = express.json();
const StartTimeSubs = require('./subs/startTimeSubs')

const PORT = 5500
const DB = 'mongodb://127.0.0.1/diploma_try'

broker.use(jsonParser)
broker.use(expressValidator())
broker.use('/iot', router)

const start = async ()=>{
	try{
		await mongoose.connect(DB, { useUnifiedTopology: true }) 
		broker.listen(PORT, () => console.log('broker is running'));
		await StartTimeSubs();
	} catch (e){
			console.log(e);
	}
}

start();
