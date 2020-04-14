const app = require('../../src/app');

describe('\'folders\' service', () => {
  it('registered the service', () => {
    const service = app.service('folders');
    expect(service).toBeTruthy();
  });
});
