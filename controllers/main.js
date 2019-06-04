//////////////////////////////
// CONTROLLER
//////////////////////////////

const express 	= require('express')
const Data		= require('../models/data.js')
const User		= require('../models/user.js')

const router 	= express.Router()

//////////////////////////////
// INDEX 
//////////////////////////////

router.get('/', (req, res) => {

	if (req.session.currentUser) {
		User.findOne({username: req.session.currentUser.username}, (err, userData) => {
			console.log(userData)
			res.render('index.ejs', {
				currentUser: req.session.currentUser,
				Data: userData.data
			})
		}).populate('data')
	} else {
		res.redirect('http://localhost:3000/users')
	}

})

//////////////////////////////
// NEW
//////////////////////////////

router.get('/new', (req, res) => {
	if (req.session.currentUser){
		res.render('new.ejs', {
			currentUser: req.session.currentUser
		})
	} else {
		res.redirect('http://localhost:3000/users')
	}
})

//////////////////////////////
// CREATE
//////////////////////////////

router.post('/', (req, res) => {
	Data.create(req.body, (err, createdData) => {
		User.findOneAndUpdate({username: req.session.currentUser.username}, {$push: {data: createdData.id}}, (err, foundUser) => {
		})
		res.redirect('http://localhost:3000/main')
	})
})

//////////////////////////////
// SHOW
//////////////////////////////

router.get('/:id', (req, res) => {
	if (req.session.currentUser){
		User.findOne({ username: req.session.currentUser.username }, (err, userData) => {
			if (userData.data.includes(req.params.id)) {
				Data.findById(req.params.id, (err, foundData) => {
					res.render('show.ejs', {
						currentUser: req.session.currentUser,
						Data: foundData
					})
				})
			} else {
				res.redirect('http://localhost:3000/main')
			}
		})
	} else {
		res.redirect('http://localhost:3000/users')
	}
})

//////////////////////////////
// EDIT
//////////////////////////////

router.get('/:id/edit', (req, res) => {
	if (req.session.currentUser){
		Data.findById(req.params.id, (err, foundData) => {
			res.render('edit.ejs', {
				currentUser: req.session.currentUser,
				Data: foundData
			})
		})
	} else {
		res.redirect('http://localhost:3000/users')
	}
})

//////////////////////////////
// UPDATE
//////////////////////////////

router.put('/:id', (req, res) => {
	Data.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateData) => {
		res.redirect('http://localhost:3000/main/' + req.params.id)
	})
})

//////////////////////////////
// DELETE
//////////////////////////////

router.delete('/:id', (req, res) => {
	Data.findByIdAndRemove(req.params.id, (err, removed) => {
		User.update({username: req.session.currentUser.username}, {$pullAll: {data: [req.params.id]}}, (err, updatedData) => {
			res.redirect('/main')
		})
	})
})

module.exports = router