// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Message = require('./../models/message');
const Group = require('./../models/group');
const GroupMember = require('./../models/groupMember');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// mongoose to check valid req.params.postid
const mongoose = require('mongoose');

// all users that current logged in user can chat with
module.exports.chat_all_user_get = asyncHandler(async (req, res, next) => {
  const users = await User.find({ _id: { $ne: req.user._id } }, '-password -username -__v').exec();

  // return extra info req.user because we retrieve it from db anyway
  res.json({ users: users, requestedUser: req.user });
});

// get conversation with a specific user
module.exports.chat_user_get = asyncHandler(async (req, res, next) => {
  res.send('chat user get not implemented');
});

// post a message with a specific user
module.exports.chat_user_post = asyncHandler(async (req, res, next) => {
  res.send('chat user post not implemented');
});
