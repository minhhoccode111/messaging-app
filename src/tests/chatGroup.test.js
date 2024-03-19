// handle api request
const routes = require('./../routes'); // modular

// test
const request = require('supertest');

// another app because don't want to touch the original
const app = require('./setup');

// things about chat, need authenticate
// app.use('/api/v1/chat', passport.authenticate('jwt', { session: false }), routes.chat);
// app.use('/api/v1/chat', routes.chat);

// get chat groups
test(`get chat groups`, (done) => {
  request(app)
    .get('/api/v1/chat/groups')
    //
    .expect(200, done);
});

// post chat groups
test(`post chat group`, (done) => {
  request(app)
    .post('/api/v1/chat/groups')
    //
    .expect(200, done);
});

// get chat group
test(`get chat group`, (done) => {
  request(app)
    .post('/api/v1/chat/groups/someFakeGroupId')
    //
    .expect(200, done);
});

// post chat group
test(`post chat group`, (done) => {
  request(app)
    .post('/api/v1/chat/groups/someFakeGroupId')
    //
    .expect(200, done);
});

// delete chat group
test(`delete chat group`, (done) => {
  request(app)
    .delete('/api/v1/chat/groups/someFakeGroupId')
    //
    .expect(200, done);
});

// put chat group
test(`put chat group`, (done) => {
  request(app)
    .put('/api/v1/chat/groups/someFakeGroupId')
    //
    .expect(200, done);
});
