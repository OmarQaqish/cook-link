const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const dishesRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/api/cooks', cookRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/dishes', dishesRoutes);
// app.use('/api/orders', orderRoutes);

app.listen(process.env.NODE_LOCAL_PORT, () => {
  console.log(`server listening on port:${process.env.NODE_LOCAL_PORT}`);
});
