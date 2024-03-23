// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// mongoose to check valid req.params.postid
const mongoose = require('mongoose');

// all users that current logged in user can chat with
module.exports.chat_all_user_get = asyncHandler(async (req, res) => {
  // include minimal info
  const users = await User.find({ _id: { $ne: req.user._id } }, '_id fullname status').exec();

  // return extra info req.user because we retrieve it from db anyway
  res.json({ users, requestedUser: req.user });
});

// get conversation with a specific user
module.exports.chat_user_get = asyncHandler(async (req, res) => {
  // check valid mongoose objectid before retrieve db
  const isValidId = mongoose.isValidObjectId(req.params.userid);
  if (!isValidId) return res.sendStatus(404);

  // check if user we want really exists, exclude critical info
  const user = await User.findById(req.params.userid, '-password -username -__v').exec();
  if (user === null) return res.sendStatus(404);

  // get all messages between requested user vs that user
  const messages = await Message.find({ sender: req.user, userReceive: user }).sort({ createdAt: 1 }).exec();

  res.json({ requestedUser: req.user, receivedUser: user, messages });
});

// post a message with a specific user
module.exports.chat_user_post = [
  body('content').trim().escape(),
  body('imageLink')
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (req.body.content && value) throw new Error(`Content and imageLink cannot be both existed`);
      if (!req.body.content && !value) throw new Error(`Content and imageLink cannot be both undefined`);
      return true;
    }),
  asyncHandler(async (req, res) => {
    // check valid mongoose objectid before retrieve db
    const isValidId = mongoose.isValidObjectId(req.params.userid);
    if (!isValidId) return res.sendStatus(404);

    // check if user we want really exists
    const user = await User.findById(req.params.userid, '-password -username -__v').exec();
    if (user === null) return res.sendStatus(404);

    const errors = validationResult(req).array();

    // console.log(errors);

    if (!errors.length) {
      const { imageLink, content } = req.body;

      const message = new Message({
        sender: req.user,
        userReceive: user,
        group: null,
        content,
        imageLink,
      });

      await message.save();

      // all user's messages between current logged in user vs target user
      const messages = await Message.find({ sender: req.user, userReceive: user }).sort({ createdAt: 1 }).exec();

      return res.json({
        requestedUser: req.user,
        receivedUser: user,
        messages,
      });
    }

    // invalid data
    return res.sendStatus(400);
  }),
];
