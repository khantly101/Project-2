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

const UserSchema = Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	data: [DataSchema]
})

const User = mongoose.model('user', UserSchema)

module.exports = User