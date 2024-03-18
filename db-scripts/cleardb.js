// clear database
const User = require('./../src/models/user');
const Post = require('./../src/models/post');
const Comment = require('./../src/models/comment');

// const debug = require('debug')('custom');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] ?? 'mongodb+srv://minhhoccode111:xImH0F6m9Rg4EIQX@cluster0.qqat537.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

debug(mongoDB);

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  debug('about to clear database');
  await clearPost();
  await clearUser();
  await clearComment();
  debug('database cleared');
  debug('about to close connection');
  await mongoose.connection.close();
  debug('connection closed');
}

async function clearUser() {
  await User.deleteMany({}).exec();
  const count = await User.countDocuments({}).exec();
  debug(`User models is having: ${count} documents`);
  debug('User cleared!');
}

async function clearPost() {
  await Post.deleteMany({}).exec();
  const count = await Post.countDocuments({}).exec();
  debug(`Post models is having: ${count} documents`);
  debug('Post cleared!');
}

async function clearComment() {
  await Comment.deleteMany({}).exec();
  const count = await Comment.countDocuments({}).exec();
  debug(`Comment models is having: ${count} documents`);
  debug('Comment cleared!');
}
