const express = require('express');
const bodyParser = require('body-parser');
const connectToMongo = require('./db/connection');
require('dotenv').config();

const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const dishesRoutes = require('./routes/dish');
const orderRoutes = require('./routes/order');
const googleAuthRoutes = require('./routes/googleAuth');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/api/user', userRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/dish', dishesRoutes);
// app.use('/api/order', orderRoutes);
app.use('/api/auth/google', googleAuthRoutes);

app.listen(process.env.NODE_LOCAL_PORT, () => {
  console.log(`server listening on port:${process.env.NODE_LOCAL_PORT}`);

  connectToMongo();
});
