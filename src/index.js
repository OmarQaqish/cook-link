const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { app, appListen } = require('./app');

app.listen(process.env.NODE_LOCAL_PORT, appListen);
