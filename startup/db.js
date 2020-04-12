const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

// module.exports = function(){
// 	mongoose.connect('mongodb://localhost/vidly', {
// 		useNewUrlParser: true, useUnifiedTopology: true
// 	})
// 	.then(() => winston.info('Connected to MongoDB...'));
// 	// .catch(err => console.warn('Could not connect to MongoDB...'));
// }

module.exports = function(){
	const db = config.get('db');
	mongoose.connect(db, {
		useNewUrlParser: true, useUnifiedTopology: true
	})
	.then(() => winston.info(`Connected to ${db}...`));
	// .catch(err => console.warn('Could not connect to MongoDB...'));
}