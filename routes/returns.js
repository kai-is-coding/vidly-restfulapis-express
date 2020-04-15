const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const validate = require('../middleware/validateData');
const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

function validateData(returns) {
	const schema = Joi.object({
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required()
	});
	return schema.validate(returns);
}

router.post('/', [auth, validate(validateData)], async (req, res) => {
	
	const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
	
	if (!rental) {
		return res.status(404).send('Rental not find.')
	}
	if (rental.dateReturned) {
		return res.status(400).send('The rental has been processed.');
	}
	rental.return();
	await rental.save();

	await Movie.findByIdAndUpdate(req.body.movieId, {
		$inc: {numberInStock: 1}
	});
	
	return res.send(rental);
});

module.exports = router;