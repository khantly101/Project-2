//////////////////////////////
// CONTROLLER
//////////////////////////////

const express 	= require('express')
const bcrypt 	= require('bcrypt')
const User 		= require('../models/user.js')

const router 	= express.Router()
//////////////////////////////
// Variable
//////////////////////////////

let wrongpass = false
let usernameInUse = false
let missingText = false

//////////////////////////////
// NEW
//////////////////////////////

router.get('/', (req, res) => {

	let passMessage = ""
	let userMessage = ""
	let missMessage = ""

	if (usernameInUse === true) {
		userMessage = "Username already in Use"
	}

	if (missingText === true) {
		missMessage = "Please enter name or password"
	}

	if (wrongpass === true) {
		passMessage = "Wrong password"
	}
	res.render('user.ejs', {
		PassMessage : passMessage,
		MissMessage : missMessage,
		UserMessage : userMessage
	})
})

//////////////////////////////
// CREATE
//////////////////////////////

router.post('/', (req, res) => {

	if (req.body.password) {
		req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
	}

	User.create(req.body, (err, createdUser) => {
		wrongpass = false
			console.log(err)
		if (err.name === "MongoError") {
			missingText = false
			usernameInUse = true
			res.redirect('http://localhost:3000/users')
		} else if (err.name === "ValidationError") {
			console.log(err)
			usernameInUse = false
			missingText = true
			res.redirect('http://localhost:3000/users')
		} else {
			usernameInUse = false
			missingText = false
			res.redirect('http://localhost:3000/users')
		}
	})
})

//////////////////////////////
// LOGIN
//////////////////////////////

router.post('/login', (req, res) => {

	usernameInUse = false
	missingText = false

	User.findOne({ username: req.body.username }, (err, foundUser) => {
		if ( bcrypt.compareSync(req.body.password, foundUser.password)) {
			req.session.currentUser = foundUser
			wrongpass = false
			res.redirect('http://localhost:3000/main')
		} else {
			wrongpass = true
			res.redirect('http://localhost:3000/users')
		}
	})
})

//////////////////////////////
// EDIT
//////////////////////////////

// router.get('/id/edit', (req, res) => {

// })

//////////////////////////////
// UPDATE
//////////////////////////////

// router.put('/:id', (req, res) => {

// })

//////////////////////////////
// LOG OUT
//////////////////////////////

router.delete('/', (req, res) => {
	req.session.destroy(() => {
		res.redirect('http://localhost:3000/users')
	})
})

module.exports = router