const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {genreSchema} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		maxlength: 255
	},
	genre: {
		type: genreSchema,
		required: true
	},
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255
	}
}));

// validate data
function validateData(movies){
	const schema = Joi.object({
		title: Joi.string().required(),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number().min(0).required(),
		dailyRentalRate: Joi.number().min(0).required()
	});
	return schema.validate(movies);
}

exports.validateData = validateData;
exports.Movie = Movie;