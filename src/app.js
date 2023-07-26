const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./documentation/swagger.json');
const connectToMongo = require('./db/connection');

const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const dishRoutes = require('./routes/dish');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/auth');
const googleAuthRoutes = require('./routes/googleAuth');
const AuthMiddleware = require('./middlewares/auth');
const addressRoutes = require('./routes/address');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  '/api/cart',
  AuthMiddleware.protectRoute,
  AuthMiddleware.ristrictTo('user'),
  cartRoutes
);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/dish', dishRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/address', addressRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.NODE_LOCAL_PORT, () => {
  console.log(`server listening on port:${process.env.NODE_LOCAL_PORT}`);

  connectToMongo();
});

module.exports = app;
