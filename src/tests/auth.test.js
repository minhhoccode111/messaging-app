// test
const request = require('supertest');

// another app because don't want to touch the original
const app = require('./setup');

// signup post
test(`signup post`, (done) => {
  request(app)
    .post('/api/v1/auth/signup')
    .type('form')
    .send({ fullname: 'khong dieu kien', username: 'asdasdasd@gmail.com', password: 'Bruh0!0!', 'confirm-password': 'Bruh0!0!' })
    .then(() => {
      request(app)
        // then login
        .post('/api/v1/auth/login')
        .type('form')
        .send({ username: 'asdasdasd@gmail.com', password: 'Bruh0!0!' })
        .expect(200, done);
    });
});

// login post
xtest(`login post`, (done) => {
  request(app).post('/api/v1/auth/login').type('form').send({ fullname: 'khong dieu kien', username: 'asd@gmail.com', password: 'Bruh0!0!', 'confirm-password': 'Bruh0!0!' }).expect(200, done);
});
