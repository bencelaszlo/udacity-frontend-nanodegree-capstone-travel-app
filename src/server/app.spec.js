import 'regenerator-runtime/runtime.js';
const request = require('supertest');
const app = require('./app');

describe('/all path successfully returns', () => {
  test('It should response the GET method', async () => {
    const response = await request(app).get('/all');
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({});
  });
});
