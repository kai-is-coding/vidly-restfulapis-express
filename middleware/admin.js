function admin (req, res, next) {
	if (!req.user.isAdmin) {
		// 401 Unauthorized
		// 403 Forbidden
		return res.status(403).send('Access denied.');
	}
	next();
}

module.exports = admin;