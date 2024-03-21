// test
const request = require('supertest');

// fake data
const { faker } = require('@faker-js/faker');

// model
const User = require('./../models/user');

const bcrypt = require('bcrypt');

const users = [];

async function userCreate(index, username, pw) {
  // password still get hashed
  const password = await bcrypt.hash(pw, 10);
  const userDetail = {
    // username and password are something that we can control
    username,
    password,
    fullname: faker.person.fullName(),
    dateOfBirth: faker.date.past(),
    bio: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['online', 'offline', 'busy', 'afk']),
    avatarLink: faker.image.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const user = new User(userDetail);
  await user.save();

  users[index] = user;
  // console.log(`adding user: ${user} with raw password: ${pw} at index: ${index}`);
}

async function createUsers(number, username = 'asd') {
  try {
    // create 20 users
    for (let i = 0; i < number; i++) {
      await userCreate(i, username + i, 'asd');
    }

    const count = await User.countDocuments({}).exec();
    // console.log(`User models is having: ${count} documents`);
  } catch (error) {
    console.log(`the error is: `, error);
    throw error;
  }
}

// another app because don't want to touch the original
const app = require('./setup');

describe(`/chat/users`, () => {
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
    const res = await request(app).post('/api/v1/auth/login').type('form').send({
      // account use to log in
      username: 'khongdieukien@gmail.com',
      password: 'Bruh0!0!',
    });

    // keep token
    token = res.body.token;

    // create dummy user with username from asd0 ... asd4
    await createUsers(3, 'asd');
  });

  describe(`GET /chat/users - get users current user can chat with`, () => {
    test(`GET /chat/users - return 3 dummy accounts, exclude account requested`, async () => {
      const res = await request(app)
        .get('/api/v1/chat/users')
        // request with khongdieukien account
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      // console.log(res.body);
      expect(res.body.users.length).toBe(3); // 3 accounts
      // security
      expect(res.body.users.every((acc) => acc.username)).toBe(false);
      expect(res.body.users.every((acc) => acc.password)).toBe(false);
      // necessary info required
      expect(res.body.users.every((acc) => acc.fullname)).toBe(true);
      expect(res.body.users.every((acc) => acc._id)).toBe(true);
      expect(res.body.users.every((acc) => acc.id)).toBe(true);
      expect(res.body.users.every((acc) => acc.createdAt)).toBe(true);
    });
  });

  describe(`GET /chat/users/:userid - current user get all messages with another user`, () => {
    //
  });

  describe(`POST /chat/users/:userid - current user post a message with another user`, () => {
    //
  });
});
