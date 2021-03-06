//////////////////////////////
// CONTROLLER
//////////////////////////////
require('dotenv').config()

const express	= require('express')
const Data		= require('../models/data.js')
const User		= require('../models/user.js')

const router	= express.Router()

const API		= process.env.API

//////////////////////////////
// INDEX 
//////////////////////////////

router.get('/', (req, res) => {

	if (req.session.currentUser) {
		User.findOne({username: req.session.currentUser.username}, (err, userData) => {

			let avgMpg = 0
			let avgPMile = 0
			let totalCost = 0
			let totalGal = 0
			let bestMpg = 0
			let lastMpg = 0
			let lineData = [{"x" : 0, "y" : 0}]
			let brandData = [{"Brand" : "Shell", "presses": 0}, {"Brand" : "Chevron", "presses": 0}, {"Brand" : "Valero", "presses": 0}, {"Brand" : "Texaco", "presses": 0}, {"Brand" : "ARCO", "presses": 0}, {"Brand" : "76", "presses": 0}]

			userData.data.forEach((ele, index) => {
				let milesPerGal = 0
				totalCost += ele.total
				totalGal += ele.gallons

				let brandInd = brandData.findIndex((elem) => {return elem.Brand === ele.brand})
				if (brandInd !== -1) {
					brandData[brandInd].presses += 1
				} else {
					brandData.push({"Brand" : ele.brand , "presses" : 1})
				}

				if (index !== 0) {
					milesPerGal = (userData.data[index].odometer - userData.data[index - 1].odometer)/userData.data[index-1].gallons
					lineData.push({"x" : index, "y" : Math.floor(milesPerGal)})
					lastMpg = (userData.data[index].odometer - userData.data[index - 1].odometer)/userData.data[index-1].gallons
				}

				if (milesPerGal > bestMpg) {
					 bestMpg = milesPerGal
				}
			})

			if (userData.data[userData.data.length - 1]) {
				avgMpg = (userData.data[userData.data.length - 1].odometer - userData.data[0].odometer) / totalGal
				avgPMile = totalCost / (userData.data[userData.data.length - 1].odometer - userData.data[0].odometer)
			} else {
				avgMpg = "Not enough Data"
				avgPMile = "Not enough Data"
			}

			let avgPrice = totalCost / totalGal
			let avgFuelup = totalCost / (userData.data.length - 1)
			let totalLogs = userData.data.length

			res.render('index.ejs', {
				currentUser: req.session.currentUser,
				Data: userData.data,
				totalCost: Math.round(totalCost * 100) / 100,
				totalGal: Math.floor(totalGal),
				bestMpg: Math.round(bestMpg * 100) / 100,
				lastMpg: Math.round(lastMpg * 100) / 100,
				lineData: lineData,
				brandData: brandData,
				avgMpg: Math.round(avgMpg * 100) / 100,
				avgPrice: Math.round(avgPrice * 100) / 100,
				avgFuelup: Math.round(avgFuelup * 100) / 100,
				avgPMile: Math.round(avgPMile * 100) /100,
				totalLogs: totalLogs
			})
		}).populate('data')
	} else {
		res.redirect('../users')
	}

})

//////////////////////////////
// Map
//////////////////////////////

router.get('/map', (req, res) => {
	if (req.session.currentUser){
			res.render('map.ejs', {
				currentUser: req.session.currentUser,
				API: API
			})
	} else {
		res.redirect('../users')
	}
})

//////////////////////////////
// NEW
//////////////////////////////

router.get('/new', (req, res) => {
	if (req.session.currentUser){
		User.findOne({ username: req.session.currentUser.username }, (err, userData) => {
			res.render('new.ejs', {
				currentUser: req.session.currentUser,
				Brands: userData.userBrands
			})
		})
	} else {
		res.redirect('../users')
	}
})

//////////////////////////////
// CREATE
//////////////////////////////

router.post('/', (req, res) => {
	Data.create(req.body, (err, createdData) => {
		User.findOneAndUpdate({username: req.session.currentUser.username}, {$push: {data: createdData.id}}, (err, foundUser) => {
		})
		res.redirect('/')
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
				res.redirect('/')
			}
		})
	} else {
		res.redirect('../users')
	}
})

//////////////////////////////
// EDIT
//////////////////////////////

router.get('/:id/edit', (req, res) => {
	if (req.session.currentUser){
		Data.findById(req.params.id, (err, foundData) => {
			User.findOne({ username: req.session.currentUser.username }, (err, userData) => {
				res.render('edit.ejs', {
					currentUser: req.session.currentUser,
					Brands: userData.userBrands,
					Data: foundData
				})
			})
		})
	} else {
		res.redirect('../users')
	}
})

//////////////////////////////
// UPDATE
//////////////////////////////

router.put('/:id', (req, res) => {
	Data.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updateData) => {
		res.redirect('/main/' + req.params.id)
	})
})

//////////////////////////////
// DELETE
//////////////////////////////

router.delete('/:id', (req, res) => {
	Data.findByIdAndRemove(req.params.id, (err, removed) => {
		User.update({username: req.session.currentUser.username}, {$pullAll: {data: [req.params.id]}}, (err, updatedData) => {
			res.redirect('/')
		})
	})
})

module.exports = router