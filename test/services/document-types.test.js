const app = require('../../../src/app');

describe('\'/document-types\' service', () => {
  it('registered the service', () => {
    const service = app.service('document-types');
    expect(service).toBeTruthy();
  });
});
