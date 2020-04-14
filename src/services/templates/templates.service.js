const { get, getOrDie, pick } = require('../../utils/helpers');
const { NotFound } = require('@feathersjs/errors');
const hooks = require('./templates.hooks');

class ContentTypes {
  constructor (options) {
    this.options = options || {};
    this.types = [];
  }

  async find (params) {
    const name = get(params, 'query.name');
    const base = name 
      ? this.types.filter(x => x.name === name)
      : this.types;
    return Promise.resolve(base.map(item => pick(item, [ 'id', 'name' ])));
  }

  async get (id) {
    const result = this.types.find(item => item.id === id);
    if (!result) {
      throw new NotFound(id);
    }
    return Promise.resolve(result);
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    getOrDie(data, 'name');

    const id = String(this.types.length);
    this.types.push({
      id,
      ...data
    });
    return this.get(id);
  }
};

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  app.use('/templates', new ContentTypes(options, app));
  app.service('templates').hooks(hooks);
};
