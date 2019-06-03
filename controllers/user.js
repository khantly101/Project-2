//////////////////////////////
// CONTROLLER
//////////////////////////////

const express 	= require('express')
const User 		= require('../models/user.js')

const router 	= express.Router()

//////////////////////////////
// NEW
//////////////////////////////

router.get('/', (req, res) => {
	res.render('user.ejs')
})

//////////////////////////////
// CREATE
//////////////////////////////

router.post('/', (req, res) => {
	User.create(req.body, (err, createdUser) => {
		res.redirect('http://localhost:3000/main')
	})
})

//////////////////////////////
// LOGIN
//////////////////////////////

router.post('/', (req, res) => {
	User.findOne({ username: req.body.username }, (err, foundUser) => {
		if (req.body.password === foundUser.password) {
			req.session.currentUser = foundUser
			res.redirect('http://localhost:3000/main')
		} else {
			res.send('wrong password')
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
// DELETE
//////////////////////////////

router.delete('/', (req, res) => {
	req.session.destroy(() => {
		res.redirect('/')
	})
})

module.exports = router