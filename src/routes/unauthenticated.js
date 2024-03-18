const express = require('express');
const router = express.Router();

const UnauthenticatedController = require('../controllers/unauthenticatedController');

router.post('/login', UnauthenticatedController.login_post);

router.post('/signup', UnauthenticatedController.signup_post);

router.get('/posts', UnauthenticatedController.all_posts_get);

router.get('/posts/:postid', UnauthenticatedController.post_get);

router.get('/posts/:postid/comments', UnauthenticatedController.all_comments_get);

module.exports = router;
