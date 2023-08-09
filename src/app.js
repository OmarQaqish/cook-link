const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Frontend routes
app.get('/', (req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.render('homepage', { user });
  } else {
    res.render('homepage', { user: null }); // No token, user not authenticated
  }
});

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/signout', (req, res) => {
  res.redirect('/api/auth/signout');
});

// API routes
app.use(
  '/api/cart',
  AuthMiddleware.protectRoute,
  AuthMiddleware.restrictTo('user'),
  cartRoutes
);
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/dish', dishRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/address', addressRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const appListen = async () => {
  console.log(`server listening on port:${process.env.NODE_LOCAL_PORT}`);

  await connectToMongo();
  app.emit('appStarted');
};

module.exports = { app, appListen };
