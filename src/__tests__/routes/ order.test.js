const request = require('supertest');
const assert = require('assert');
const app = require('../../app');

request(app)
  .get('/order')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end((err, res) => {
    if (err) throw err;
  });
