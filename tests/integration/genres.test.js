const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {

	beforeEach(() => {server = require('../../index');});

	afterEach(async () => {
		await Genre.deleteMany({});
		await server.close();
	});

	describe('Get /', () => {
		it('should return all genres', async () => {
			await Genre.collection.insertMany([
				{name: 'genre1'},
				{name: 'genre2'},
			]);

			const res = await request(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2);
			expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
			expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();

		});
	});

	describe('Get /:id', () => {
		it('should return a genre if valid is is passed', async () => {
			const genre = new Genre({name: 'genre1'});
			await genre.save();

			const res = await request(server).get(`/api/genres/${genre._id}`);
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name', genre.name);
		});

		it('should return 404 if invalid is is passed', async () => {

			const res = await request(server).get(`/api/genres/1`);
			expect(res.status).toBe(404);

		});

		it('should return 404 if no genre with the given id exists', async () => {
			const id = mongoose.Types.ObjectId();
			const res = await request(server).get(`/api/genres/${id}`);
			expect(res.status).toBe(404);

		});
	});

	describe('POST /', () => {
		let token;
		let name;

		const exec = () => {
			return request(server)
			.post('/api/genres')
			.set('x-auth-token', token)
			.send({name: name});
		}

		beforeEach(() => {
			token = new User().generateAuthToken();
			name = 'genre1';
		});

		it('should return 401 if client is not logged in', async () => {

			token = '';
			const res = await exec();
			expect(res.status).toBe(401);
			
		});

		it('should return 400 if client is less than 5 characters', async () => {

			name = '1234';
			const res = await exec();
			expect(res.status).toBe(400);

		});

		it('should return 400 if client is more than 50 characters', async () => {

			name = new Array(52).join('a');
			const res = await exec();
			expect(res.status).toBe(400);

		});

		it('should save the genre if it is valid', async () => {

			await exec();
			const genre = Genre.find({name: 'genre`'});
			expect(genre).not.toBeNull();

		});

		it('should return the genre if it is valid', async () => {

			const res = await exec();
			expect(res.body).toHaveProperty('_id');
			expect(res.body).toHaveProperty('name', 'genre1');

		});
	});

	describe('Put /:id', () => {
		let token;
		let newName;
		let id;
		let genre;

		const exec = () => {
			return request(server)
			.put(`/api/genres/${id}`)
			.set('x-auth-token', token)
			.send({name: newName});
		}

		beforeEach( async () => {
			genre = new Genre({name: 'genre1'});
			await genre.save();

			token = new User().generateAuthToken();
			id = genre._id;
			newName = 'new Genre';
		});

		it('should return 401 if it the client is not logged in', async () => {
			token = '';
			const res = await exec();
			expect(res.status).toBe(401);
		});

		it('should should return 400 if genre is less than 5 characters', async () => {
			newName = 'a';
			const res = await exec();
			expect(res.status).toBe(400);
		});

		it('should should return 400 if genre is more then 50 characters', async () => {
			newName = new Array(52).join('a');
			const res = await exec();
			expect(res.status).toBe(400);
		});

		it('should return 404 if id is invalid', async () => {
			id = 1;
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should return 404 if id is not found', async () => {
			id = mongoose.Types.ObjectId();
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should update the genre if input is valid', async () => {
			await exec();
			const updateGenre = await Genre.findById(genre._id);
			expect(updateGenre.name).toBe(newName);
		});

		it('should return updated genre', async () => {
			const res = await exec();
			expect(res.body).toHaveProperty('name', newName);
			expect(res.body).toHaveProperty('_id', id.toHexString());
		});
	});

	describe('Delete /:id', () => {
		let genre;
		let id;
		let token;

		const exec = () => {
			return request(server)
			.delete(`/api/genres/${id}`)
			.set('x-auth-token', token)
			.send();
		};

		beforeEach(async () => {
			genre = new Genre({name: 'genre1'});
			await genre.save();
			id = genre._id;
			token = new User({isAdmin: true}).generateAuthToken();
		});

		it('should should return 401 if the client is logged in', async () => {
			token = '';
			const res = await exec();
			expect(res.status).toBe(401);
		});

		it('should return 403 if the client is not a admin', async () => {
			token = new User({isAdmin: false}).generateAuthToken();
			const res = await exec();
			expect(res.status).toBe(403);
		});

		it('should return 404 if id is invalid', async () => {
			id = 1;
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should return 404 if the genre does not exist', async () => {
			id = mongoose.Types.ObjectId();
			const res = await exec();
			expect(res.status).toBe(404);
		});

		it('should delete the Genre when it is valid ', async () => {
			await exec();
			const deleteGenre = await Genre.findById(id);
			expect(deleteGenre).toBeNull();
		});

		it('should return deleted genre', async () => {
			const res = await exec();
			expect(res.body).toHaveProperty('name', genre.name);
			expect(res.body).toHaveProperty('_id', id.toHexString());
		});
	});
});