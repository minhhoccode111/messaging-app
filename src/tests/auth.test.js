// handle api request
const routes = require('./../routes'); // modular

// test
const request = require('supertest');

// another app because don't want to touch the original
const app = require('./setup');

// things about auth, setup routes and controllers
// app.use('/api/v1/auth', routes.auth);

// login post
xtest(`login post`, (done) => {
  request(app)
    .post('/api/v1/auth/login')
    //
    .expect(200, done);
});

// signup post
xtest(`signup post`, (done) => {
  request(app)
    .post('/api/v1/auth/signup')
    //
    .expect(200, done);
});
