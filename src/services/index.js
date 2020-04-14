const users = require('./users/users.service.js');
const content = require('./content/content.service.js');
const templates = require('./templates/templates.service.js');

module.exports = function (app) {
  app.configure(users);
  app.configure(content);
  app.configure(templates);
};
