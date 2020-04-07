const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
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

exports.Genre = Genre;
exports.validateData = validateData;