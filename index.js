const express = require('express');
const app = express();
const genres = require('./routes/genres');
const home = require('./routes/home');

app.use(express.json());

app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
	console.log(`Listening to the http://localhost/${port}...`);
});