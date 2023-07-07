const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URL;
const connectToMongo = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;

  db.once('open', () => {
    console.log('Database connected');
  });

  db.on('error', (err) => {
    console.error('Database connection error: ', err);
  });
};

module.exports = connectToMongo;
