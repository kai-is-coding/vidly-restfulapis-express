const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
const router = express.Router();
const {Rental, validateData} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

// CREATE
router.post('/', async (req,res) => {
	try{
		const {error} = validateData(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}
		// check if customer and movie exists
		const customer = await Customer.findById(req.body.customerId);
		const movie = await Movie.findById(req.body.movieId);
		if (!customer || !movie) {
			return res.status(400).send('Invalid customer or movie');
		}

		// check if movie is in stock
		if (movie.numberInStock === 0) {
			return res.status(400).send('This movie is out of stock!');	
		}
		let rental = new Rental({
			customer: {
				_id: customer._id,
				name: customer.name,
				phone: customer.phone
			},
			movie: {
				_id: movie._id,
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate
			}
		});
		rental = await rental.save();

		movie.numberInStock -= 1;
		movie.save();

		res.send(rental);
	}
	catch(err){console.warn(err.message);}
});

// READ
router.get('/', async (req,res) => {
	try{
		const rentals = await Rental.find().sort('-dateOut');
		res.send(rentals);
	}
	catch(err){console.warn(err.message);}
});

router.get('/:id', async (req,res) => {
	try{
		const rental = await Rental.findById(req.params.id);
		if (!rental) {
			return res.status(404).send('Could not find this rental. Please try again!');
		}
		res.send(rental);
	}
	catch(err){console.warn(err.message);}
});

// UPDATE
router.put('/:id', async (req,res) => {
	try{
		const {error} = validateData(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}
		// check if customer and movie exists
		const customer = await Customer.findById(req.body.customerId);
		const movie = await Movie.findById(req.body.movieId);
		if (!customer || !movie) {
			return res.status(400).send('Invalid customer or movie');
		}

		const rental = await Rental.findByIdAndUpdate(req.params.id, {
			customer: {
				_id: customer._id,
				name: customer.name,
				phone: customer.phone
			},
			movie: {
				_id: movie._id,
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate
			}
		});
	}
	catch(err){console.warn(err.message);}
});

// DELETE
router.delete('/:id', async (req,res) => {
	try{

	}
	catch(err){console.warn(err.message);}
});

module.exports = router;
