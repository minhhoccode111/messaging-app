// add default data in database
const bcrypt = require('bcrypt');

// to access environment variables
require('dotenv').config(); // this line cause me 30 mins to deBUG

const User = require('./../src/models/user');
const Message = require('./../src/models/message');
const Group = require('./../src/models/group');
const GroupMember = require('./../src/models/groupMember');

// const custom = require('debug')('debug-custom');
const custom = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || process.env.DEVELOPMENT_MONGO;

custom(mongoDB);

const users = [];
const messages = [];
const groups = [];
const groupMembers = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// fake database documents
const { faker } = require('@faker-js/faker');

const PASSWORD = process.env.USERS_PASSWORD; // asd
const SALT = Number(process.env.SALT); // 10

main().catch((err) => custom(err));

async function main() {
  custom('about to connect to database');
  await mongoose.connect(mongoDB);
  custom('about to insert some documents');
  await createUsers(); // 20
  await createGroups(); // 40
  await createGroupMembers(); // 40
  await createMessages(); // 140
  custom('finishes insert documents');
  await mongoose.connection.close();
  custom('connection closed');
}

async function userCreate(index, username, pw) {
  // password still get hashed
  const password = await bcrypt.hash(pw, SALT);
  const userDetail = {
    // username and password are something that we can control
    username,
    password,
    fullname: faker.person.fullName(),
    dateOfBirth: faker.date.past(),
    bio: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(['online', 'offline', 'busy', 'afk']),
    avatar: faker.image.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const user = new User(userDetail);
  await user.save();

  users[index] = user;
  custom(`adding user: ${user} with raw password: ${pw} at index: ${index}`);
}

async function createUsers() {
  custom(PASSWORD);
  try {
    // create 20 users
    for (let i = 0; i < 20; i++) {
      await userCreate(i, 'asd' + i, PASSWORD);
    }

    const count = await User.countDocuments({}).exec();
    custom(`User models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function messageCreate(index, sender, userReceive, groupReceive, content, imageLink) {
  const messageDetail = {
    sender,
    userReceive,
    groupReceive,
    content,
    imageLink,
    createdAt: faker.date.recent(),
  };

  const message = new Message(messageDetail);
  await message.save();

  messages[index] = message;
  custom(`adding message: ${message}`);
}

async function createMessages() {
  try {
    // create 200 messages
    for (let i = 0; i < 200; i++) {
      // get two different users in case sender is the same userReceive
      const twoUsers = faker.helpers.arrayElements(users, 2);
      const groupReceive = faker.helpers.arrayElement(groups);
      const randomReceiver = faker.helpers.arrayElement([true, false]);

      const content = faker.lorem.paragraph();
      const image = faker.image.avatar();
      const randomContent = faker.helpers.arrayElement([true, false]);

      // sender will always first user
      await messageCreate(
        i,
        twoUsers[0],
        // choose one
        randomReceiver ? twoUsers[1] : null,
        randomReceiver ? null : groupReceive,
        // choose one
        randomContent ? content : null,
        randomContent ? null : image
      );
    }

    const count = await Message.countDocuments({}).exec();
    custom(`Message models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function groupCreate(index) {
  const groupDetail = {
    creator: faker.helpers.arrayElement(users), // pick random a user
    name: faker.person.jobTitle(),
    public: faker.helpers.arrayElement([true, false]),
    bio: faker.lorem.paragraph(),
    avatar: faker.image.avatar(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  };

  const group = new Group(groupDetail);
  await group.save();

  groups[index] = group;
  custom(`adding group: ${group}`);
}

async function createGroups() {
  try {
    // create 40 groups
    for (let i = 0; i < 40; i++) {
      await groupCreate(i);
    }

    const count = await Group.countDocuments({}).exec();
    custom(`Group models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function groupMemberCreate(index, user, group, isCreator) {
  const groupMemberDetail = {
    user,
    group,
    isCreator,
    createdAt: faker.date.recent(),
  };

  const groupMember = new GroupMember(groupMemberDetail);
  await groupMember.save();

  groupMembers[index] = groupMember;
  custom(`adding group member: ${groupMember}`);
}

async function createGroupMembers() {
  try {
    // loop through each group to add members to it
    for (let i = 0; i < groups.length; i++) {
      // then pick random members from users to create an array
      const randomUsers = faker.helpers.arrayElements(users, { min: 3, max: 5 });

      // pick a random user to be the creator of the group
      const creator = faker.helpers.arrayElement(randomUsers);

      // loop through each member to create reference
      for (let j = 0; j < randomUsers.length; j++) {
        await groupMemberCreate(
          i,
          randomUsers[j],
          groups[i],
          // if current user is the group's creator
          randomUsers[j]._id === creator._id
        );
      }
    }

    const count = await GroupMember.countDocuments({}).exec();
    custom(`GroupMember models is having: ${count} documents`);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}
