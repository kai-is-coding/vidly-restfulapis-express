const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const express = require('express');
const router = express.Router();
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
function validateDate(customers){
	const schema = Joi.object({
		name: Joi.string().min(3).max(10).required(),
		phone: Joi.number().required(),
		isGold: Joi.boolean()
	});
	return schema.validate(customers);
}

// CREATE
router.post('/', async (req, res) => {
	// validate input data
	const {error} = validateDate(req.body);
	if (error) {
		res.status(400).send(error.details[0].message);
	}
	let customer = new Customer({
		name: req.body.name,
		phone: req.body.phone,
		isGold: req.body.isGold
	})
	try{
		customer = await customer.save();
		res.send(customer);
	}
	catch(err){console.warn(err.message)};
});

// READ
router.get('/', async (req, res) => {
	try{
		const customers = await Customer.find().sort('name');
		res.send(customers);
	}
	catch(err){console.warn(err.message)};
});

router.get('/:id', async (req, res) => {
	try{
		const customer = await Customer.findById(req.params.id);
		if (!customer) {
			return res.status(404).send('Could not find this customer. Please try again!')
		}
		res.send(customer);
	}
	catch(err){console.warn(err.message)};
});

// UPDATE
router.put('/:id', async (req, res) => {
	// validate input data
	const {error} = validateDate(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	try{
		const customer = await Customer.findByIdAndUpdate(req.params.id, {
			name: req.body.name,
			phone: req.body.phone,
			isGold: req.body.isGold
		}, {new: true});
	
		// check if the customer exists
		if (!customer) {
			return res.status(404).send('Could not find this customer. Please try again!')
		}
		res.send(customer);
	}
	catch(err){console.warn(err.message)};
});

// DELTE
router.delete('/:id', async (req, res) => {

	try{
		const customer = await Customer.findOneAndRemove(req.params.id);
		// check if the customer exists
		if (!customer) {
			return res.status(404).send('Could not find this customer. Please try again!')
		}
		res.send(customer);
	}
	catch(err){console.warn(err.message)};
});

module.exports = router;