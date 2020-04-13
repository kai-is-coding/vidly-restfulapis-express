const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');

describe('api/returns', () => {
	let server;
	let customerId;
	let movieId;
	let rental;
	let token;

	beforeEach(async () => {
		server = require('../../index');
		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();
		rental = new Rental({
			customer: {
				_id: customerId,
				name: '12345',
				phone: '12345'
			},
			movie: {
				_id: movieId,
				title: '12345',
				dailyRentalRate: 2
			}
		});
		token = new User().generateAuthToken();

		await rental.save();
	});

	afterEach(async () => {
		await server.close();
		await Rental.deleteMany({});
	});

	const exec = () => {
		return request(server)
		.post('/api/returns')
		.set('x-auth-token', token)
		.send({customerId, movieId});
	}

	it('should return 401 if the client is not logged in', async () => {
		token = '';
		const res = await exec();
		expect(res.status).toBe(401);
	});

	it('should return 400 if customerId is not provided', async () => {
		customerId = '';
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('should return 400 if movieId is not provided', async () => {
		movieId = '';
		const res = await exec()
		expect(res.status).toBe(400);
	});
});