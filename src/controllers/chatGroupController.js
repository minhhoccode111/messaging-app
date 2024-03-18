// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const Post = require('./../models/post');
const Comment = require('./../models/comment');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// mongoose to check valid req.params.postid
const mongoose = require('mongoose');

// get all group that visible to current logged in user (joined, public)
module.exports.chat_all_group_get = asyncHandler(async (req, res, next) => {
	res.send('chat all group get: not implemented');
});

// current logged in user create a new group (and be group's creator)
module.exports.chat_all_group_post = asyncHandler(async (req, res, next) => {
	res.send('chat all group post: not implemented');
});

// get conversation with a specific group
module.exports.chat_group_get = asyncHandler(async (req, res, next) => {
	res.send('chat group get: not implemented');
});

// post a message with a specific group
module.exports.chat_group_post = asyncHandler(async (req, res, next) => {
	res.send('chat group post: not implemented');
});

// delete a specific group (current logged in user is group's creator)
module.exports.chat_group_delete = asyncHandler(async (req, res, next) => {
	res.send('chat group delete: not implemented');
});

// update a specific group (current logged in user is group's creator)
module.exports.chat_group_put = asyncHandler(async (req, res, next) => {
	res.send('chat group put: not implemented');
});
