const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');
// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
const blobService = require('./blob.service');
// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
// blobService.saveImage('testImage1.png', 'uploads/image1.png');
// blobService.saveAudio('testImage1.png', 'uploads/image1.png');
// blobService.saveVideo('testImage1.png', 'uploads/image1.png');
// blobService.saveDocument('testImage1.png', 'uploads/image1.png');
// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(mongoUri, {useCreateIndex: true,
  useNewUrlParser: true, server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

module.exports = app;
