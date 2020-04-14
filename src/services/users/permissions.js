const { Forbidden, GeneralError } = require('@feathersjs/errors');
const { get } = require('../../utils/helpers');
const logger = require('../../utils/logger');

const matchPart = (permissionPart, actionPart) => {
  if (!permissionPart) {
    return true;
  }
  if (permissionPart.includes(',')) {
    return permissionPart.split(',').includes(actionPart);
  }
  if (permissionPart.includes('*')) {
    return actionPart.startsWith(permissionPart.slice(0, -1));
  }
  return permissionPart === actionPart;
};

const permissionImpliesAction = (permission, action) => {
  if (permission === '*') {
    return true;
  }
  if (permission === action) {
    return true;
  }
  const [ p1, p2, p3 ] = permission.split(':');
  const [ a1, a2, a3 ] = action.split(':');
  return matchPart(p1, a1) && matchPart(p2, a2) && matchPart(p3, a3);
};

const permissionSetImpliesAction = (permissions, action) => {
  const impliedBy = permissions.find(x => permissionImpliesAction(x, action));
  return Boolean(impliedBy);
};

const checkPermissions = (userId, permissions, action) => {
  if (!permissions) {
    logger.error(`oops! no user permissions available for ${JSON.stringify(hook)}`);
    throw new GeneralError();
  }
  if (!permissionSetImpliesAction(permissions, action)) {
    logger.warn(`user ${userId} attempted to perform ${action}`);
    throw new Forbidden();
  }
};

const staticPermissionHook =  action => async hook => {
  if (hook.params.provider) {
    const userId = get(hook, 'params.ser.id');
    const permissions = get(hook, 'params.user.permissions');
    checkPermissions(userId, permissions, action);
  }
  return hook;
};

const dynamicPermissionHook =  provider => async hook => {
  const action = provider(hook);
  const staticHook = staticPermissionHook(action);
  return staticHook(hook);
};

const checkServicePermission = (params, action) => {
  const userId = get(params, 'user.id');
  const permissions = get(params, 'user.permissions');
  checkPermissions(userId, permissions, action);
};

module.exports = {
  permissionImpliesAction,
  permissionSetImpliesAction,
  staticPermissionHook,
  dynamicPermissionHook,
  checkServicePermission,
  loadUserHook: async hook => {
    if (hook.params.provider && !hook.params.user) {
      const userId = get(hook, 'params.query.asUser') || 0;
      const user = await hook.app.service('users').get(userId);
      hook.params.user = user;
      logger.debug(`using user: ${JSON.stringify(user, null, 2)}`);  
    }
    return hook;
  }
};
