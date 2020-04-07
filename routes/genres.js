const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');


const Genre = mongoose.model('Genre', new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	}
}));

// check data if valid function
function validateData(genres) {
	const schema = Joi.object({
		name: Joi.string().alphanum().min(3).max(10).required()
	});
	return schema.validate(genres);
};

//CREATE
router.post('/', async (req, res) => {
	//validate data, if error status = 400
	const {error} = validateData(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	let genre = new Genre({
		name: req.body.name
	});

	genre = await genre.save();
	res.send(genre);
});

//READ
router.get('/', async (req, res) => {
	const genres = await Genre.find().sort('name');
	res.send(genres);	
});

router.get('/:id', async (req, res) => {
	//check if data exists, if no status = 404
	const genre = await Genre.findById(req.params.id);

	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}
	//send data
	return res.send(genre);
});

//UPDATE
router.put('/:id', async (req, res) => {

	//validate data
	const {error} = validateData(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
		new: true
	});
	//check if data exists, if no, status = 404
	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}

	//Update data
	res.send(genre);
});

//DELETE
router.delete('/:id', async (req, res) => {
	const genre = await Genre.findByIdAndRemove(req.params.id);
	//check if data exists, if no, status = 404
	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}
	res.send(genre);
});
module.exports = router;