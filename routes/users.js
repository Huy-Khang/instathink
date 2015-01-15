/*
prototype for request related to User
not finish yet
*/

var User = require('../models/user');
var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var userController = require('../controllers/userController');

router.get('/user/search/:name', auth.isAuthenticatedREST, userController.searchUser);
router.get('/user/friend/:name',auth.isAuthenticatedREST, userController.getFriendByName);
router.get('/user/friendbyid/:id',auth.isAuthenticatedREST, userController.getFriendById);
router.get('/user/profile', auth.isAuthenticatedREST, userController.getUserById);
router.get('/user/photos', auth.isAuthenticatedREST, userController.getPhotosUserById);
router.post('/user/profile', userController.postUser);
router.put('/user/profile', auth.isAuthenticatedREST, userController.putUserProfile);
router.post('/user/avatar', auth.isAuthenticatedREST, userController.postAvatar);
router.post('/user/password', auth.isAuthenticatedREST, userController.putPassword);

router.post('/user/not', auth.isAuthenticatedREST, function(req, res){	//test route for add not
	userController.postNotification(req.user._id, {
		Link: 'link 2',
		Description: 'mo ta 2',
		Seen: false
	});
});

router.post('/user/changenot/:id', auth.isAuthenticatedREST, function(req, res){	//test route for change state seen note
	userController.changeSeenNotification(req.user._id, req.params.id);
});

router.get('/user/search?', function(req, res){
	userController.searchUser(req, res);
});

// router.get('/user/chat/update', auth.isAuthenticatedREST, userController.updateChatByUser);

/*
còn cần những gì nữa? 
ai làm thì thêm vào nhé
*/

module.exports = router;