const request = require('supertest');
const app = require('../../app');

describe('main', () => {
  const email = process.env.TEST_EMAIL_USER;
  const password = process.env.TEST_PASSWORD_USER;

  let token = '';

  beforeAll((done) => {
    app.on('appStarted', () => {
      request(app)
        .post('/api/auth/signin')
        .send(`email=${email}&password=${password}`)
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => {
          token = res.body.JWTtoken;
          done();
        });
    });
  });

  it('GET/ get cart', (done) => {
    request(app)
      .get('/api/cart')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(
        (res) => {
          expect(typeof res.body).toBe('object');
          expect(res.body).toHaveProperty('totalPrice');
          expect(typeof res.body.totalPrice).toBe('number');
          expect(res.body).toHaveProperty('cart');
          expect(Array.isArray(res.body.cart)).toBe(true);
          done();
        },
        (err) => {
          console.log(err);
        }
      );
  });

  it('POST/ checkout cart ', (done) => {
    request(app)
      .post('/api/cart/checkout')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(201)
      .then(
        (res) => {
          expect(typeof res.body).toBe('object');
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Order placed successfully');
          expect(res.body).toHaveProperty('order');
          expect(typeof res.body.order).toBe('object');
          done();
        },
        (err) => {
          console.log(err);
        }
      );
  });
});
