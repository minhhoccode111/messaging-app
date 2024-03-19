// handle api request
const routes = require('./../routes'); // modular

// test
const request = require('supertest');

// another app because don't want to touch the original
const app = require('./setup');

// things about auth, setup routes and controllers
// app.use('/api/v1/user', routes.auth);

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
