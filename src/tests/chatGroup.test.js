// test
const request = require('supertest');

// fake data
const { faker } = require('@faker-js/faker');

// another app because don't want to touch the original
const app = require('./setup');

// models
const Group = require('./../models/group');
const GroupMember = require('./../models/groupMember');
const User = require('./../models/user');
const Message = require('./../models/message');

describe(`/chat/groups`, () => {
  let token;
  let user;

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

    // keep requested user's info
    user = res.body.user;

    // keep token
    token = res.body.token;
  });

  describe(`GET & POST /chat/groups, DELETE & PUT /chat/groups/:groupid - work with the group(s)`, () => {
    //
  });

  xdescribe(`GET, POST - work with the group's messages`, () => {
    //
  });

  describe(`GET & POST /chat/groups/:groupid/members, DELETE /chat/groups/:groupid/members/:memberid - work with group's members`, () => {
    //
  });
});
