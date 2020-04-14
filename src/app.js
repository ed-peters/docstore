const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./utils/logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');

const middleware = require('./middleware');
const services = require('./services');
const hooks = require('./app.hooks');
const channels = require('./channels');

const app = express(feathers());
app.configure(configuration());
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);

app.configure(services);
app.configure(channels);
app.use(express.notFound());
app.use(express.errorHandler({ logger }));
app.hooks(hooks);

module.exports = app;
