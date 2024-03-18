// custom script to interact with database
const User = require('./../src/models/user');
const Post = require('./../src/models/post');
const Comment = require('./../src/models/comment');

// working with password
const bcrypt = require('bcrypt');

// const debug = require('debug')('custom-debug');
const debug = (...str) => {
  for (const s of str) {
    console.log(s);
  }
};

const mongoDB = process.argv.slice(2)[0] || 'mongodb+srv://minhhoccode111:xImH0F6m9Rg4EIQX@cluster0.qqat537.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

main().catch((err) => debug('some errors occur', err));

async function main() {
  debug('about to connect to database');
  await mongoose.connect(mongoDB);
  const userNum = await User.countDocuments({}).exec();
  const postNum = await Post.countDocuments({}).exec();
  const commentNum = await Comment.countDocuments({}).exec();
  // const users = await User.find({}).exec();
  // const posts = await Post.find({}).exec();
  // const comments = await Comment.find({}).exec();

  // do some custom things

  const password = await bcrypt.hash('asd', Number(process.env.SALT));
  const user = new User({ fullname: 'Default User', username: 'asd', password });
  await user.save();

  // do some custom things

  // debug(`users belike: `, users);
  // debug(`posts belike: `, posts);
  // debug(`comments belike: `, comments);
  debug(`number of user currently in database: ${userNum}`);
  debug(`number of post currently in database: ${postNum}`);
  debug(`number of comment currently in database: ${commentNum}`);
  debug('connected');
  debug('about to disconnect to database');
  await mongoose.connection.close();
}
