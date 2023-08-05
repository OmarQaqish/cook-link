const request = require('supertest');
const { app, appListen } = require('../../app');
const Address = require('../../models/address');
const User = require('../../models/user');

const signIn = async (email, password) => {
  return request(app)
    .post('/api/auth/signin')
    .send(`email=${email}&password=${password}`)
    .expect('Content-Type', /json/)
    .then((res) => res.body.JWTtoken);
};

const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
};

describe('GET /api/address/addresses', () => {
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

  it('should fetch all addresses for admins', async () => {
    const allAddresses = await Address.find();

    const response = await request(app)
      .get('/api/address/addresses')
      .set('Cookie', `jwt=${token}`)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(allAddresses.length);

    response.body.forEach((address) => {
      expect(address).toHaveProperty('street');
      expect(typeof address.street).toBe('string');
      expect(address).toHaveProperty('buildingNumber');
      expect(typeof address.buildingNumber).toBe('number');
    });
  });

  it('should return 403 for non-admin users', async () => {
    const userToken = await signIn(
      process.env.TEST_EMAIL_USER,
      process.env.TEST_PASSWORD_USER
    );

    const response = await request(app)
      .get('/api/address/addresses')
      .set('Cookie', `jwt=${userToken}`)
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body).toHaveProperty(
      'message',
      'you do not have permission to perform this action'
    );
  });
});

describe('Address Routes for User', () => {
  let server = null;
  let token = '';
  let testUser = null;
  let otherUser = null;
  let addressId = null;
  let testUserId = null;
  let otherUserId = null;
  const newAddress = {
    street: 'Test Street',
    buildingNumber: 10,
    apartmentNumber: 20,
    neighborhood: 'Test Neighborhood',
    district: 'Test District',
    city: 'Test City',
    country: 'Test Country',
    postalCode: 12345,
  };

  beforeAll(async () => {
    server = app.listen(process.env.NODE_LOCAL_PORT, appListen);

    // Step 1: Create the test user by registering a new user
    testUser = {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuseraddress@example.com',
      password: 'testpassword',
      password2: 'testpassword',
    };

    // Register the test user
    const response = await request(app)
      .post('/api/auth/signup')
      .send(testUser)
      .expect(201);

    testUserId = response.body.data._id;

    // Step 2: Sign in as the test user and get the authentication token
    token = await signIn(testUser.email, testUser.password);
  });

  afterAll(async () => {
    // Step 4: Delete the test user at the end

    await deleteUser(testUserId);
    await deleteUser(otherUserId);

    server.close();
    // ... Your test cases will be added here
  });
  describe('POST /api/address', () => {
    it('should add a new address for an authenticated user without an address', async () => {
      const response = await request(app)
        .post('/api/address')
        .set('Cookie', `jwt=${token}`)
        .send(newAddress)
        .expect('Content-Type', /json/)
        .expect(201);

      addressId = response.body.address._id;

      expect(response.body).toHaveProperty(
        'message',
        'Address added successfully'
      );
      expect(response.body).toHaveProperty('address');

      const savedAddress = await Address.findById(addressId);
      expect(savedAddress).toBeTruthy();
      expect(savedAddress.street).toBe(newAddress.street);
    });
    // This test works and it passes but it creates an open handle issue with jest:
    // it('should return 400 if the authenticated user already has an address', async () => {
    //   const response = await request(app)
    //     .post('/api/address')
    //     .set('Cookie', `jwt=${token}`)
    //     .send(newAddress)
    //     .expect('Content-Type', /json/)
    //     .expect(400);

    //   expect(response.body).toHaveProperty(
    //     'message',
    //     'You already have an address'
    //   );
    // });
  });

  describe('GET /api/address/:id', () => {
    it('should fetch the address for an authenticated user', async () => {
      // Use the addressId created in the POST request test
      const response = await request(app)
        .get(`/api/address/${addressId}`)
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('_id', addressId);
      expect(response.body).toHaveProperty('street', newAddress.street);
      expect(response.body).toHaveProperty(
        'buildingNumber',
        newAddress.buildingNumber
      );
    });

    it('should return 404 if the address does not exist', async () => {
      const fakeAddressId = '64c36f8773ce60654edaf48d'; // Use a non-existing address ID

      const response = await request(app)
        .get(`/api/address/${fakeAddressId}`)
        .set('Cookie', `jwt=${token}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Address not found');
    });
  });
  describe('PUT /api/address/:id', () => {
    it('should update the address for an authenticated user', async () => {
      // Create an updated address object
      const updatedAddress = {
        street: 'Updated Street',
        buildingNumber: 50,
        apartmentNumber: 100,
        neighborhood: 'Updated Neighborhood',
        district: 'Updated District',
        city: 'Updated City',
        country: 'Updated Country',
        postalCode: 54321,
      };

      // Use the testAddressId created in the POST request test
      const response = await request(app)
        .put(`/api/address/${addressId}`) // Use the testAddressId
        .set('Cookie', `jwt=${token}`)
        .send(updatedAddress)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty(
        'message',
        'Address updated successfully'
      );
      expect(response.body).toHaveProperty('address');
      expect(response.body.address).toHaveProperty('_id', addressId);
      expect(response.body.address).toHaveProperty(
        'street',
        updatedAddress.street
      );
      expect(response.body.address).toHaveProperty(
        'buildingNumber',
        updatedAddress.buildingNumber
      );
    });

    it('should return 403 if the user is not authorized to update the address', async () => {
      // Create another test user to simulate unauthorized update
      otherUser = {
        username: 'otheruser',
        firstName: 'Other',
        lastName: 'User',
        email: 'otheruser@example.com',
        password: 'testpassword',
        password2: 'testpassword',
      };

      // Register the other test user
      const res = await request(app)
        .post('/api/auth/signup')
        .send(otherUser)
        .expect(201);

      otherUserId = res.body.data._id;

      // Sign in as the other test user and get the authentication token
      const otherUserToken = await signIn(otherUser.email, otherUser.password);

      // Use the testAddressId created in the POST request test
      const response = await request(app)
        .put(`/api/address/${addressId}`)
        .set('Cookie', `jwt=${otherUserToken}`)
        .send({ street: 'Updated Street' })
        .expect('Content-Type', /json/)
        .expect(403);

      expect(response.body).toHaveProperty(
        'error',
        'You are not authorized to update this address'
      );
    });
    describe('DELETE /api/address/:id', () => {
      it('should delete the address for an authenticated user', async () => {
        // Use the testAddressId created in the POST request test
        const response = await request(app)
          .delete(`/api/address/${addressId}`) // Use the testAddressId
          .set('Cookie', `jwt=${token}`)
          .expect('Content-Type', /json/)
          .expect(200);

        expect(response.body).toHaveProperty(
          'message',
          'Address deleted successfully'
        );

        // Verify that the address is deleted from the database
        const deletedAddress = await Address.findById(addressId);
        expect(deletedAddress).toBeNull();
      });

      it('should return 404 if the address does not exist', async () => {
        const response = await request(app)
          .delete(`/api/address/${addressId}`)
          .set('Cookie', `jwt=${token}`)
          .expect('Content-Type', /json/)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Address not found');
      });
    });
  });
});
