var Post = require('../models/post');
var User = require('../models/user');
var Relationship = require('../models/relationship');
var userController = require('../controllers/userController');
var imageController = require('./imageController');
var io = require('../io');

exports.getFriendWallByName = function(req, res){
	User.find({Username: req.params.name}, function(err, user){
		Post.find({
			UserId: user[0]._id,
			IsAnonymous: false
		}, function(err, posts) {
			if (err) {
				res.json(err);
			} else {
				res.json(posts);
			}
		});
	});
};

exports.getWallPost = function(req, res) {
	// console.log(req.params.userId);
	// if (req.params.userId != undefined) {
	// 	Post.find({
	// 		UserId: req.params.userId,
	// 		IsAnonymous: false
	// 	}, function(err, posts) {
	// 		if (err) {
	// 			res.json(err);
	// 		} else {
	// 			res.json(posts);
	// 		}
	// 	});
	// } else {
		console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n wtf?');
		Post.find({
			UserId: req.user._id
		}, function(err, posts) {
			if (err) {
				res.json(err);
			} else {
				res.json(posts);
			}
		});
	// }
		
};



var mergeArray = function(arr1, arr2) {
	arr2.forEach(function(item) {
		arr1.push(item);
	});
	return arr1;
};

//get friends -> get post of all firends
exports.getNewFeed = function(req, res) {
	var size = 100;
	var listPost = [];

	Post.find({
		UserId: req.user._id,
		IsAnonymous: false
	}, null, {
		skip: 0 * size,
		limit: size
	}, function(err, post) {

		if (!err)
			listPost = mergeArray(listPost, post);

		Relationship.find({
				$or: [{
					UserId1: req.user._id
				}, {
					UserId2: req.user._id
				}]
			},
			function(err, relationships) {
				relationships.forEach(function(item) {
					// console.log(item);
					if (item.UserId1 == req.user._id) {
						Post.find({
							UserId: item.UserId2,
							IsAnonymous: false
						}, null, {
							skip: 0 * size,
							limit: size
						}, function(err, post) {
							if (!err)
								listPost = mergeArray(listPost, post);
						});
					} else {
						Post.find({
							UserId: item.UserId1,
							IsAnonymous: false
						}, null, {
							skip: 0 * size,
							limit: size
						}, function(err, post) {
							if (!err)
								listPost = mergeArray(listPost, post);
						});
					}
				});
				setTimeout(function() {
					listPost = listPost.sort(function(obj1, obj2) {
						return obj2.CreateDate - obj1.CreateDate;
					});
					res.json(listPost.slice(0, size));
				}, 1000);
			});
	});
};

exports.getAnonymousNewFeed = function(req, res) {
	var size = 100;
	var listPost = [];

	Post.find({
		UserId: req.user._id,
		IsAnonymous: true
	}, null, {
		skip: 0 * size,
		limit: size
	}, function(err, post) {

		if (!err)
			listPost = mergeArray(listPost, post);

		Relationship.find({
				$or: [{
					UserId1: req.user._id
				}, {
					UserId2: req.user._id
				}]
			},
			function(err, relationships) {
				relationships.forEach(function(item) {
					if (item.UserId1 == req.user._id) {
						Post.find({
							UserId: item.UserId2,
							IsAnonymous: true
						}, null, {
							skip: 0 * size,
							limit: size
						}, function(err, post) {
							if (!err)
								listPost = mergeArray(listPost, post);

						});
					} else {
						Post.find({
							UserId: item.UserId1,
							IsAnonymous: true
						}, null, {
							skip: 0 * size,
							limit: size
						}, function(err, post) {
							if (!err)
								listPost = mergeArray(listPost, post);
						});
					}
				});
				setTimeout(function() {
					listPost = listPost.sort(function(obj1, obj2) {
						return obj2.CreateDate - obj1.CreateDate;
					});
					res.json(listPost.slice(0, size));
				}, 1000);
			});
	});
};

exports.getPostById = function(req, res) {
	Post.findById(req.params.postId, function(err, post) {
		if (err)
			res.json(err);
		else
			res.json(post);
	});
};

exports.postPost = function(req, res) {
	console.log(req.body.post);
	var post = new Post();

	post.Body = req.body.post.Body;
	post.Image = req.body.post.Image;
	post.UserId = req.user._id;
	post.DisplayName = req.user.DisplayName; //thêm vào lúc 1:26, không có thì không search nổi
	post.LinkPage = req.user.LinkPage; //thêm vào lúc 1:26, không có thì không search nổi
	post.Avatar = req.user.Avatar; //thêm vào lúc 1:26, không có thì không search nổi
	post.CreateDate = new Date();
	post.IsAnonymous = req.body.post.IsAnonymous;
	post.ListToBeNotified.push({
		UserId: req.user._id
	});

	post.save(function(err) {
		if (err)
			res.json(err);

		Relationship.find({
			$or: [{
				UserId1: req.user._id
			}, {
				UserId2: req.user._id
			}]
		}, function(err, relationships) {
			relationships.forEach(function(item){
				if(item.UserId1!=req.user._id)
				{
					io.sockets.emit(item.UserId1+'post',post);
				}else{
					io.sockets.emit(item.UserId2+'post',post);
				}
			});
		});

		//them photo vao listPhoto cua user
		User.find().where('_id').in([post.UserId]).exec(function(err, user){
            if (err)
            {
            }
            else
            {
            	if (post.Image != undefined)
            	{
	            	user[0].ListPhotos.push({
	            		PostId: post._id,
	            		LinkPost: post.LinkPage,
	            		LinkPhoto: post.Image
	            	});
	            	user[0].save();
            	}
            }
        });

		exports.addListToBeNotified(post._id, post.UserId);
		res.json(post);
	});
};

