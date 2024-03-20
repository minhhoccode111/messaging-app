// test
const request = require('supertest');

// another app because don't want to touch the original
const app = require('./setup');

xdescribe(`GET PUT /user`, () => {
  let token;

  // before all authenticate
  beforeAll(async () => {
    // create an account
    await request(app).post('/api/v1/auth/signup').type('form').send({
      fullname: 'khong dieu kien',
      username: 'khongdieukien@gmail.com',
      password: 'Bruh0!0!',
      'confirm-password': 'Bruh0!0!',
    });

    // then login to get token
    const res = await request(app).post('/api/v1/auth/login').type('form').send({ username: 'khongdieukien@gmail.com', password: 'Bruh0!0!' });

    // keep token
    token = res.body.token;
  });
});

xdescribe(`chat group`, () => {
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
      .get('/api/v1/chat/groups/someFakeGroupId')
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
});
