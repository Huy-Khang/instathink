/*
tất cả các router về giao diện
*/

var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');

router.get('/search', auth.isAuthenticated, function(req, res){
	res.render('search-result', {user: req.user, name: {value: req.query.name}});
});


router.get('/', auth.isNotAuthenticated,function(req, res) {
  res.render('signup-login');
});

router.get('/login', auth.isNotAuthenticated, function(req,res){
	res.render('signup-login');
});

router.post('/login', auth.login);

router.get('/logout', auth.logout);

router.get('/postdetail', auth.isAuthenticated, function(req, res){
	console.log(req.query.id);
	res.render('post-detail', {user: req.user, post: {id: req.query.id}});
});

router.get('/newfeed', auth.isAuthenticated, function(req,res){
	res.render('newfeed', {user: req.user});
});

router.get('/setting', auth.isAuthenticated, function(req,res){
	res.render('user-setting', {user: req.user});
});

router.get('/friends', auth.isAuthenticated, function(req,res){
	res.render('user-friends', {user: req.user});
});

router.get('/profile', auth.isAuthenticated, function(req,res){		
	res.render('user-profile', {user: req.user});
});

router.get('/friendprofile', auth.isAuthenticated, function(req,res){		
	console.log(req.query.namefriend);
	var temp = {
		name: req.query.namefriend
	};
	res.render('friend-profile', {user: req.user, friend: temp});
});

router.get('/photos', auth.isAuthenticated, function(req,res){		
	res.render('user-photos', {user: req.user});
});

router.get('/chat', auth.isAuthenticated, function(req, res){
	console.log(req.query.namefriend);
	var temp = {
		name: req.query.namefriend
	};
	res.render('chat', {user: req.user, friend: temp});
});

//test google login
router.get('/login/google', auth.loginGG);

router.get('/login/google/callback', auth.loginGGCallback);

router.get('/testgoogle', function(req, res){
	// res.json({'user': req.user});
	res.render('index', {user: req.user});
});

module.exports = router;