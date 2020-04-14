/*
 * TODO better handling around edge cases of paths (e.g. "/foo/" as a directory)
 * TODO cleaner registration around content path (so we can implement get vs find)
 */

const { getOrDie, splitPath } = require('../../utils/helpers');
const { NotFound, Conflict } = require('@feathersjs/errors');
const { checkServicePermission } = require('../users/permissions');
const hooks = require('./content.hooks');

const initializeContent = () => [{
  id: '0',
  type: 'folder',
  path: '/',
  parentPath: '/',
  name: '/',
  kids: []
}];

class Content {

  setup(app) {
    this.content = initializeContent();
    this.app = app;
  }

  async find (params) {
    const fetchPath = params.query.fetch;
    if (fetchPath) {
      const result = this.content.filter(item => item.path === fetchPath);
      if (!result) {
        throw new NotFound();
      }
      return Promise.resolve(result);
    }
    const listPath = params.query.list;
    const data = this.content.filter(item => item.parentPath === listPath);
    return Promise.resolve(data);
  }

  async get (id, params) {
    const result = this.content.filter(item => item.id === id);
    if (!result) {
      throw new NotFound(id);
    }
    return Promise.resolve(result);
  }

  async create (data, params) {
    const type = getOrDie(data, 'type');
    const path = getOrDie(data, 'path');

    const { parentPath, name } = splitPath(path);

    checkServicePermission(params, `content:write:${parentPath}`);

    const current = this.content.find(x => x.path === path);
    if (current) {
      throw new Conflict(`${path} exists`);
    }

    const parent = this.content.find(x => x.path === parentPath);
    if (!parent || parent.type !== 'folder') {
      throw new Conflict(`parent does not exist or is not a folder`);
    }

    if (type === 'folder') {
      const id = String(this.content.length);
      const folder = {
        id,
        type: 'folder',
        path,
        parentPath: parentPath,
        name,
        kids: []
      };
      this.content[id] = folder;
      parent.kids.push(id);
      return Promise.resolve(folder);
    }
    else {
      const id = String(this.content.length);
      const template = await this.app.service('templates').get(type);
      checkServicePermission(params, `templates:publish:${template.name}`);
      const doc = {
        id,
        type,
        path,
        name,
        content: template.defaultContent || {}
      };
      this.content[id] = doc;
      parent.kids.push(id);
      return Promise.resolve(doc);
    }
  }
};

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  };

  const service = new Content(options, app);
  app.use('/content', service);
  app.service('/content').hooks(hooks);
};
