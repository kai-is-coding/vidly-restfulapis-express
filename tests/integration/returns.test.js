const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

describe('api/returns', () => {
	let server;
	let customerId;
	let movieId;
	let rental;
	let movie;
	let token;

	beforeEach(async () => {
		server = require('../../index');
		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();
		movie = new Movie({
			_id: movieId,
			title: '12345',
			dailyRentalRate: 2,
			genre: {name: '12345'},
			numberInStock: 10
		});
		await movie.save();

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
		await rental.save();

		token = new User().generateAuthToken();
	});

	afterEach(async () => {
		await server.close();
		await Rental.deleteMany({});
		await Movie.deleteMany({});
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

	it('should return 404 if no customer or movie found in this rental', async () => {
		await Rental.deleteMany({});
		const res = await exec();
		expect(res.status).toBe(404);
	});

	it('should return 400 if the rental has been processed', async () => {
		rental.dateReturned = new Date();
		await rental.save();
		const res = await exec();
		expect(res.status).toBe(400);
	});

	it('should return 200 if the request is valid', async () => {
		const res = await exec();
		expect(res.status).toBe(200);
	});

	it('should return dateReturned if the request is valid', async () => {
		await exec();
		const rentalInDB = await Rental.findById(rental._id);
		const diff = Date.now() - rentalInDB.dateReturned;
		expect(diff).toBeLessThan(1000*10);
	});

	it('should return rental fee if the request is valid', async () => {
		rental.dateOut = moment().add(-7, 'days').toDate();
		await rental.save();

		await exec();
		const rentalInDB = await Rental.findById(rental._id);
		expect(rentalInDB.rentalFee).toBe(14);
	});

	it('should increase movie stock if the request is valid', async () => {
		await exec();

		const movieInDB = await Movie.findById(movieId);
		expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
	});

	it('should return rental if the request is valid', async () => {
		const res = await exec();
		expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']));
	});
});