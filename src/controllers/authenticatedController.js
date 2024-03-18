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

module.exports.all_posts_post = [
  body(`title`, `Title cannot be empty.`).trim().notEmpty().escape(),
  body(`content`, `Content cannot be empty.`).trim().notEmpty().escape(),
  body(`published`, `Published cannot be empty.`).trim().notEmpty().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();

    // destruct data from body
    const { title, content, published } = req.body;
    const { user } = req;

    const post = new Post({
      creator: user,
      title,
      content,
      published: published === 'true',
    });

    debug(`the post in post post belike: `, post);
    debug(`the user in post post belike: `, user);

    // data valid, user is creator
    if (errors.length === 0 && user.isCreator) {
      await post.save();
      return res.status(200).json({
        post,
        message: `Success`,
      });
    }

    // user is not creator
    if (!req.user.isCreator) return res.sendStatus(403);

    // data invalid
    if (errors.length !== 0) {
      return res.status(400).json({
        post,
        errors,
        message: `Data invalid`,
      });
    }

    // just in case
    res.sendStatus(404);
  }),
];

module.exports.post_put = [
  body(`title`, `Title cannot be empty.`).trim().notEmpty().escape(),
  body(`content`, `Content cannot be empty.`).trim().notEmpty().escape(),
  body(`published`, `Published cannot be empty.`).trim().notEmpty().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();

    // don't trust the client, check every req.params validity
    const isValidId = mongoose.isValidObjectId(req.params.postid);
    if (!isValidId) return res.sendStatus(404);

    // check post existence
    const count = await Post.countDocuments({ _id: req.params.postid }).exec();

    debug(`the count post belike: `, count);

    // destruct data from body
    const { title, content, published } = req.body;

    const post = new Post({
      title,
      content,
      published: published === 'true',
      _id: req.params.postid,
      createdAt: new Date(Date.now()), // update is like create a new post
    });

    // data valid, user is creator, a post exists
    if (count > 0 && errors.length === 0 && req.user.isCreator) {
      await Post.findByIdAndUpdate(req.params.postid, post, {});

      return res.status(200).json({
        post,
        message: `Success`,
      });
    }

    // user is not creator
    if (!req.user?.isCreator) return res.sendStatus(403);

    // data invalid
    if (errors.length !== 0) {
      return res.status(400).json({
        post,
        errors,
        message: `Data invalid`,
      });
    }

    // post not found
    res.sendStatus(404);
  }),
];

module.exports.post_delete = asyncHandler(async (req, res) => {
  // don't trust the client, check every req.params validity
  const isValidId = mongoose.isValidObjectId(req.params.postid);
  if (!isValidId) return res.sendStatus(404);

  const count = await Post.countDocuments({ _id: req.params.postid }).exec();

  // post not null and user is creator
  if (count > 0 && req.user.isCreator) {
    await Post.findByIdAndDelete(req.params.postid);

    // delete all relate comments
    await Comment.deleteMany({ post: req.params.postid });

    return res.sendStatus(200);
  }

  // user not a creator
  if (!req.user.isCreator) return res.sendStatus(403);

  res.sendStatus(404);
});

module.exports.all_comments_post = [
  body(`content`, `Content cannot be empty.`).trim().notEmpty().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();

    // don't trust the client, check every req.params validity
    const isValidId = mongoose.isValidObjectId(req.params.postid);
    if (!isValidId) return res.sendStatus(404);

    const post = await Post.findById(req.params.postid, 'createdAt published').exec();

    const { content } = req.body;

    // post not null, data valid, user is creator or post is published
    if (post !== null && errors.length === 0 && (req.user.isCreator || post.published)) {
      const comment = new Comment({
        content,
        post,
        creator: req.user,
      });

      await comment.save();

      return res.status(200).json({
        message: `Success`,
        comment,
      });
    }

    // user not qualified to comment on private post
    if (!req.user.isCreator && !post.published) return res.sendStatus(403);

    // bad request data
    if (errors.length !== 0) {
      return res.status(400).json({
        message: `Data invalid`,
        errors,
        content,
      });
    }

    res.sendStatus(404);
  }),
];

module.exports.comment_put = [
  body(`content`, `Content cannot be empty.`).trim().notEmpty().escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req).array();

    // don't trust the client, check every req.params validity
    const isValidId = mongoose.isValidObjectId(req.params.commentid);
    if (!isValidId) return res.sendStatus(404);

    const comment = await Comment.findById(req.params.commentid, 'id createdAt').populate('post', 'createdAt published').populate('creator', 'id createdAt').exec();

    const { content } = req.body;

    debug(`the errors in comment put belike: `, errors);
    debug(`the comment.post in comment put belike: `, comment.post);
    debug(`the comment in comment put belike: `, comment);
    debug(`the user in comment put belike: `, req.user);

    if (errors.length === 0 && comment !== null && comment.post.id === req.params.postid && comment.creator.id === req.user.id && (req.user.isCreator || comment.post.published)) {
      const commentUpdate = new Comment({
        content,
        post: comment.post,
        creator: comment.creator,
        _id: comment._id,
        lastModified: new Date(Date.now()),
        createdAt: comment.createdAt,
      });

      await Comment.findByIdAndUpdate(req.params.commentid, commentUpdate, {});

      return res.status(200).json({
        message: `Success`,
        commentBeforeUpdate: comment,
        commentUpdate,
      });
    }

    // user is not creator and post is not published
    if (!req.user.isCreator && !comment.post.published) return res.sendStatus(403);

    // comment no exists
    if (comment === null) return res.sendStatus(404);

    debug(`the req.params.postid belike: `, req.params.postid);
    debug(`the comment.post.id belike: `, comment.post.id);
    debug(`the comment.post._id belike: `, comment.post._id);
    debug(`the comment.creator.id belike: `, comment.creator.id);

    // comment not belong to this post
    if (comment.post.id !== req.params.postid) return res.sendStatus(400);

    // comment not belong to this user
    if (comment.creator.id !== req.user.id) return res.sendStatus(400);

    // data invalid
    if (errors.length !== 0) {
      return res.status(400).json({
        message: `Data invalid`,
        errors,
        content,
      });
    }

    res.sendStatus(404);
  }),
];

module.exports.comment_delete = asyncHandler(async (req, res) => {
  // don't trust the client, check every req.params validity
  const isValidId = mongoose.isValidObjectId(req.params.commentid);
  if (!isValidId) return res.sendStatus(404);

  const comment = await Comment.findById(req.params.commentid, 'id').populate('post', 'createdAt published').populate('creator', 'id createdAt').exec();

  debug(`the comment.post in comment delete belike: `, comment.post);
  debug(`the comment.creator in comment delete belike: `, comment.create);
  debug(`the comment in comment delete belike: `, comment);
  debug(`the user in comment delete belike: `, req.user);

  // post exists, comments exists, comment belong to post and
  // user is creator (can delete any comment) or post is published and its creator is comment's creator
  if (comment !== null && comment.post.id === req.params.postid && (req.user.isCreator || (comment.post.published && comment.creator.id === req.user.id))) {
    await Comment.findByIdAndDelete(req.params.commentid);

    return res.sendStatus(200);
  }

  // user is not creator and post is not published
  if (!req.user.isCreator && !comment.post.published) return res.sendStatus(403);

  // comment no exists
  if (comment === null) return res.sendStatus(404);

  // comment not belong to this post
  if (comment.post.id !== req.params.postid) return res.sendStatus(400);

  // user is not creator and try to delete comment that not theirs
  if (!req.user.isCreator && comment.creator.id !== req.user.id) return res.sendStatus(400);
  // just in case

  res.sendStatus(404);
});
