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
  let token0;
  let token1;
  const users = {};
  const groups = { 0: {}, 1: {} };

  // before all authenticate
  beforeAll(async () => {
    // create 2 dummy accounts
    users[0] = new User({
      fullname: '0',
      username: 'asd0',
      password: 'asd',
    });
    await users[0].save();

    users[1] = new User({
      fullname: '1',
      username: 'asd1',
      password: 'asd',
    });
    await users[1].save();

    // each account create 2 groups, 1 public 1 private
    groups[0].public = new Group({ creator: users[0], name: 'group0 public', public: true, bio: 'group0 bio' });
    groups[0].private = new Group({ creator: users[0], name: 'group1 private', public: false, bio: 'group0 bio' });
    groups[1].public = new Group({ creator: users[1], name: 'group1 public', public: true, bio: 'group0 bio' });
    groups[1].private = new Group({ creator: users[1], name: 'group1 private', public: false, bio: 'group0 bio' });

    // create connections, who create group
    await new GroupMember({ user: users[0], group: groups[0].public, isCreator: true }).save();
    await new GroupMember({ user: users[0], group: groups[0].private, isCreator: true }).save();
    await new GroupMember({ user: users[1], group: groups[1].public, isCreator: true }).save();
    await new GroupMember({ user: users[1], group: groups[1].private, isCreator: true }).save();
    // 1 extra user0 joined user1's private group
    await new GroupMember({ user: users[0], group: groups[1].private, isCreator: false }).save();
    // 1 extra user1 joined user0's public group
    await new GroupMember({ user: users[1], group: groups[0].public, isCreator: false }).save();

    // then them login to get tokens
    const res0 = await request(app).post('/api/v1/auth/login').type('form').send({
      // account use to log in
      username: 'asd0',
      password: 'asd',
    });

    const res1 = await request(app).post('/api/v1/auth/login').type('form').send({
      // account use to log in
      username: 'asd1',
      password: 'asd',
    });

    // keep login token
    token0 = res0.body.token;
    token1 = res1.body.token;
  });

  describe(`GET & POST /chat/groups, DELETE & PUT /chat/groups/:groupid - work with the group(s)`, () => {
    test(`GET & POST /chat/groups`, async () => {
      //
    });
  });

  xdescribe(`GET, POST - work with the group's messages`, () => {
    //
  });

  describe(`GET & POST /chat/groups/:groupid/members, DELETE /chat/groups/:groupid/members/:memberid - work with group's members`, () => {
    //
  });
});
