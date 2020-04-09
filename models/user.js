const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

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

userSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({_id: this._id}, config.get('jwtPrivateKey'));
	return token;
}

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