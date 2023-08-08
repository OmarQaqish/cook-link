const request = require('supertest');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../../.env.test.local'),
});
const { app, appListen } = require('../../app');
const User = require('../../models/user');

const signIn = async (email, password) => {
  return request(app)
    .post('/api/auth/signin')
    .send(`email=${email}&password=${password}`)
    .expect('Content-Type', /json/)
    .expect(201)
    .then((res) => res.body.JWTtoken);
};

const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

describe('main', () => {
  describe('GET /api/user/users as an admin', () => {
    let adminToken = '';
    let server = null;

    beforeAll((done) => {
      server = app.listen(process.env.NODE_LOCAL_PORT, appListen);

      app.on('appStarted', async () => {
        adminToken = await signIn(
          process.env.TEST_EMAIL_ADMIN,
          process.env.TEST_PASSWORD_ADMIN
        );
        done();
      });
    });

    afterAll((done) => {
      server.close(done);
    });

    it('should get all users', async () => {
      const allUsers = await User.find();

      const response = await request(app)
        .get('/api/user/users')
        .set('Cookie', `jwt=${adminToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(allUsers.length);

      response.body.forEach((user) => {
        expect(user).toHaveProperty('username');
        expect(typeof user.username).toBe('string');
        expect(user).toHaveProperty('email');
        expect(typeof user.email).toBe('string');
        expect(user).toHaveProperty('type');
        expect(typeof user.type).toBe('string');
      });
    });

    it('should return 403 when the user is not an admin', async () => {
      const userToken = await signIn(
        process.env.TEST_EMAIL_USER,
        process.env.TEST_PASSWORD_USER
      );

      const response = await request(app)
        .get('/api/user/users')
        .set('Cookie', `jwt=${userToken}`)
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe(
        'you do not have permission to perform this action'
      );
    });
  });

  describe('User Routes', () => {
    let server = null;
    let token = '';
    let testUser = null;

    beforeAll(async () => {
      server = app.listen(process.env.NODE_LOCAL_PORT, appListen);

      // Step 1: Create the test user by registering a new user
      testUser = {
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser2@example.com',
        password: 'testpassword',
        password2: 'testpassword',
      };

      // Register the test user
      await request(app).post('/api/auth/signup').send(testUser).expect(201);

      // Step 2: Sign in as the test user and get the authentication token
      token = await signIn(testUser.email, testUser.password);
    });

    afterAll(async () => {
      // Step 4: Delete the test user at the end

      await deleteUser(testUser._id);

      server.close();
    });

    describe('GET /api/user', () => {
      it('should get user info for authenticated user', async () => {
        // Step 3: Use the obtained authentication token for testing protected routes
        const response = await request(app)
          .get('/api/user')
          .set('Cookie', `jwt=${token}`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty('username', testUser.username);
        expect(response.body).toHaveProperty('email', testUser.email);
        expect(response.body).not.toHaveProperty('password');
      });

      it('should return 403 for unauthenticated user', async () => {
        const response = await request(app).get('/api/user').expect(403);

        expect(response.body).toHaveProperty(
          'message',
          'you are not logged in, please log in to get access'
        );
      });
    });

    describe('PUT /api/user', () => {
      it('should update user profile for authenticated user', async () => {
        const updatedData = {
          username: 'updatedusername',
          firstName: 'Updated',
          lastName: 'User',
          email: 'updateduser@example.com',
          password: 'updatedpassword',
          password2: 'updatedpassword',
          profilePicture: 'updated_profile_picture_url',
        };

        const response = await request(app)
          .put('/api/user')
          .set('Cookie', `jwt=${token}`)
          .send(updatedData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty(
          'message',
          'User profile updated successfully'
        );
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty(
          'username',
          updatedData.username
        );
        expect(response.body.user).toHaveProperty(
          'firstName',
          updatedData.firstName
        );
        expect(response.body.user).toHaveProperty(
          'lastName',
          updatedData.lastName
        );
        expect(response.body.user).toHaveProperty('email', updatedData.email);
        expect(response.body.user).toHaveProperty(
          'profilePicture',
          updatedData.profilePicture
        );
      });
    });

    describe('DELETE /api/user', () => {
      it('should delete user account for authenticated user', async () => {
        const response = await request(app)
          .delete('/api/user')
          .set('Cookie', `jwt=${token}`)
          .expect(200);

        expect(response.text).toBe('account deleted successfully');

        // Check that the user is deleted from the database
        const deletedUser = await User.findById(testUser._id);
        expect(deletedUser).toBeNull();
      });

      it('should return 403 for unauthenticated user', async () => {
        const response = await request(app).delete('/api/user').expect(403);

        expect(response.body).toHaveProperty(
          'message',
          'you are not logged in, please log in to get access'
        );
      });
    });
  });

  describe('GET /api/user/cook-page/:id should get cook information', () => {
    let server = null;

    beforeAll((done) => {
      server = app.listen(process.env.NODE_LOCAL_PORT, appListen);
      done();
    });

    afterAll((done) => {
      server.close(done);
    });

    it('should get cook information for the given cook ID', async () => {
      const testCookId = '64bfe79fdd95ff44cd78ca1c';

      const response = await request(app)
        .get(`/api/user/cook-page/${testCookId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('firstName');
      expect(typeof response.body.firstName).toBe('string');
      expect(response.body).toHaveProperty('location');
      expect(typeof response.body.location).toBe('string');
      expect(response.body).toHaveProperty('bio');
      expect(typeof response.body.bio).toBe('string');
      expect(response.body).toHaveProperty('dishes');
      expect(Array.isArray(response.body.dishes)).toBe(true);
    });

    it('should return 501 with message when the ID does not belong to a cook', async () => {
      const testNonCookId = '64c180506b5c883615a7798f';

      const response = await request(app)
        .get(`/api/user/cook-page/${testNonCookId}`)
        .expect('Content-Type', /json/)
        .expect(501);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('can not get this page');
    });
  });

  describe('Cook Routes', () => {
    let server = null;
    let token = '';
    let testCook = null;
    let testCookId = null;

    beforeAll(async () => {
      server = app.listen(process.env.NODE_LOCAL_PORT, appListen);

      // Step 1: Create the test cook by registering a new cook
      testCook = {
        username: 'testcook',
        firstName: 'Test',
        lastName: 'Cook',
        email: 'testcook@example.com',
        password: 'testpassword',
        password2: 'testpassword',
        location: 'Test Location',
        bio: 'Test Bio',
      };

      // Register the test cook
      const response = await request(app)
        .post('/api/auth/cook/signup')
        .send(testCook)
        .expect(201);

      testCookId = response.body.newCook._id;

      // Step 2: Sign in as the test cook and get the authentication token
      token = await signIn(testCook.email, testCook.password);
    });

    afterAll(async () => {
      // Step 4: Delete the test cook at the end
      if (testCook) {
        await deleteUser(testCookId);
      }
      server.close();
    });

    describe('PUT /api/user/cook', () => {
      it('should update cook profile for an authenticated cook', async () => {
        const updatedData = {
          username: 'updatedcookname',
          firstName: 'Updated',
          lastName: 'Cook',
          email: 'updatedcook@example.com',
          password: 'updatedpassword',
          password2: 'updatedpassword',
          profilePicture: 'url-to-updated-picture',
          location: 'Updated Location',
          bio: 'Updated Bio',
        };

        const response = await request(app)
          .put('/api/user/cook')
          .set('Cookie', `jwt=${token}`)
          .send(updatedData)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty(
          'message',
          'Cook profile updated successfully'
        );
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty(
          'username',
          updatedData.username
        );
        expect(response.body.user).toHaveProperty('email', updatedData.email);
        expect(response.body.user).toHaveProperty(
          'location',
          updatedData.location
        );
        expect(response.body.user).toHaveProperty('bio', updatedData.bio);
      });

      // it('should return 400 for passwords that do not match', async () => {
      //   const updatedData = {
      //     username: 'updatedcookname',
      //     firstName: 'Updated',
      //     lastName: 'Cook',
      //     email: 'updatedcook@example.com',
      //     password: 'updatedpassword',
      //     password2: 'mismatchedpassword',
      //     profilePicture: 'url-to-updated-picture',
      //     location: 'Updated Location',
      //     bio: 'Updated Bio',
      //   };

      //   const response = await request(app)
      //     .put('/api/user/cook')
      //     .set('Cookie', `jwt=${token}`)
      //     .send(updatedData);

      //   expect(response.status).toBe(400);
      //   expect(response.body).toHaveProperty('message', 'Passwords do not match');
      // });
    });
  });
});
