//////////////////////////////
// CONTROLLER
//////////////////////////////

const express 	= require('express')
const bcrypt 	= require('bcrypt')
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
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
	User.create(req.body, (err, createdUser) => {
		res.redirect('http://localhost:3000/main')
	})
})

//////////////////////////////
// LOGIN
//////////////////////////////

router.post('/login', (req, res) => {
	User.findOne({ username: req.body.username }, (err, foundUser) => {
		if ( bcrypt.compareSync(req.body.password, foundUser.password)) {
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
		res.redirect('http://localhost:3000/users')
	})
})

module.exports = router