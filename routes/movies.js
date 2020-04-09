const auth = require('../middleware/auth');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
const router = express.Router();
const {Movie, validateData} = require('../models/movie');
const {Genre} = require('../models/genre');

// CREATE
router.post('/', auth, async (req, res) => {
	try{
		const {error} = validateData(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}
		const genre = await Genre.findById(req.body.genreId);
		if (!genre) {
			return res.status(400).send('Invalid Genre!');
		}

		const movie = new Movie({
			title: req.body.title,
			genre: {
				_id: genre._id,
				name: genre.name
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate
		});

		await movie.save();
		res.send(movie);
	}
	catch(err){console.warn(err.message);}
});

// READ
router.get('/', async (req, res) => {
	try{
		const movies = await Movie.find().sort('title');
		res.send(movies);
	}
	catch(err){console.warn(err.message);}
});

router.get('/:id', async (req, res) => {
	try{
		const movie = Movie.findById(req.params.id);
		if (!movie) {
			return res.status(404).send('Could not find this movie. Please try again!');
		}
		res.send(movie);
	}
	catch(err){console.warn(err.message);}
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
	try{
		const {error} = validateData(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		const genre = await Genre.findById(req.body.genreId);
		if (!genre) {
			return res.status(400).send('Invalid Genre!');
		}

		const movie = await Movie.findByIdAndUpdate(req.params.id, {
			title: req.body.title,
			genre: {
				_id: genre._id,
				name: genre.name
			},
			numberInStock: req.body.numberInStock,
			dailyRentalRate: req.body.dailyRentalRate
		}, {new: true});

		if (!movie) {
			return res.status(404).send('Could not find this movie. Please try again!');
		}

		res.send(movie);
	}
	catch(err){console.warn(err.message);}
})

// DELETE
router.delete('/:id', auth, async (req, res) => {
	try{
		const movie = await Movie.findByIdAndRemove(req.params.id);

		if (!movie) {
			return res.status(404).send('Could not find this movie. Please try again!');
		}

		res.send(movies);
	}
	catch(err){console.warn(err.message);}
});

module.exports = router;