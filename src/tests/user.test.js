// test
const request = require('supertest');

// another app because don't want to touch the original
const app = require('./setup');

// user get
test(`user get`, (done) => {
  request(app)
    .get('/api/v1/user')
    //
    .expect(200, done);
});

// user put
test(`user put`, (done) => {
  request(app)
    .put('/api/v1/user')
    //
    .expect(200, done);
});
