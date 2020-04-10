const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const express = require('express');
const router = express.Router();
const {User} = require('../models/user');

router.post('/', async (req, res) => {
	try{
		// validate input data
		const {error} = validateUser(req.body);
		if (error) {
			return res.status(400).send(error.details[0].message);
		}

		// check if the user alreay exists
		let user = await User.findOne({email: req.body.email});
		
		if (!user) {
			return res.status(400).send('Invalid email or password...');
		}

		// check password
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			return res.status(400).send('Invalid email or password...');
		}

		const token = user.generateAuthToken();
		res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

		// res.send(token);
	}
catch(err){console.warn(err.message);}

});

function validateUser(req){
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).email().required(),
		password: Joi.string().min(6).max(1024).required()
	});
	return schema.validate(req);
}
module.exports = router;