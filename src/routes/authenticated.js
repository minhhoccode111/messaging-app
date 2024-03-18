const express = require('express');
const router = express.Router();

const AuthenticatedController = require('../controllers/authenticatedController');

router.post('/posts', AuthenticatedController.all_posts_post);

router.put('/posts/:postid', AuthenticatedController.post_put);

router.delete('/posts/:postid', AuthenticatedController.post_delete);

router.post('/posts/:postid/comments', AuthenticatedController.all_comments_post);

router.put('/posts/:postid/comments/:commentid', AuthenticatedController.comment_put);

router.delete('/posts/:postid/comments/:commentid', AuthenticatedController.comment_delete);

module.exports = router;
