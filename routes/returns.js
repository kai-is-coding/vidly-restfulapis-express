const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	if (!req.body.customerId) {
		return res.status(400).send('CostomerId does not provide.')
	}
	if (!req.body.movieId) {
		return res.status(400).send('MovierId does not provide.')
	}

	res.status(401).send('Unauthorized');
});

module.exports = router;