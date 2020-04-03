const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const genres = [
	{id: 1, name: 'Action'},
	{id: 2, name: 'Horror'},
	{id: 3, name: 'Romance'}
];

// check data if valid function
function validateData(genres) {
	const schema = Joi.object({
		name: Joi.string().alphanum().min(3).max(10).required()
	});
	return schema.validate(genres);
};

//CREATE
router.post('/', (req, res) => {
	//validate data, if error status = 400
	const {error} = validateData(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	const genre = {
		id: genres.length + 1,
		name: req.body.name
	};
	genres.push(genre);
	res.send(genres);
});

//READ
router.get('/', (req, res) => {
	res.send(genres);	
});

router.get('/:id', (req, res) => {
	//check if data exists, if no status = 404
	const genre = genres.find(g => g.id === parseInt(req.params.id));
	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}
	//send data
	return res.send(genre);
});

//UPDATE
router.put('/:id', (req, res) => {
	//check if data exists, if no, status = 404
	const genre = genres.find(g => g.id === parseInt(req.params.id));
	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}

	//validate data
	const {error} = validateData(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	//Update data
	genre.name = req.body.name;
	res.send(genre);
});

//DELETE
router.delete('/:id', (req, res) => {
	//check if data exists, if no, status = 404
	const genre = genres.find(g => g.id === parseInt(req.params.id));
	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}
	const index = genres.indexOf(genre);
	genres.splice(index, 1);
	res.send(genre);
});
module.exports = router;