const mongoose = require('mongoose');
const Org = require('./org.model');
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;
// const config = require('../../config/config');
// // connect to mongo db
// const mongoUri = config.mongo.host;
mongoose.connect('mongodb://localhost/mca', { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${"mongodb://localhost/mca"}`);
});


let orgName = 'Mozzaz';


 Org.addUser(orgName, '5b6a6bedc508c03973e9302d');