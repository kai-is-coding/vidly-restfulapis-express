const winston = require('winston');
require('winston-mongodb');


module.exports = function(){
	process.on('uncaughtException', (ex) => {
		// console.log('We got an uncaught exception');
		winston.error(ex.message, ex);
		process.exit(1);
	});
	
	process.on('unhandledRejection', (ex) => {
		// console.log('We got an unhandled rejection');
		winston.error(ex.message, ex);
		process.exit(1);
	});
	
	// const logger = winston.createLogger({
	// 	level: 'info',
	// 	format: winston.format.json(),
	// 	defaultMeta: {service: 'user-service'},
	// 	transports: [
	// 		new winston.transports.File({filename: 'logfile.log'}),
	// 		new winston.transports.MongoDB({db: 'mongodb://localhost/vidly', useUnifiedTopology: true})
	// 	]
	// });
	winston.add(new winston.transports.Console({level: 'info', colorize: true, prettyPrint: true, silent: false, timestamp: false}));
	winston.add(new winston.transports.File({filename: 'logfile.log'}));
	winston.add(new winston.transports.MongoDB({db: 'mongodb://localhost/vidly', useUnifiedTopology: true}));
	
	// throw new Error('Something failed during starup.');
	// const p = Promise.reject(new Error('Something failed!!!'));
	// p.then(() => console.log('Done'));
}