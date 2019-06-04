const mongoose 	= require('mongoose')
const Schema 	= mongoose.Schema

const DataSchema = Schema({
	odometer	:	Number,
	type		:	String,
	gallons		:	Number,
	total		:	Number,
	pergal		:	Number,
	date		:	Date,
	location	:	String,
})

const Data = mongoose.model('data', DataSchema)

module.exports = Data