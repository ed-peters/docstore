const { get, last, pick } = require('lodash');
const { BadRequest } = require('@feathersjs/errors');

module.exports = {

  get,
  last,
  pick,

  getOrDie: (data, key) => {
    const val = get(data, key);
    if (!val) {
      throw new BadRequest(`missing ${key}`);
    }
    return val;
  },

  splitPath: (path) => {
    if (path === '/') {
      return '/';
    }
    const split = path.split('/');
    return {
      parentPath: `/${split.slice(1, -1).join('/')}`,
      name: path === '/' ? '' : last(split)
    };
  }
  
}