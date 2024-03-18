// add default data in database
const bcrypt = require('bcrypt');
require('dotenv').config(); // this line cause me 30 mins to deBUG

const User = require('./../src/models/user');
const Post = require('./../src/models/post');
const Comment = require('./../src/models/comment');

// const custom = require('debug')('debug-custom');
const custom = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:xImH0F6m9Rg4EIQX@cluster0.qqat537.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

custom(mongoDB);

const users = [];
const posts = [];
const comments = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const userCreate = async (index, fullname, username, password, isCreator) => {
  const userDetail = { fullname, username, password, isCreator };
  const user = new User(userDetail);
  await user.save();
  users[index] = user;
  custom(`adding: ${fullname} with _id: ${user._id}`);
};

const postCreate = async (index, title, content, creator, published) => {
  const postDetail = {
    title,
    content,
    creator,
    published,
  };
  const post = new Post(postDetail);
  await post.save();
  posts[index] = post;
  custom(`adding ${title} with id: ${post._id}`);
};

const commentCreate = async (index, content, creator, post) => {
  const commentDetail = {
    content,
    creator,
    post,
  };
  const comment = new Comment(commentDetail);
  await comment.save();
  comments[index] = comment;
  custom(`adding ${content} with id: ${comment._id}`);
};

main().catch((err) => custom(err));

async function main() {
  custom('about to connect to database');
  await mongoose.connect(mongoDB);
  custom('about to insert some documents');
  await createUsers();
  await createPosts();
  await createComments();
  custom('finishes insert documents');
  await mongoose.connection.close();
  custom('connection closed');
}

async function createUsers() {
  custom(process.env.USERS_PASSWORD);
  try {
    // why my editor says that we don't need await but will throw an error when don't have await? Is it because documents?
    const pw0 = await bcrypt.hash(process.env.USERS_PASSWORD, Number(process.env.SALT));
    const pw1 = await bcrypt.hash(process.env.USERS_PASSWORD, Number(process.env.SALT));
    const pw2 = await bcrypt.hash(process.env.USERS_PASSWORD, Number(process.env.SALT));
    const pw3 = await bcrypt.hash(process.env.USERS_PASSWORD, Number(process.env.SALT));

    await userCreate(0, 'Author User 0', 'authoruser0', pw0, true);
    await userCreate(1, 'Author User 1', 'authoruser1', pw1, true);
    await userCreate(2, 'Normal User 0', 'normaluser0', pw2, false);
    await userCreate(3, 'Normal User 1', 'normaluser1', pw3, false);

    const count = await User.countDocuments({}).exec();
    custom(`User models is having: ${count} documents`);
    custom(`Users passwords are: `, pw0, pw1, pw2, pw3);
  } catch (error) {
    custom(`the error is: `, error);
    throw error;
  }
}

async function createPosts() {
  // published posts
  await postCreate(0, 'Testing post 0', 'This post is created by author user 0', users[0], true);
  await postCreate(1, 'Testing post 1', 'This post is created by author user 1', users[1], true);
  // private posts
  await postCreate(2, 'Testing post 2', 'This post is created by author user 0', users[0], false);
  await postCreate(3, 'Testing post 3', 'This post is created by author user 1', users[1], false);

  const count = await Post.countDocuments({}).exec();
  custom(`Post models is having: ${count} documents`);
}

async function createComments() {
  // 4 users comment on 1 post
  await commentCreate(0, 'user 0 create this comment in post 0', users[0], posts[0]);
  await commentCreate(1, 'user 1 create this comment in post 0', users[1], posts[0]);
  await commentCreate(2, 'user 2 create this comment in post 0', users[2], posts[0]);
  await commentCreate(3, 'user 3 create this comment in post 0', users[3], posts[0]);

  // 4 users comment on 1 post
  await commentCreate(5, 'user 0 create this comment in post 1', users[0], posts[1]);
  await commentCreate(6, 'user 1 create this comment in post 1', users[1], posts[1]);
  await commentCreate(7, 'user 2 create this comment in post 1', users[2], posts[1]);
  await commentCreate(8, 'user 3 create this comment in post 1', users[3], posts[1]);

  // 4 users comment on 1 post
  await commentCreate(9, 'user 0 create this comment in post 2', users[0], posts[2]);
  await commentCreate(10, 'user 1 create this comment in post 2', users[1], posts[2]);
  await commentCreate(11, 'user 2 create this comment in post 2', users[2], posts[2]);
  await commentCreate(12, 'user 3 create this comment in post 2', users[3], posts[2]);

  // 4 users comment on 1 post
  await commentCreate(13, 'user 0 create this comment in post 3', users[0], posts[3]);
  await commentCreate(14, 'user 1 create this comment in post 3', users[1], posts[3]);
  await commentCreate(15, 'user 2 create this comment in post 3', users[2], posts[3]);
  await commentCreate(16, 'user 3 create this comment in post 3', users[3], posts[3]);

  const count = await Comment.countDocuments({}).exec();
  custom(`Comment models is having: ${count} documents`);
}
