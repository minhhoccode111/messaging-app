const request = require('supertest');

// to test with something realistic
const faker = require('@faker-js/faker');

// another app because don't want to touch the original
const app = require('./setup');

// TODO this should be use with beforeAll
// signup post
test(`signup post valid`, (done) => {
  request(app)
    .post('/api/v1/auth/signup')
    .type('form')
    .send({ fullname: 'khong dieu kien', username: 'asdasdasd@gmail.com', password: 'Bruh0!0!', 'confirm-password': 'Bruh0!0!' })
    .expect(200)
    // login post
    .then(() => {
      request(app)
        // login correct get 200
        .post('/api/v1/auth/login')
        .type('form')
        .send({ username: 'asdasdasd@gmail.com', password: 'Bruh0!0!' })
        .expect(`Content-Type`, /json/)
        // response correct login data
        // .expect() // TODO correct return json include token
        .expect(200, done);

      request(app)
        // login wrong username
        .post('/api/v1/auth/login')
        .type('form')
        .send({ username: 'asdasdasd', password: 'Bruh0!0!' })
        .expect(400, done);

      request(app)
        // login wrong password
        .post('/api/v1/auth/login')
        .type('form')
        .send({ username: 'asdasdasd@gmail.com', password: 'ruh0!0!' })
        .expect(400, done);
    });
});

test(`signup post invalid username`, (done) => {
  request(app).post('/api/v1/auth/signup').type('form').send({ fullname: 'khong dieu kien', username: 'asdasdasd.gmail.com', password: 'Bruh0!0!', 'confirm-password': 'Bruh0!0!' }).expect(400, done);
});

test(`signup post invalid fullname`, (done) => {
  request(app).post('/api/v1/auth/signup').type('form').send({ fullname: '', username: 'asdasd@gmail.com', password: 'Bruh0!0!', 'confirm-password': 'Bruh0!0!' }).expect(400, done);
});

test(`signup post invalid password too short`, (done) => {
  request(app).post('/api/v1/auth/signup').type('form').send({ fullname: 'khong dieu kien', username: 'asdasd@gmail.com', password: 'Bruh0!', 'confirm-password': 'Bruh0!0!' }).expect(400, done);
});

test(`signup post invalid password not strong`, (done) => {
  request(app).post('/api/v1/auth/signup').type('form').send({ fullname: 'khong dieu kien', username: 'asdasd@gmail.com', password: 'asdasdasd', 'confirm-password': 'Bruh0!0!' }).expect(400, done);
});

test(`signup post invalid confirm-password not match`, (done) => {
  request(app).post('/api/v1/auth/signup').type('form').send({ fullname: 'khong dieu kien', username: 'asdasd@gmail.com', password: 'Bruh0!0!', 'confirm-password': 'asd' }).expect(400, done);
});
