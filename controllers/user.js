//////////////////////////////
// CONTROLLER
//////////////////////////////

const express 	= require('express')
const bcrypt 	= require('bcrypt')
const Data		= require('../models/data.js')
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

	let standin = {username: ""}

	res.render('user.ejs', {
		PassMessage : passMessage,
		MissMessage : missMessage,
		UserMessage : userMessage, 
		currentUser : standin
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
		if (err) {
			if (err.name === "MongoError") {
				missingText = false
				usernameInUse = true
				res.redirect('/')
			} else if (err.name === "ValidationError") {
				usernameInUse = false
				missingText = true
				res.redirect('/')
			}
		} else {
			usernameInUse = false
			missingText = false
			res.redirect('/')
		}
	})
})

//////////////////////////////
// LOGIN
//////////////////////////////

router.post('/login', (req, res) => {

	usernameInUse = false
	missingText = false
	console.log("point1")
	if (req.body.password) {
		console.log("point2")
		User.findOne({ username: req.body.username }, (err, foundUser) => {
			console.log("point3")
			if (foundUser) {
				if ( bcrypt.compareSync(req.body.password, foundUser.password)) {
					req.session.currentUser = foundUser
					wrongpass = false
					console.log("point4")
					res.redirect('../main')
				} else {
					console.log("point5")
					wrongpass = true
					res.redirect('/')
				}
			} else {
				console.log("point6")
				wrongpass = true
				res.redirect('/')
			}
		})
	} else {
		console.log("point7")
		wrongpass = true
		res.redirect('/')
	}
})

//////////////////////////////
// Profile
//////////////////////////////

router.get('/:id', (req, res) => {

	let passMessage = "" 

	if (wrongpass === true) {
		passMessage = "Wrong password"
	}

	if (req.session.currentUser) {
		if (req.params.id === req.session.currentUser.username) {
			res.render('profile.ejs', {
				currentUser: req.session.currentUser,
				PassMessage : passMessage
			})
		} else {
			res.redirect('../main')
		}
	} else {
		res.redirect('/')
	}

})

//////////////////////////////
// UPDATE
//////////////////////////////

router.post('/:id', (req, res) => {

	if (req.body.password) {
		if (req.body.newpassword) {
			let newpassword = bcrypt.hashSync(req.body.newpassword, bcrypt.genSaltSync(10))

			User.findOne({ username: req.session.currentUser.username }, (err, foundUser) => {
				if ( bcrypt.compareSync(req.body.password, foundUser.password)) {
					User.findOneAndUpdate({ username: req.session.currentUser.username }, { password: newpassword}, (err, foundUser) => {
						wrongpass = false
						res.redirect('../main')
					})
				} else {
					wrongpass = true
					res.redirect('/' + foundUser.username)
				}
			}) 
		} else {
			wrongpass = true
			res.redirect('/' + foundUser.username)
		}
	} else {
		wrongpass = true
		res.redirect('/' + foundUser.username)
	}
})

//////////////////////////////
// LOG OUT
//////////////////////////////

router.delete('/', (req, res) => {
	wrongpass = false
	usernameInUse = false
	missingText = false

	req.session.destroy(() => {
		res.redirect('/')
	})
})

module.exports = router