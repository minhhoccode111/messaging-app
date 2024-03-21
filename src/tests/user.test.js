// test
const request = require('supertest');

// fake data
const { faker } = require('@faker-js/faker');

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

  // new data
  const fullname = faker.person.fullName();
  const dateOfBirth = faker.date.past();
  const bio = faker.lorem.paragraph();
  const status = faker.helpers.arrayElement(['online', 'offline', 'busy', 'afk']);
  const avatarLink = faker.image.avatar();

  test(`GET /user valid token`, async () => {
    const res = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.fullname).toMatch(/khong dieu kien/gi); // only fullname exists now
    expect(res.body.dateOfBirth).toBeUndefined();
    expect(res.body.bio).toBeUndefined();
    expect(res.body.status).toBeUndefined();
    expect(res.body.avatarLink).toBeUndefined();
    expect(res.body.updatedAt).toBeUndefined();
    console.log(res.body.user);
  });

  test(`GET /user invalid token`, async () => {
    const res = await request(app).get('/api/v1/user');
    // .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
  });

  test(`PUT /user invalid data type`, async () => {
    // status not valid string
    const invalidStatus = await request(app).put('/api/v1/user').set('Authorization', `Bearer ${token}`).type('form').send({
      status: 'some string',
      fullname,
    });
    expect(invalidStatus.status).toBe(400);

    // status not being sent
    const invalidStatusEmpty = await request(app).put('/api/v1/user').set('Authorization', `Bearer ${token}`).type('form').send({
      status: '',
      fullname,
    });
    expect(invalidStatusEmpty.status).toBe(400);

    // invalid fullname
    const invalidFullname = await request(app).put('/api/v1/user').set('Authorization', `Bearer ${token}`).type('form').send({
      status: 'online',
      fullname: '',
    });
    expect(invalidFullname.status).toBe(400);
  });

  test(`PUT /user valid data`, async () => {
    const res = await request(app).put('/api/v1/user').set('Authorization', `Bearer ${token}`).type('form').send({
      //
      fullname,
      dateOfBirth,
      bio,
      status,
      avatarLink,
    });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.fullname).toBe(fullname);
    expect(new Date(res.body.dateOfBirth).getTime()).toBe(dateOfBirth.getTime());
    expect(res.body.bio).toBe(bio);
    expect(res.body.status).toBe(status);
    expect(res.body.avatarLink).toBe(avatarLink);
  });

  test(`GET /user after being updated`, async () => {
    const res = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/json/);
    expect(res.body.fullname).toBe(fullname);
    expect(new Date(res.body.dateOfBirth).getTime()).toBe(dateOfBirth.getTime());
    expect(res.body.bio).toBe(bio);
    expect(res.body.status).toBe(status);
    expect(res.body.avatarLink).toBe(avatarLink);
  });
});
