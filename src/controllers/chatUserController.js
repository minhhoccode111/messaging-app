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

// all users that current logged in user can chat with 
module.exports.chat_all_user_get = asyncHandler(async (req, res, next) => {
	res.send('chat all users get not implemented');
});

// get conversation with a specific user
module.exports.chat_user_get = asyncHandler(async (req, res, next) => {
	res.send('chat user get not implemented');
});

// post a message with a specific user
module.exports.chat_user_post = asyncHandler(async (req, res, next) => {
	res.send('chat user post not implemented');
});
