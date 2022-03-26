//set to a testing environment

process.env.NODE_ENV = 'test';
const request = require('supertest');

const app = require('../app');
let items = require('../fakeDb');

let pickles = { name: 'Pickles', price: '$4.49' };

beforeEach(function() {
	// Add item to shopping list
	items.push(pickles);
});

afterEach(function() {
	// Reset shopping list
	items.length = 0;
});

describe('GET /items', () => {
	test('Get all items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ items: [ pickles ] });
	});
});

describe('GET /items/:name', () => {
	test('Get item by name', async () => {
		const res = await request(app).get(`/items/${pickles.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: pickles });
	});
	test('Responds with 404 for invalid item', async () => {
		const res = await request(app).get(`/items/candy`);
		expect(res.statusCode).toBe(404);
	});
});

describe('POST /items', () => {
	test('Creating an item', async () => {
		const res = await request(app).post('/items').send({ name: 'Bacon', price: '$7.99' });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ added: { newItem: { name: 'Bacon', price: '$7.99' } } });
	});
	test('Responds with 400 if name is missing', async () => {
		const res = await request(app).post('/items').send({});
		expect(res.statusCode).toBe(400);
	});
});

describe('/PATCH /items/:name', () => {
	test('Updating an item details', async () => {
		const res = await request(app).patch(`/items/${pickles.name}`).send({ name: 'Pickles', price: '$3.50' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ updated: { name: 'Pickles', price: '$3.50' } });
	});
	test('Responds with 404 for invalid name', async () => {
		const res = await request(app).patch(`/cats/Pickled`).send({ name: 'Pickles', price: '$3.50' });
		expect(res.statusCode).toBe(404);
	});
});

describe('/DELETE /items/:name', () => {
	test('Deleting an item', async () => {
		const res = await request(app).delete(`/items/${pickles.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});
	test('Responds with 404 for deleting invalid items', async () => {
		const res = await request(app).delete(`/items/salami_lid`);
		expect(res.statusCode).toBe(404);
	});
});
