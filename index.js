const express = require('express');
const app = express();
const Joi = require('@hapi/joi');

app.use(express.json());

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

app.get('/', (req, res) => {
	res.send('Welcome to VIDLY site!!!');
});

//CREATE
app.post('/api/genres', (req, res) => {
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
app.get('/api/genres', (req, res) => {
	res.send(genres);	
});

app.get('/api/genres/:id', (req, res) => {
	//check if data exists, if no status = 404
	const genre = genres.find(g => g.id === parseInt(req.params.id));
	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}
	//send data
	return res.send(genre);
});

//UPDATE
app.put('/api/genres/:id', (req, res) => {
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
app.delete('/api/genres/:id', (req, res) => {
	//check if data exists, if no, status = 404
	const genre = genres.find(g => g.id === parseInt(req.params.id));
	if (!genre) {
		return res.status(400).send('The genre does not exist! Try another one...');
	}
	const index = genres.indexOf(genre);
	genres.splice(index, 1);
	res.send(genre);
});


const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
	console.log(`Listening to the http://localhost/${port}...`);
	
});