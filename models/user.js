const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

// Create Schema
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
		maxlength: 255
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 5,
		maxlength: 255
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		maxlength: 1024,
		trim: true
	}
});

// Create Model
const User = new mongoose.model('User', userSchema);

// Validate input data
function validateData(user){
	const schema = Joi.object({
		name: Joi.string().min(5).max(255).required(),
		email: Joi.string().min(5).max(255).email().required(),
		password: Joi.string().min(6).max(1024).required()
	});
	return schema.validate(user);
}

exports.User = User;
exports.validateData = validateData;