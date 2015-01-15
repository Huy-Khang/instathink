// var Post = require('../models/post');
var User = require('../models/user');
var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var postController = require('../controllers/postController');

router.get('/post/friendwall/:name', auth.isAuthenticatedREST, postController.getFriendWallByName);

router.get('/post/wallpost', auth.isAuthenticatedREST, postController.getWallPost);		//get post for user wall

router.get('/post/newfeed', auth.isAuthenticatedREST, postController.getNewFeed);		//get post for user new feed

router.get('/post/anonymousnewfeed', auth.isAuthenticatedREST, postController.getAnonymousNewFeed);	//get post for user anonymous new feed

router.get('/post/:postId', auth.isAuthenticatedREST, postController.getPostById);		//get a specific post by Id

router.post('/post', auth.isAuthenticatedREST, postController.postPost);		//create new post

router.put('/post/:id', auth.isAuthenticatedREST, postController.putPost);		//update post

router.delete('/post/:postId', auth.isAuthenticatedREST, postController.deletePost);		//delete post

router.put('/post/addLike/:postId', auth.isAuthenticatedREST, function(req, res) {   
    postController.addLike(req.params.postId, {
        UserId: req.user._id,
        DisplayName: req.user.DisplayName,
        LinkPage: req.user.LinkPage
    },req, res);
});																				//like a post

router.put('/post/deleteLike/:postId/:userId', auth.isAuthenticatedREST, function(req, res) {
	postController.deleteLike(req.params.postId, req.params.userId, res);
}); 																			//unlike a post

router.post('/post/image', auth.isAuthenticatedREST, postController.postImage);

router.post('/post/addcomment', auth.isAuthenticatedREST, postController.addComment);																				//comment a post

router.put('/post/deletecomment/:postId/:commentId', auth.isAuthenticatedREST, function(req, res) {
	postController.deleteComment(req.params.postId, req.params.commentId, res);
}); 																			//unlike a post

module.exports = router;