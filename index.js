const winston = require('winston');
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/login')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.NODE_ENV || 3000;
app.listen(port, () => {
	winston.info(`Listening to the http://localhost/${port}...`);
});