var User = require('../models/user');
var Chat = require('../models/chat');
var Post = require('../models/post');

var bcrypt = require('bcrypt-nodejs');
var imageController = require('./imageController');
// var busboy = require('connect-busboy');
var io = require('../io');



//thay đổi thông tin user trong chat khi user thay đổi
//đã test, chạy tốt
var updateChatByUser = function(user){		

	Chat.find().where('ListUsers.UserId').in([user._id]).exec(function(err, list){
		list.forEach(function(chat){
			chat.ListUsers.forEach(function(chatUser){
				if(chatUser.UserId == user._id){
					chatUser.DisplayName = user.DisplayName;
					chatUser.Avatar = user.Avatar;
					chatUser.LinkPage = user.LinkPage;
				}
			});
			chat.save();
		});
	});

	Chat.find().where('ListMessages.UserId').in([user._id]).exec(function(err, list){
		list.forEach(function(chat){
			chat.ListMessages.forEach(function(message){
				if(message.UserId == user._id){
					message.DisplayName = user.DisplayName;
					message.Avatar = user.Avatar;
					message.LinkPage = user.LinkPage;
				}
			});
			chat.save();
		});
	});
}


//thay đổi thông tin user trong post khi user thay đổi
//chưa test do k có dữ liệu
//chưa optimize
var updatePostByUser = function(user){
	Post.find().where('ListTags.UserId').in([user._id]).exec(function(err, list){
		list.forEach(function(post){
			post.ListTags.forEach(function(tagUser){
				if(tagUser.UserId == user._id){
					tagUser.DisplayName = user.DisplayName;
					tagUser.LinkPage = user.LinkPage;
				}
			});
			post.save();
		});
	});

	Post.find().where('ListLikes.UserId').in([user._id]).exec(function(err, list){
		list.forEach(function(post){
			post.ListLikes.forEach(function(likeUser){
				if(likeUser.UserId == user._id){
					likeUser.DisplayName = user.DisplayName;
					likeUser.LinkPage = user.LinkPage;
				}
			});
			post.save();
		});
	});


	Post.find().where('ListComments.UserId').in([user._id]).exec(function(err, list){
		list.forEach(function(post){
			post.ListComments.forEach(function(commentUser){
				if(commentUser.UserId == user._id){
					commentUser.DisplayName = user.DisplayName;
					commentUser.LinkPage = user.LinkPage;
				}

				commentUser.ListTags.forEach(function(tag){
					if(tag.UserId == user._id){
						tag.DisplayName = user.DisplayName;
						tag.LinkPage = user.LinkPage;
					}
				});

				commentUser.ListLikes.forEach(function(like){
					if(like.UserId == user._id){
						like.DisplayName = user.DisplayName;
						like.LinkPage = user.LinkPage;
					}
				});
			});
			post.save();
		});
	});

};

exports.getFriendByName = function(req, res){
	User.find({Username: req.params.name}, function(err, user){
		if(err)
			res.send(err);
		res.json(user[0]);
	});
};

exports.getFriendById = function(req, res){
	User.find({_id: req.params.id}, function(err, user){
		if(err)
			res.send(err);
		res.json(user[0]);
	});
};

exports.getUserById = function(req, res){
	User.findById({_id: req.user._id}, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });	
};

exports.getPhotosUserById = function(req, res){
	User.findById({_id: req.user._id}, function(err, user) {
        if (err)
            res.send(err);
        res.json(user.ListPhotos);
    });	
};

exports.postUser = function(req, res){
	var newUser = new User();

	newUser.Username = req.body.user.Username;
	newUser.Password = req.body.user.Password;
	newUser.DisplayName = req.body.user.DisplayName;
	newUser.Email = req.body.user.Email;
	newUser.Avatar = 'anynomous.jpg';

	newUser.save(function(err){
		if(err)
			res.send(err);
		else{
			console.log('create user success');
			res.json(newUser);	
		}
	});
};

//put avatar
//put password
// thay đổi những thằng kéo theo khi thay đổi display name

exports.putUserProfile = function(req, res){		//thay đổi email, display name, brithday
	console.log('\n\n\n\n\n\n\n\n\n\\n\n\n\n'+req.body.user);
	User.findByIdAndUpdate(req.user._id, {
	    Email: req.body.user.Email,
	    DisplayName: req.body.user.DisplayName,	    
	    DateOfBirth: req.body.user.DateOfBirth,
	    Avatar: req.body.user.Avatar
	}, {new: true}, function(err, user){
		if(err){
			res.send(err);
		}else{
			console.log(user);
			updateChatByUser(user);
			updatePostByUser(user);
			res.json(user);
		}
	});
	//kéo theo những gì????
};

exports.putPassword = function(req, res){
	//if (req.body.OldPasswork == req.user.password)
	console.log(req.body.oldPassword);
	console.log(req.body.newPassword);
	bcrypt.genSalt(5, function(err,salt){
        if(err){
        	res.send(err);
        	return;
        }
        bcrypt.hash(req.body.newPassword, salt, null, function(err,hash){
            if(err){
            	res.send(err);
        		return;
            }
            User.findByIdAndUpdate(req.user._id,{
				Password: hash
			},{new: true}, function(err, user){
				if(err){
					res.send(err);
					return;
				}else{
					res.json(user);
				}
			});
        });
    });	
};

exports.postAvatar = function(req, res){
	User.findById(req.user._id, function(err, user){
		if(err){
			res.json(err);
		}else{
			imageController.deleteImage(user.Avatar);
				
				imageController.uploadImage(req.files.image.path, req.files.image.name, function(err, path){
						if(err){
							res.json(err);
						}else{
							user.Avatar = req.files.image.name;
							user.save(function(err){
								if(!err)
									res.json({'name': req.files.image.name});
							});
						}
					});
		}
	});
};

exports.deleteUser = function(req, res){
	User.remove({_id: req.params.id}, function(err){
		//kéo theo những gì???
	});
};


// notifcation
// 		Link: String,
//             Description: String,
//             Seen: Boolean

exports.postNotification = function(id, not, callback){			//add notification, id of user, not is json
	User.findById(id, function(err, user){
		if (err)
			callback(err);
		else
		{
			user.Notification.push(not);
			io.sockets.emit(user.Username+'notification',{not: not});
			user.save(callback);
		}
	});
};

exports.changeSeenNotification = function(idUser, idNot, callback){
	User.findById(idUser, function(err, user){
		user.Notification.id(idNot).Seen = true;
		user.save(callback);
	});
};

exports.searchUser = function(req, res){
	User.find({DisplayName: { $regex: req.params.name, $options: "i"}}, function(err, listUser){

		console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n'+req.params.name);

		res.json(listUser);
	});
};