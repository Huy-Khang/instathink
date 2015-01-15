var User = require('../models/user');
var Chat = require('../models/chat');
var Post = require('../models/post');

exports.getNotification = function(req, res){
	User.findById(req.user._id, function(err, user){
		if(!err){
			res.json(user.Notification);
		}
	});
};

exports.postNotification = function(req, res){
	User.findById(req.user._id, function(err, user){
		if(!err){
			user.Notification.forEach(function(item){
				item.Seen = true;
			});
			user.save();
		}
	});
};