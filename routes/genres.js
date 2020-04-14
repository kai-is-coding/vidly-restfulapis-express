const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validate = require('../middleware/validateData');

const validateObjectId = require('../middleware/validateObjectId');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
const router = express.Router();
const {Genre, validateData} = require('../models/genre');

//CREATE
router.post('/', [auth, validate(validateData)], async (req, res, next) => {
		const genre = new Genre({
			name: req.body.name
		});
		await genre.save();

		res.send(genre);
});

//READ
router.get('/', async (req, res) => {

	// throw new Error('Could not get the genres.');

	// try{
		const genres = await Genre.find().sort('name');
		res.send(genres);	
	// }
	// catch(err){console.warn(err.message)};
	});

router.get('/:id', validateObjectId, async (req, res) => {
	// try{
		//check if data exists, if no status = 404
		const genre = await Genre.findById(req.params.id);
	
		if (!genre) {
			return res.status(404).send('The genre does not exist! Try another one...');
		}
		//send data
		res.send(genre);
	// }
	// catch(err){console.warn(err.message)};
});

//UPDATE
router.put('/:id', [auth, validateObjectId, validate(validateData)], async (req, res) => {
	// try{

		const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
			new: true
		});
		//check if data exists, if no, status = 404
		if (!genre) {
			return res.status(404).send('The genre does not exist! Try another one...');
		}
	
		//Update data
		res.send(genre);
	// }
	// catch(err){console.warn(err.message)};
});

//DELETE
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
	// try{
		const genre = await Genre.findByIdAndRemove(req.params.id);
		//check if data exists, if no, status = 404
		if (!genre) {
			return res.status(404).send('The genre does not exist! Try another one...');
		}
		res.send(genre);
	// }
	// catch(err){console.warn(err.message)};
});
module.exports = router;