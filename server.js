//////////////////////////////
// CONTROLLER
//////////////////////////////
require('dotenv').config()

const express 			= require('express')
const mongoose 			= require('mongoose')
const methodOverride 	= require('method-override')
const session			= require('express-session')

// const controller 	= require('./controller/.js')

const app 				= express()
const port 				= process.env.PORT

//////////////////////////////
// MONGOOSE
//////////////////////////////

mongoose.connect('mongodb://localhost:27017/project-2', {useNewUrlParser: true})
mongoose.set('useFindAndModify', false)
mongoose.connection.once('open', () => {
	console.log('connected to mongo')
})

//////////////////////////////
// MIDDLEWARE
//////////////////////////////

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('./public'))

// app.use('/', controller)


//////////////////////////////
// LISTEN
//////////////////////////////

app.listen(port, () => {
	console.log('Listening at port: ', port)
})