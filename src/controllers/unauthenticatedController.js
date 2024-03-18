// no need for try...catch block
const asyncHandler = require('express-async-handler');

// sanitize and validate data
const { body, validationResult } = require('express-validator');

// mongoose models
const User = require('./../models/user');
const Post = require('./../models/post');
const Comment = require('./../models/comment');

// debug
const debug = require('debug')('xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx');

// bcrypt to secure password
const bcrypt = require('bcrypt');

// will be call jwt.sign() to create a object, and secret and option like algorithm and time expire
const jwt = require('jsonwebtoken');

// work with date and time
const { formatDate } = require('./../methods');

// mongoose to check valid req.params.postid
const mongoose = require('mongoose');

module.exports.login_post = [
  body('username').trim().escape(),
  body('password').trim().escape(),
  asyncHandler(async (req, res) => {
    // extract data from form
    const formUsername = req.body.username;
    const formPassword = req.body.password;
    // check username existed
    const user = await User.findOne({ username: formUsername }, '-__v').exec();
    if (user === null) {
      return res.status(400).json({ message: 'Wrong username' });
    } else {
      // check password match
      const valid = await bcrypt.compare(formPassword, user.password);

      if (!valid) {
        return res.status(400).json({ message: 'Wrong password' });
      }

      const expiresIn = 60 * 60 * 24 * 7; // 7 days

      // * 1000 for milliseconds
      const expiresInDate = new Date(Date.now() + expiresIn * 1000);

      const expiresInDateFormatted = formatDate(expiresInDate);

      // valid username and password
      // token is created using username only
      const token = jwt.sign({ username: formUsername }, process.env.SECRET, { expiresIn });

      debug(`the user found in database belike: `, user);
      debug(`expire time belike: `, 60 * 60 * 24 * 7, ` seconds`);
      debug(`expire time formatted belike: `, expiresInDateFormatted);

      const tmp = user.toJSON();
      // remove password and username
      const { password, username, ...publicUserInfo } = tmp;

      // return info for client to store on their localStorage and check of expire
      return res.status(200).json({
        message: 'Success',
        token,
        user: publicUserInfo,
        expiresIn,
        expiresInDate,
        expiresInDateFormatted,
      });
    }
  }),
];

module.exports.signup_post = [
  body('fullname').trim().notEmpty().withMessage(`Fullname cannot be empty.`).isLength({ max: 50 }).withMessage(`Fullname length cannot pass 50 characters.`).escape(),
  body('username').trim().isLength({ min: 8 }).withMessage(`Username must be at least 8 characters.`).isEmail().withMessage(`Username must be a valid email address.`).escape(),
  body('password')
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(`Password must be between 8 and 32 characters.`)
    .isStrongPassword()
    .withMessage(`Password must contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character.`)
    .escape(),
  body('confirm-password', `Confirm password does not match.`).custom((value, { req }) => req.body.password === value),

  asyncHandler(async (req, res) => {
    let errors = validationResult(req).array();

    const checkExistedUsername = await User.findOne({ username: req.body.username }, 'username').exec();

    // destruct to send back when needed
    const { fullname, username, password } = req.body;

    const user = {
      fullname,
      username,
    };

    // check existence of username
    if (checkExistedUsername !== null) {
      errors.push({
        msg: `Username is already existed.`,
        type: 'field',
        value: username,
        path: 'username',
        location: 'body',
      });
    }

    debug(`The error result is: `, errors);

    // data valid
    if (errors.length === 0) {
      const hashedPassword = await bcrypt.hash(password, Number(process.env.SECRET)); // encode password

      await new User({ ...user, password: hashedPassword, isCreator: false }).save();

      return res.status(200).json({
        message: `Success`,
        user,
      });
    }

    // data invalid
    return res.status(400).json({
      message: `Data invalid`,
      errors,
      user,
    });
  }),
];

module.exports.all_posts_get = asyncHandler(async (req, res) => {
  debug(`the req.user object: `, req.user);
  let posts;

  // creator, get all posts
  if (req.user && req.user?.isCreator) {
    posts = await Post.find({}, '-__v').populate('creator', 'fullname isCreator createdAt').sort({ createdAt: -1 }).exec();
  }

  // viewer, get published posts
  else {
    posts = await Post.find({ published: true }, '-__v').populate('creator', 'fullname isCreator createdAt').sort({ createdAt: -1 }).exec();
  }

  debug(posts);

  return res.status(200).json({
    posts: posts.map((p) => {
      const canModify = req?.user?.isCreator;
      return {
        ...p.toJSON(),
        canModify,
      };
    }),
  });
});

module.exports.post_get = asyncHandler(async (req, res) => {
  debug(`The id belike: `, req.params.postid);
  let post;

  // don't trust the client, check every req.params validity
  const isValidId = mongoose.isValidObjectId(req.params.postid);
  if (!isValidId) return res.sendStatus(404);

  // creator can get unpublished posts
  if (req.user && req.user?.isCreator) {
    post = await Post.findOne({ _id: req.params.postid }, '-__v').populate('creator', 'fullname isCreator createdAt').exec();
  }

  // only published posts
  else {
    post = await Post.findOne({ _id: req.params.postid, published: true }, '-__v').populate('creator', 'fullname isCreator createdAt').exec();
  }

  // valid
  if (post !== null) {
    debug(`the post belike: `, post);

    return res.status(200).json({
      post: {
        ...post.toJSON(),
        canModify: req?.user?.isCreator,
      },
    });
  }

  res.sendStatus(404);
});

module.exports.all_comments_get = asyncHandler(async (req, res) => {
  // don't trust the client, check every req.params validity
  const isValidId = mongoose.isValidObjectId(req.params.postid);
  if (!isValidId) return res.sendStatus(404);

  // in this case, it will benefit when we separately find the
  // post once instead of populate post in  every comments
  const [post, comments] = await Promise.all([
    Post.findById(req.params.postid, '-__v').exec(),
    Comment.find({ post: req.params.postid }, '-__v').populate('creator', 'fullname isCreator createdAt').sort({ createdAt: 1 }).exec(),
  ]);

  debug(`post in all comment get belike: `, post);
  debug(`comments in all comment get belike: `, comments);

  // post exists, post published or user is creator
  if (post !== null && (post.published || req.user?.isCreator)) {
    return res.status(200).json({
      post,
      comments: comments.map((comment) => {
        const canDelete = req.user?.isCreator || req.user?.id === comment.creator.id;

        const canEdit = req.user?.id === comment.creator.id;

        debug(`try to access comment dated: `, comment.createdAtFormatted);

        return {
          ...comment.toJSON(),
          canDelete, // whether current user can delete the comment
          canEdit, // whether current user can edit the comment
        };
      }),
    });
  }

  // user is not creator and try to access private post
  if (!post?.published && !req.user?.isCreator) return res.sendStatus(403);

  // just in case
  res.sendStatus(404);
});
