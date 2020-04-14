const { staticPermissionHook } = require('./permissions');

module.exports = {
  userServiceHooks: {
    before: {
      find: [ staticPermissionHook('users:list') ],
      get: [ staticPermissionHook('users:inspect') ],
      create: [ staticPermissionHook('users:create') ],
    }
  }
};
