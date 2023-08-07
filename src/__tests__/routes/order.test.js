const request = require('supertest');
const path = require('path');
const { app, appListen } = require('../../app');
const Order = require('../../models/order');
require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env.test.local'),
});

const signIn = async (email, password) => {
  return request(app)
    .post('/api/auth/signin')
    .send(`email=${email}&password=${password}`)
    .expect('Content-Type', /json/)
    .then((res) => res.body.JWTtoken);
};

describe('GET /api/order should get all orders for admins', () => {
  const email = process.env.TEST_EMAIL_ADMIN;
  const password = process.env.TEST_PASSWORD_ADMIN;

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

  it('should get all orders', async () => {
    const allOrders = await Order.find();

    const response = await request(app)
      .get('/api/order')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(allOrders.length);

    response.body.forEach((order) => {
      expect(order).toHaveProperty('items');
      expect(Array.isArray(order.items)).toBe(true);
      expect(order).toHaveProperty('totalPrice');
      expect(typeof order.totalPrice).toBe('number');
      expect(order).toHaveProperty('user');
      expect(typeof order.user).toBe('string');
      expect(order.items[0]).toHaveProperty('dish');
      expect(typeof order.items[0].dish).toBe('object');
      expect(order.items[0].dish).toHaveProperty('name');
      expect(typeof order.items[0].dish.name).toBe('string');
    });
  });

  it('should return 500 Unauthorized for invalid credentials', async () => {
    // Attempt to sign in with invalid credentials
    const invalidToken = await signIn('invalid@test.com', 'invalidPassword');
    const response = await request(app)
      .get('/api/order')
      .set('Cookie', `jwt=${invalidToken}`)
      .expect('Content-Type', /json/);
    expect(response.status).toBe(500);
  });
});

describe('GET /api/order/myorders should get all orders for a user', () => {
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

  it('should get all orders for the user', async () => {
    const response = await request(app)
      .get('/api/order/myorders')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    response.body.forEach((order) => {
      expect(order).toHaveProperty('items');
      expect(Array.isArray(order.items)).toBe(true);
      expect(order).toHaveProperty('totalPrice');
      expect(typeof order.totalPrice).toBe('number');
      expect(order).toHaveProperty('user');
      expect(order.user).toBe('64c180506b5c883615a7798f');
      expect(order.items[0]).toHaveProperty('dish');
      expect(typeof order.items[0].dish).toBe('object');
      expect(order.items[0].dish).toHaveProperty('name');
      expect(typeof order.items[0].dish.name).toBe('string');
    });
  });

  it('should return 404 with message for user without any orders', async () => {
    const testUserToken = await signIn('testuser@example.com', '123456789');
    const response = await request(app)
      .get('/api/order/myorders')
      .set('Cookie', `jwt=${testUserToken}`)
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('You do not have any orders');
  });
});

describe('GET /api/order/assigned-orders', () => {
  const email = process.env.TEST_EMAIL_COOK;
  const password = process.env.TEST_PASSWORD_COOK;

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

  it('should get assigned orders for cook', async () => {
    const response = await request(app)
      .get('/api/order/assigned-orders')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    response.body.forEach((order) => {
      expect(order).toHaveProperty('items');
      expect(Array.isArray(order.items)).toBe(true);
      expect(order).toHaveProperty('user');
      expect(typeof order.user).toBe('string');
      expect(order).toHaveProperty('status');
      expect(typeof order.status).toBe('string');
    });
  });

  it('should return 403 with error message for unauthenticated users', async () => {
    const response = await request(app)
      .get('/api/order/assigned-orders')
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(
      'you are not logged in, please log in to get access'
    );
  });
});

describe('GET /api/order/:orderId', () => {
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

  it('should get the order for the user who owns it', async () => {
    const response = await request(app)
      .get('/api/order/64c36f8773ce60654edaf48d')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
    expect(response.body).toHaveProperty('totalPrice');
    expect(typeof response.body.totalPrice).toBe('number');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toBe('64c180506b5c883615a7798f');
    expect(response.body).toHaveProperty('status');
    expect(typeof response.body.status).toBe('string');
  });

  it('should return 401 when user is not authorized to view the order', async () => {
    const response = await request(app)
      .get('/api/order/64c8137dd463947de13cff9d')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(
      'You are not authorized to view this order'
    );
  });
});
