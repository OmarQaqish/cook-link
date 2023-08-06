const path = require('path');
const { app, appListen } = require('./app');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

app.listen(process.env.NODE_LOCAL_PORT, appListen);
