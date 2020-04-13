const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	}
})
const Genre = mongoose.model('Genre', genreSchema);

// check data if valid function
function validateData(genres) {
	const schema = Joi.object({
		name: Joi.string().alphanum().min(5).max(50).required()
	});
	return schema.validate(genres);
};

exports.Genre = Genre;
exports.validateData = validateData;
exports.genreSchema = genreSchema;