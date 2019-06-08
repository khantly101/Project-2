//////////////////////////////
// CONTROLLER
//////////////////////////////
require('dotenv').config()

const express 			= require('express')
const mongoose 			= require('mongoose')
const methodOverride 	= require('method-override')
const session			= require('express-session')
const controllerMain 	= require('./controllers/main.js')
const controllerUser	= require('./controllers/user.js')

const app 				= express()
const port 				= process.env.PORT || 3000
const MONGODB_URI		= process.env.MONGODB_URI || 'mongodb://localhost:27017/project-2'

//////////////////////////////
// MONGOOSE
//////////////////////////////

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connection.once('open', () => {
	console.log('connected to mongo')
})

//////////////////////////////
// MIDDLEWARE
//////////////////////////////

app.use(session({
	secret: "potato",
	resave: false,
	saveUninitialized: false
}))

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('./public'))
app.use('/main', controllerMain)
app.use('/users', controllerUser)

//////////////////////////////
// Index
//////////////////////////////

app.get('/', (req, res) => {
	res.redirect('/main')
})

//////////////////////////////
// LISTEN
//////////////////////////////

app.listen(port, () => {
	console.log('Listening at port: ', port)
})
