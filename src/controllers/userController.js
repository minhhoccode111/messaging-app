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

// get info of current logged user
module.exports.user_get = asyncHandler(async (req, res, next) => {
  res.send('user get not implemented');
});

// update info of current logged user
module.exports.user_put = asyncHandler(async (req, res, next) => {
  res.send('user put not implemented');
});

// not implemented
module.exports.user_delete = asyncHandler(async (req, res, next) => {
  res.send('user delete not implemented');
});
