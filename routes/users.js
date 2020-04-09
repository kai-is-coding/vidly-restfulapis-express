const _ = require('lodash');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const express = require('express');
const router = express.Router();
const {User, validateData} = require('../models/user');

// Create
router.post('/', async (req, res) => {
	try{
		// validate input data
		const {error} = validateData(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		// check if the user alreay exists
		let user = await User.findOne({email: req.body.email});
		if (user) {
			res.status(400).send('User already registered...');
		}

		// create a new user
		user = new User(_.pick(req.body, ['name', 'email', 'password']));
		
		// hash password with bcrypt
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);

		await user.save();
		res.send(_.pick(user, ['_id', 'name', 'email']));
	}
catch(err){console.warn(err.message);}

});

module.exports = router;