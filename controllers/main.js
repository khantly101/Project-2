//////////////////////////////
// CONTROLLER
//////////////////////////////

const express 	= require('express')
const model 	= require('../models/refill.js')

const router 	= express.Router()

//////////////////////////////
// INDEX 
//////////////////////////////

router.get('/', (req, res) => {
	if (req.session.currentUser){
		res.render('index.ejs', {
			currentUser: req.session.currentUser
		})
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

})

//////////////////////////////
// SHOW
//////////////////////////////

router.get('/:id', (req, res) => {
	if (req.session.currentUser){
		res.render('show.ejs', {
			currentUser: req.session.currentUser
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
		res.render('edit.ejs', {
			currentUser: req.session.currentUser
		})
	} else {
		res.redirect('http://localhost:3000/users')
	}
})

//////////////////////////////
// UPDATE
//////////////////////////////

router.put('/:id', (req, res) => {

})

//////////////////////////////
// DELETE
//////////////////////////////

router.delete('/:id', (req, res) => {
	
})

module.exports = router