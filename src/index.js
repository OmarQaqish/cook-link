const { app, appListen } = require('./app');

app.listen(process.env.NODE_LOCAL_PORT, appListen);
