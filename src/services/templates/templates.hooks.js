const { staticPermissionHook } = require('../users/permissions');

module.exports = {
  before: {
    all: [],
    find: [ staticPermissionHook('templates:read') ],
    get: [ staticPermissionHook('templates:read') ],
    create: [ staticPermissionHook('templates:write') ],
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
