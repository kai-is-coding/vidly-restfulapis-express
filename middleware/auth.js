const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
	const token = req.header('x-auth-token');
	if (!token) {
		return res.status(401).send('Access denied. No token provided.')
	}
	try{
		// get payload
		const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
		// put payload to request
		req.user = decoded;
		next();
	}
	catch(err){res.status(400).send('Invalid token.');}
}
module.exports = auth;