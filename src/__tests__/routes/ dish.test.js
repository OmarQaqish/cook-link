const request = require('supertest');
const path = require('path');
const { app, appListen } = require('../../app');
require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env.test.local'),
});

const signIn = async (email, password) => {
  return request(app)
    .post('/api/auth/signin')
    .send(`email=${email}&password=${password}`)
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => res.body.JWTtoken);
};

describe('dish main', () => {
  let token = '';
  let server = null;

  beforeAll((done) => {
    server = app.listen(process.env.NODE_LOCAL_PORT, appListen);

    app.on('appStarted', () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('tests for admin', () => {
    const email = process.env.TEST_EMAIL_ADMIN;
    const password = process.env.TEST_PASSWORD_ADMIN;

    beforeAll(async () => {
      token = await signIn(email, password);
    });

    it('get all admin dishes', (done) => {
      request(app)
        .get('/api/dish/admin')
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe('admin');

            expect(res.body).toHaveProperty('dishes');
            expect(Array.isArray(res.body.dishes)).toBe(true);
            done();
          },
          (err) => {
            done(err);
          }
        );
    });
  });

  describe('tests for cook', () => {
    const email = process.env.TEST_EMAIL_COOK;
    const password = process.env.TEST_PASSWORD_COOK;

    let addedDishId = null;

    beforeAll(async () => {
      token = await signIn(email, password);
    });

    it('get cook own dishes', (done) => {
      request(app)
        .get('/api/dish/mydishes')
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(Array.isArray(res.body)).toBe(true);

            expect(res.body[0]).toHaveProperty('cuisine');
            expect(typeof res.body[0].cuisine).toBe('string');

            expect(res.body[0]).toHaveProperty('description');
            expect(typeof res.body[0].description).toBe('string');

            expect(res.body[0]).toHaveProperty('name');
            expect(typeof res.body[0].name).toBe('string');

            expect(res.body[0]).toHaveProperty('price');
            expect(typeof res.body[0].price).toBe('number');
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('add a dish as cook', (done) => {
      request(app)
        .post('/api/dish/')
        .set('Cookie', `jwt=${token}`)
        .send({
          name: 'test dish',
          description: '18Molokhia, rice, and Chicken',
          cuisine: 'Turkish',
          image: 'dishtest.com',
          price: 495,
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('cuisine');
            expect(typeof res.body.cuisine).toBe('string');

            expect(res.body).toHaveProperty('description');
            expect(typeof res.body.description).toBe('string');

            expect(res.body).toHaveProperty('name');
            expect(typeof res.body.name).toBe('string');

            expect(res.body).toHaveProperty('price');
            expect(typeof res.body.price).toBe('number');

            addedDishId = res.body._id;
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('update a dish as cook', (done) => {
      const updatedData = {
        name: 'updated dish',
        description: 'updated, rice, and Chicken',
        cuisine: 'Updated',
        image: 'updated.com',
        price: 594,
      };
      request(app)
        .put(`/api/dish/${addedDishId}`)
        .set('Cookie', `jwt=${token}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('cuisine');
            expect(typeof res.body.cuisine).toBe('string');
            expect(res.body.cuisine).toBe(updatedData.cuisine);

            expect(res.body).toHaveProperty('description');
            expect(typeof res.body.description).toBe('string');
            expect(res.body.description).toBe(updatedData.description);

            expect(res.body).toHaveProperty('name');
            expect(typeof res.body.name).toBe('string');
            expect(res.body.name).toBe(updatedData.name);

            expect(res.body).toHaveProperty('price');
            expect(typeof res.body.price).toBe('number');
            expect(res.body.price).toBe(updatedData.price);
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('remove a dish as cook', (done) => {
      request(app)
        .delete(`/api/dish/${addedDishId}`)
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message');
            expect(typeof res.body.message).toBe('string');
            done();
          },
          (err) => {
            done(err);
          }
        );
    });
  });

  describe('tests for user', () => {
    const email = process.env.TEST_EMAIL_USER;
    const password = process.env.TEST_PASSWORD_USER;

    const addedDishId = 'thisisaplaceholder';

    beforeAll(async () => {
      token = await signIn(email, password);
    });

    it('get user try to get a cook dishes', (done) => {
      request(app)
        .get('/api/dish/mydishes')
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(403)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message');
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message).toBe(
              'you do not have permission to perform this action'
            );
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('add a dish as user', (done) => {
      request(app)
        .post('/api/dish/')
        .set('Cookie', `jwt=${token}`)
        .send({
          name: 'test dish',
          description: '18Molokhia, rice, and Chicken',
          cuisine: 'Turkish',
          image: 'dishtest.com',
          price: 495,
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message');
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message).toBe(
              'you do not have permission to perform this action'
            );
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('update a dish as user', (done) => {
      const updatedData = {
        name: 'updated dish',
        description: 'updated, rice, and Chicken',
        cuisine: 'Updated',
        image: 'updated.com',
        price: 594,
      };
      request(app)
        .put(`/api/dish/${addedDishId}`)
        .set('Cookie', `jwt=${token}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(403)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message');
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message).toBe(
              'you do not have permission to perform this action'
            );
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('remove a dish as user', (done) => {
      request(app)
        .delete(`/api/dish/${addedDishId}`)
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(403)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message');
            expect(typeof res.body.message).toBe('string');
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('get dishes in the same city as a user with no address', (done) => {
      request(app)
        .get('/api/dish/same-city')
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toBe(
              'Please Add your address to get dishes in your city'
            );
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('get dishes in the same city as a user with address', async () => {
      token = await signIn('z1@gmail.com', '123456789');
      request(app)
        .get('/api/dish/same-city')
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('message');
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message).toBe('customer');

            expect(res.body).toHaveProperty('dishes');
            expect(typeof res.body.dishes).toBe('object');
            expect(Array.isArray(res.body.dishes)).toBe(true);
          },
          (err) => {
            console.log(err);
          }
        );
    });
  });

  describe('dish public routes', () => {
    it('get dishes as a guest', (done) => {
      request(app)
        .get('/api/dish')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('message');
            expect(typeof res.body.message).toBe('string');
            expect(res.body.message).toBe('guest');

            expect(res.body).toHaveProperty('dishes');
            expect(typeof res.body.dishes).toBe('object');
            expect(Array.isArray(res.body.dishes)).toBe(true);
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('filter dishes as a guest', (done) => {
      request(app)
        .get('/api/dish/')
        .query({ cuisine: 'Turkish' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('dishes');
            expect(typeof res.body.dishes).toBe('object');
            expect(Array.isArray(res.body.dishes)).toBe(true);
            done();
          },
          (err) => {
            done(err);
          }
        );
    });
    it('get one dish as a guest', (done) => {
      request(app)
        .get('/api/dish/64bfe8c75a7ef74c61c59720')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('cuisine');
            expect(typeof res.body.cuisine).toBe('string');

            expect(res.body).toHaveProperty('description');
            expect(typeof res.body.description).toBe('string');

            expect(res.body).toHaveProperty('name');
            expect(typeof res.body.name).toBe('string');

            expect(res.body).toHaveProperty('price');
            expect(typeof res.body.price).toBe('number');
            done();
          },
          (err) => {
            done(err);
          }
        );
    });

    it('get non-existing dish as a guest', (done) => {
      request(app)
        .get('/api/dish/64bfe8c75a7ef74c61c59721')
        .expect('Content-Type', /json/)
        .expect(404)
        .then(
          (res) => {
            expect(typeof res.body).toBe('object');

            expect(res.body).toHaveProperty('error');
            expect(typeof res.body.error).toBe('string');

            done();
          },
          (err) => {
            done(err);
          }
        );
    });
  });
});
