const auth = require('../middleware/auth');
const validate = require('../middleware/validateData');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const express = require('express');
const router = express.Router();

const {Customer, validateData} = require('../models/customer');

// CREATE
router.post('/', [auth, validate(validateData)], async (req, res) => {
	// try{
		const customer = new Customer({
			name: req.body.name,
			phone: req.body.phone,
			isGold: req.body.isGold
		})

		await customer.save();
		res.send(customer);
	// }
	// catch(err){console.warn(err.message)};
});

// READ
router.get('/', async (req, res) => {
	// try{
		const customers = await Customer.find().sort('name');
		res.send(customers);
	// }
	// catch(err){console.warn(err.message)};
});

router.get('/:id', async (req, res) => {
	// try{
		const customer = await Customer.findById(req.params.id);
		if (!customer) {
			return res.status(404).send('Could not find this customer. Please try again!')
		}
		res.send(customer);
	// }
	// catch(err){console.warn(err.message)};
});

// UPDATE
router.put('/:id', [auth, validate(validateData)], async (req, res) => {
	// try{
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
	// }
	// catch(err){console.warn(err.message)};
});

// DELTE
router.delete('/:id', auth, async (req, res) => {

	// try{
		const customer = await Customer.findOneAndRemove(req.params.id);
		// check if the customer exists
		if (!customer) {
			return res.status(404).send('Could not find this customer. Please try again!')
		}
		res.send(customer);
	// }
	// catch(err){console.warn(err.message)};
});

module.exports = router;