exports.putPost = function(req, res) {
	Post.findByIdAndUpdate(req.params.id, {
		Body: req.body.Body
	}, function(err, post) {
		if (err) {
			res.json(err);
		} else {
			res.json(post);
		}
	});
};

exports.deletePost = function(req, res) {
	Post.remove({
		_id: req.params.postId
	}, function(err) {
		if(err)
			res.json(err);
		res.json("ok");
	});
};

exports.addListToBeNotified = function(idPost, idUser) {
	var flag = false;

	Post.findById(idPost, function(err, post) {
		post.ListToBeNotified.forEach(function(user) {
			if (user.UserId == idUser) {
				flag = true;
			}
		});
		if (flag == false) {
			post.ListToBeNotified.push({
				UserId: idUser
			});
			post.save();
		} else post.save();
	});
};

exports.addLike = function(idPost, like,req,res) {
	var flag = false;
	var i = 0;
	var n =0;
	console.log('like');
	Post.findById(idPost, function(err, post) {
		if(!err)
		{
			post.ListLikes.forEach(function(item){
				if(item.UserId == like.UserId)
				{
					n=i;
					flag = true;
				}
				i++;
			});

			setTimeout(function(){
				if(flag){			//đã like rồi => bỏ like
					post.ListLikes.splice(n,1);
					post.save(function(err){
						if(!err)
							res.json(post);
					});
				}else{
					post.ListLikes.unshift(like);
					post.save(function(err) {
						if (err)
							res.send(err);
						exports.addListToBeNotified(idPost, req.user._id);
						exports.addNot(idPost, like.UserId, {
							Link: req.body.idPost, //tao ra link o day
							Description: req.user.DisplayName + ' liked a post.',
							Time: Date(),
							Image: req.user.Avatar,
							Seen: false
						});
						res.json(post);
					});
				}
			}, 200);		

					
		}
	});
};

exports.addComment = function(req, res) {
	var newComment = {
		UserId: req.user._id,
		DisplayName: req.user.DisplayName,
		LinkPage: req.user.LinkPage,
		Avatar: req.user.Avatar, //thêm vào lúc 1:26, không có thì không search nổi
		CreateDate: Date(),
		Body: req.body.Body,
	};
	Post.findById(req.body.idPost, function(err, post) {
		console.log('1');
		post.ListComments.unshift(newComment);
		post.save(function(err) {
			if (err) {
				res.send(err);
			} else {
				exports.addListToBeNotified(req.body.idPost, req.user._id);
				exports.addNot(req.body.idPost, req.user._id, {
					Link: req.body.idPost, //tao ra link o day
					Description: req.user.DisplayName + ' commented in a post.',
					Time: Date(),
					Image: req.user.Avatar,
					Seen: false
				});
				res.json({
					message: 'Comment added to the Post!',
					data: newComment
				});
			}
		});
	});
};

exports.deleteLike = function(idPost, idUser, res) { //chua chay duoc
	Post.findById(idPost, function(err, post) {
		post.ListLikes.pull({
			UserId: idUser
		}, function(err) {
			if (err)
				res.send(err);
			res.json({
				message: 'User unliked the Post!'
			});
		});
	});
};

exports.deleteComment = function(idPost, idComment, res) { //chua chay duoc
	Post.findById(idPost, function(err, post) {
		post.ListComments.pull({
			_id: idComment
		}, function(err) {
			if (err)
				res.send(err);
			res.json({
				message: 'Comment deleted from the Post!'
			});
		});
	});
};

exports.editComment = function(req, res) {
	var idPost = req.params.idpost;
	var idComment = req.params.idcomment;
	var newBody = req.body.NewBody;

	Post.findById(idPost, function(err, post) {
		post.ListComments.forEach(function(comment) {
			if (comment._id == idComment) {
				comment.Body = newBody;
			}
			post.save(function(err) {
				if (err)
					res.send(err);
				res.json({
					message: 'Comment edited from the Post!'
				});
			});
		});
	});
};

exports.addNot = function(idPost, idUser, noti) {
	Post.findById(idPost, function(err, post) {
		post.ListToBeNotified.forEach(function(user) {
			if (user.UserId != idUser) {
				userController.postNotification(user.UserId, noti, function(err) {
					if(!err){
						io.sockets.emit(user.Username+'notification',{user: noti});
					}
				});
			}
		});
	});
};


exports.postImage = function(req, res) {
	console.log('post image');
	imageController.uploadImage(req.files.image.path, req.files.image.name, function(err, path) {
		if (err) {
			res.json(err);
		} else {
			res.json({
				'name': req.files.image.name
			});
		}
	});

};
