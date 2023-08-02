const request = require('supertest');
const { app, appListen } = require('../../app');

const signIn = async (email, password) => {
  return request(app)
    .post('/api/auth/signin')
    .send(`email=${email}&password=${password}`)
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => res.body.JWTtoken);
};

describe('main', () => {
  const email = process.env.TEST_EMAIL_USER;
  const password = process.env.TEST_PASSWORD_USER;

  let token = '';
  let server = null;

  beforeAll((done) => {
    server = app.listen(process.env.NODE_LOCAL_PORT, appListen);

    app.on('appStarted', async () => {
      token = await signIn(email, password);
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('get all dishes from the cart', (done) => {
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
          done(err);
        }
      );
  });

  it('add a dish to the cart', (done) => {
    request(app)
      .post('/api/cart/64bfe91f5a7ef74c61c59749')
      .set('Cookie', `jwt=${token}`)
      .send({ quantity: 7 })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(
        (res) => {
          expect(typeof res.body).toBe('object');
          expect(res.body).toHaveProperty('user');
          expect(typeof res.body.user).toBe('string');
          expect(res.body).toHaveProperty('quantity');
          expect(typeof res.body.quantity).toBe('number');
          done();
        },
        (err) => {
          done(err);
        }
      );
  });

  describe('checkout, remove cart', () => {
    beforeEach((done) => {
      request(app)
        .post('/api/cart/64bfe91f5a7ef74c61c59749')
        .set('Cookie', `jwt=${token}`)
        .send({ quantity: 7 })
        .expect('Content-Type', /json/)
        .expect(201)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('user');
            expect(typeof res.body.user).toBe('string');
            expect(res.body).toHaveProperty('quantity');
            expect(typeof res.body.quantity).toBe('number');
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('checkout cart ', (done) => {
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
            done(err);
          }
        );
    });

    it('remove dish from the cart ', (done) => {
      request(app)
        .delete(`/api/cart/64bfe91f5a7ef74c61c59749`)
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('Item removed from the cart');
            done();
          },
          (err) => {
            done(err);
          }
        );
    });
  });
});
