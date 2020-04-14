const { BadRequest } = require('@feathersjs/errors');
const { dynamicPermissionHook } = require('../users/permissions');
const { get } = require('../../utils/helpers');

module.exports = {
  before: {
    all: [],
    find: [ 
      dynamicPermissionHook(hook => {
        const fetchPath = get(hook, 'params.query.fetch');
        const listPath = get(hook, 'params.query.list');
        if (fetchPath) {
          return `content:read:${fetchPath}`;
        }
        if (listPath) {
          return `content:read:${listPath}`;
        }
        throw new BadRequest('must supply either fetch or list params');
      })
    ],
    get: [ 
      dynamicPermissionHook(hook => `content:read:${hook.id}`)
    ],
    create: [      
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
