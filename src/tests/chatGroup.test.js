// test
const request = require('supertest');

// fake data
const { faker } = require('@faker-js/faker');

// hash password
const bcrypt = require('bcrypt');

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
  // const groups = { 0: {private: new Group, public: new Group}, 1: {private: new Group, public: new Group} };
  const groups = { 0: {}, 1: {} };

  // before all authenticate
  beforeAll(async () => {
    // create 2 dummy accounts
    users[0] = new User({
      fullname: '0',
      username: 'asd0',
      password: await bcrypt.hash('asd', 10),
    });
    await users[0].save();

    users[1] = new User({
      fullname: '1',
      username: 'asd1',
      password: await bcrypt.hash('asd', 10),
    });
    await users[1].save();

    // each account create 2 groups, 1 public 1 private
    groups[0].public = await new Group({ creator: users[0], name: 'group0 public', public: true, bio: 'group0 bio' }).save();
    groups[0].private = await new Group({ creator: users[0], name: 'group0 private', public: false, bio: 'group0 bio' }).save();
    groups[1].public = await new Group({ creator: users[1], name: 'group1 public', public: true, bio: 'group0 bio' }).save();
    groups[1].private = await new Group({ creator: users[1], name: 'group1 private', public: false, bio: 'group0 bio' }).save();

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
    xdescribe(`GET & POST /chat/groups`, () => {
      test(`GET /chat/groups - return 3 categories: joined (or created) groups, public groups (not joined), private groups (not joined)`, async () => {
        const res = await request(app)
          .get('/api/v1/chat/groups')
          // request with user[0] account
          .set('Authorization', `Bearer ${token0}`);

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);

        // match requested user
        expect(res.body.requestedUser).toBeDefined();
        expect(res.body?.requestedUser?.fullname).toEqual(users[0].fullname);

        expect(new Date(res.body?.requestedUser?.createdAt).getTime()).toEqual(users[0].createdAt.getTime());

        // 3 joined groups, 2 created, 1 joined users[1]'s private group
        expect(res.body.joinedGroups).toBeDefined();
        expect(res.body.joinedGroups.length).toBe(3);
        // compare name
        expect(res.body.joinedGroups.some((gr) => gr.name === groups[0].private.name)).toBe(true);
        expect(res.body.joinedGroups.some((gr) => gr.name === groups[0].public.name)).toBe(true);
        expect(res.body.joinedGroups.some((gr) => gr.name === groups[1].private.name)).toBe(true);

        // 1 public group not join
        expect(res.body.publicGroups).toBeDefined();
        expect(res.body.publicGroups.length).toBe(1);
        expect(res.body.publicGroups.some((gr) => gr.name === groups[1].public.name)).toBe(true);

        // 0 private group not join
        expect(res.body.privateGroups).toBeDefined();
        expect(res.body.privateGroups.length).toBe(0);

        const res1 = await request(app)
          .get('/api/v1/chat/groups')
          // request with user[1] account
          .set('Authorization', `Bearer ${token1}`);

        // users[1] is pretty much the same but 1 private group not join
        expect(res1.body.privateGroups).toBeDefined();
        expect(res1.body.privateGroups.length).toBe(1);
        expect(res1.body.privateGroups.some((gr) => gr.name === groups[0].private.name)).toBe(true);
      });

      describe(`POST /chat/groups - try invalid data`, () => {
        test(`invalid group name`, async () => {
          const res = await request(app)
            .post('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'length7', public: 'true', bio: 'khong dieu kien' });
          expect(res.status).toBe(400);

          const res1 = await request(app)
            .post('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'someStringLongerThan60'.padStart(61, 'x'), public: 'true', bio: 'khong dieu kien' });

          expect(res1.status).toBe(400);

          const res2 = await request(app)
            .post('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            // group name exists
            .send({ name: 'group1 private', public: 'true', bio: 'this is a valid bio' });

          expect(res2.status).toBe(400);
          expect(res2.body.errors).toContain('Group name exists.');
        });

        test(`invalid group bio`, async () => {
          const res = await request(app)
            .post('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'length08', public: 'false', bio: '' });

          expect(res.status).toBe(400);

          const res1 = await request(app)
            .post('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'length08', public: 'false', bio: 'someStringLongerThan260'.padStart(261, 'x') });

          expect(res1.status).toBe(400);
        });
      });

      describe(`POST /chat/groups - valid data`, () => {
        test(`create a new private group use users[0]`, async () => {
          const res = await request(app)
            .post('/api/v1/chat/groups')
            // request with user[0] account
            .set('Authorization', `Bearer ${token0}`)
            .type('form')
            .send({ name: 'new group of user 0 private', public: 'false', bio: 'new groups of user 0 private', avatarLink: faker.image.avatar() });

          const { requestedUser, createdGroup } = res.body;

          expect(res.status).toBe(200);
          expect(res.headers[`content-type`]).toMatch(/json/gi);
          expect(requestedUser.fullname).toMatch(users[0].fullname);
          expect(createdGroup.creator.fullname).toMatch(users[0].fullname);
          expect(createdGroup.name).toMatch(/new group of user 0 private/gi);
        });

        test(`GET /chat/groups - users[1] now have 2 private groups not joined`, async () => {
          const res = await request(app)
            .get('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`);

          expect(res.body.privateGroups).toBeDefined();
          expect(res.body.privateGroups.length).toBe(2);
        });

        test(`create a new public group use users[1]`, async () => {
          const res = await request(app)
            .post('/api/v1/chat/groups')
            // request with user[0] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'new group of user 1 public', public: 'true', bio: 'new groups of user 1 public', avatarLink: faker.image.avatar() });

          const { requestedUser, createdGroup } = res.body;

          expect(res.status).toBe(200);
          expect(res.headers[`content-type`]).toMatch(/json/gi);
          expect(requestedUser.fullname).toMatch(users[1].fullname);
          expect(createdGroup.creator.fullname).toMatch(users[1].fullname);
          expect(createdGroup.name).toMatch(/new group of user 1 public/gi);
        });

        test(`GET /chat/groups - users[0] now get 2 public groups not joined`, async () => {
          const res = await request(app)
            .get('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token0}`);

          expect(res.body.publicGroups).toBeDefined();
          expect(res.body.publicGroups.length).toBe(2);
        });
      });
    });

    describe(`DELETE & PUT /chat/groups/:groupid`, () => {
      xdescribe(`DELETE /chat/groups/:groupid - invalid request (not group's creator) or group not exists`, () => {
        test(`users[0] try to delete groups[1] public (users[1] created)`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set('Authorization', `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(403);
        });

        test(`group not exist`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/someRandomString`)
            // request with user[1] account
            .set('Authorization', `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(404);
        });
      });

      xdescribe(`DELETE /chat/groups/:groupid - valid request`, () => {
        test(`users[0] delete his groups[0].private group`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/${groups[0].private._id}`)
            // request with user[0] account
            .set('Authorization', `Bearer ${token0}`);

          // success
          expect(res.status).toBe(200);
        });

        test(`GET /chat/groups - users[1] now have 0 private groups not joined`, async () => {
          const res = await request(app)
            .get('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`);

          expect(res.body.privateGroups).toBeDefined();
          expect(res.body.privateGroups.length).toBe(0);
        });

        test(`users[0] delete his groups[0].public group`, async () => {
          const res = await request(app)
            .delete(`/api/v1/chat/groups/${groups[0].public._id}`)
            // request with user[0] account
            .set('Authorization', `Bearer ${token0}`);

          // success
          expect(res.status).toBe(200);
        });

        test(`GET /chat/groups - users[1] now have 2 joined groups left (both own)`, async () => {
          const res = await request(app)
            .get('/api/v1/chat/groups')
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`);

          expect(res.body.privateGroups).toBeDefined();
          expect(res.body.joinedGroups.length).toBe(2);
        });
      });

      xdescribe(`PUT /chat/groups/:groupid - invalid request`, () => {
        test(`not group's creator`, async () => {
          const res = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[0] account
            .set('Authorization', `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(403);
        });

        test(`group not exists`, async () => {
          const res = await request(app)
            .put(`/api/v1/chat/groups/someRandomString`)
            // request with user[0] account
            .set('Authorization', `Bearer ${token0}`);

          // forbidden
          expect(res.status).toBe(404);
        });

        test(`invalid group name`, async () => {
          const res = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'length7', public: 'true', bio: 'khong dieu kien' });
          expect(res.status).toBe(400);

          const res1 = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'someStringLongerThan60'.padStart(61, 'x'), public: 'true', bio: 'khong dieu kien' });

          expect(res1.status).toBe(400);
        });

        test(`group name already existed`, async () => {
          const res2 = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            // group name exists
            .send({ name: 'group1 private', public: 'true', bio: 'this is a valid bio' });

          expect(res2.status).toBe(400);
          expect(res2.body.errors).toContain('Group name exists.');
        });

        test(`invalid group bio`, async () => {
          const res = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'length08', public: 'false', bio: '' });

          expect(res.status).toBe(400);

          const res1 = await request(app)
            .put(`/api/v1/chat/groups/${groups[1].public._id}`)
            // request with user[1] account
            .set('Authorization', `Bearer ${token1}`)
            .type('form')
            .send({ name: 'length08', public: 'false', bio: 'someStringLongerThan260'.padStart(261, 'x') });

          expect(res1.status).toBe(400);
        });
      });

      xdescribe(`PUT /chat/groups/:groupid - valid request`, () => {
        test(`users[0] update public group (which users[1] joined)`, async () => {
          const beforeUpdate = groups[0].public;

          const updateData = { name: 'new name of users[0] public group', public: 'false', bio: 'change to private and also this bio', avatarLink: faker.image.avatar() };

          const res = await request(app)
            .put(`/api/v1/chat/groups/${groups[0].public._id}`)
            // request with user[0] account
            .set('Authorization', `Bearer ${token0}`)
            .type('form')
            .send(updateData);

          expect(res.status).toBe(200);
          expect(res.headers['content-type']).toMatch(/json/);

          // match user sent request
          expect(res.body?.requestedUser?.fullname).toMatch(users[0]?.fullname);

          // match update data
          expect(res.body?.updatedGroup?.name).toMatch(updateData.name);
          expect(res.body?.updatedGroup?.bio).toMatch(updateData.bio);
          expect(res.body?.updatedGroup?.avatarLink).toMatch(updateData.avatarLink);
          expect(res.body?.updatedGroup?.public).toBe(false);
        });

        test(`check again with GET /chat/groups`, async () => {
          //
        });
      });
    });
  });

  describe(`GET & POST /chat/groups/:groupid - work with group's messages`, () => {
    // TODO should work like /chat/users/:userid
    // but
  });

  xdescribe(`GET & POST /chat/groups/:groupid/members, DELETE /chat/groups/:groupid/members/:memberid - work with group's members`, () => {
    // TODO
  });
});
