const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 10
	},
	phone: {
		type: Number,
		required: true,
		length: 6
	},
	isGold: {
		type: Boolean,
		default: false
	}
}));

// validate input data
function validateData(customers){
	const schema = Joi.object({
		name: Joi.string().min(3).max(10).required(),
		phone: Joi.number().required(),
		isGold: Joi.boolean()
	});
	return schema.validate(customers);
}

exports.Customer = Customer;
exports.validateData = validateData;