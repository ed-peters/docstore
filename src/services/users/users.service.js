/*
 * TODO anything related to logins (email validation, password management, etc.)
 * TODO validate that you can't create a user with more permissions than yourself
 * TODO audit logging
 */

const { pick } = require('lodash');
const { getOrDie } = require('../../utils/helpers');
const { Conflict, NotFound } = require('@feathersjs/errors');
const { userServiceHooks } = require('./users.hooks');

const listOf = (item) => item ? [ item ] : [];

class Users {

  constructor (options) {
    this.options = options || {};
    this.users = [
      {
        name: 'Root',
        email: 'root@example.com',
        permissions: [ '*' ]
      }
    ];
  }

  async find () {
    return Promise.resolve(this.users.map(x => pick(x, [ 'name', 'email' ])));
  }

  async get (id) {
    const user = this.users[parseInt(id)];
    if (!user) {
      throw new NotFound(`${id} does not exist`);
    }
    return Promise.resolve(user);  
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    const email = getOrDie(data, 'email');
    const user = this.users.find(x => x.email === email);
    if (user) {
      throw new Conflict(`${email} already exists`);
    }
    
    const name = getOrDie(data, 'name');
    const permissions = getOrDie(data, 'permissions');
    const id = this.users.length;
    this.users.push({
      id,
      name,
      email,
      permissions: Array.from(new Set(permissions)),
    });
    return Promise.resolve(this.users[id]);
  }
};

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  app.use('/users', new Users(options, app));
  app.service('users').hooks(userServiceHooks);
};
