const mongoose 	= require('mongoose')
const Schema 	= mongoose.Schema

const UserSchema = Schema({
	username	:	{type: String, required: true, unique: true},
	password	:	{type: String, required: true},
	data		:	[String]
})

const User = mongoose.model('user', UserSchema)

module.exports = User