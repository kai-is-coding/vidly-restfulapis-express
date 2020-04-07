const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const home = require('./routes/home');

mongoose.connect('mongodb://localhost/vidly', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.warn('Could not connect to MongoDB...'));

app.use(express.json());

app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
	console.log(`Listening to the http://localhost/${port}...`);
});