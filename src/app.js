const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const cookRoutes = require('./routes/cook');
const customerRoutes = require('./routes/customer');
const dishesRoutes = require('./routes/cook');
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
