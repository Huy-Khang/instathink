(function(){

	var app = angular.module('sn', ['angularFileUpload']);

	app.directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            
	            element.bind('change', function(){
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);

	app.directive('ngEnter', function () {
	    return function (scope, element, attrs) {
	        element.bind("keydown keypress", function (event) {
	            if(event.which === 13) {
	                scope.$apply(function (){
	                    scope.$eval(attrs.ngEnter);
	                });
	                event.preventDefault();
	            }
	        });
	    };
	});


	app.controller('TopController',['$scope','$http', '$timeout',function($scope, $http, $timeout){
		var save = this;
		var inUsername = document.getElementById('inUsername').value;
		var inPassword = document.getElementById('inPassword').value;
		var inId = document.getElementById('inId').value;
		var inDisplayName = document.getElementById('inDisplayName').value;
		var inAvatar = document.getElementById('inAvatar').value;

		save.notificationNumber = 0;
		save.messageNumber = 0;
		save.requestNumber = 0;

		save.requests = [];
		save.notifications = [];
		save.messages = [];

		save.DisplayName = inDisplayName;
		save.Avatar = inAvatar;
		save.searchName = '';

		this.search = function(){
			window.location.assign('search?name=' + save.searchName);
		};

		var socket = io.connect('http://localhost:3000');

		socket.on(inUsername+'request', function(data) {			//tại sao??
			$timeout(function(){
				save.requests.unshift(data.user);
				save.requestNumber++;
			}, 1);
		});

		this.initRequest = function(){
			$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
			$http.get('/api/request/toprequest').success(function(data){
				save.requests = data;
				save.requestNumber = data.length;
			});
		};

		socket.on(inUsername+'notification', function(data){
			$timeout(function(){
				save.notifications.unshift(data.not);
				save.notificationNumber++;
			}, 1);
		});

		this.initNotification = function(){
			$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
			$http.get('/api/notifications').success(function(data){
				save.notifications = data;
				data.forEach(function(item){
					if(item.Seen==false)
						save.notificationNumber++;
				});
			});
		};

		this.clickNotification = function(){
			save.notificationNumber = 0;		
			$http.put('/api/notifications');
		};

		socket.on(inId + 'message', function(data){
			$timeout(function(){
				save.messageNumber = 0;
				save.messages = [];
				save.initMessage();
			}, 1);
		});

		this.initMessage = function(){
			console.log('initMessage')
			$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
			$http.get('api/user/profile').success(function(data) {
				save.user = data;
				$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
				$http.get('/api/chat').success(function(chats){
					chats.forEach(function(chat) {
						console.log(chat);
						if (save.user._id == chat.ListUsers[0].UserId)
						{
							if (chat.ListUsers[0].Seen == false) save.messageNumber++;
							$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
							$http.get('/api/user/friendbyid/' + chat.ListUsers[1].UserId).success(function(friend) {
								var temp = {
									Username: friend.Username,
									DisplayName: friend.DisplayName,
									Avatar: friend.Avatar,
									Time: chat.ListMessages[chat.ListMessages.length - 1].Time,
									LastMessage: chat.ListMessages[chat.ListMessages.length - 1].Content,
									Seen: chat.ListUsers[0].Seen
								};
								save.messages.push(temp);
								console.log(save.messages);
							});
						}
						else
						{
							if (chat.ListUsers[1].Seen == false) save.messageNumber++;
							$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
							$http.get('/api/user/friendbyid/' + chat.ListUsers[0].UserId).success(function(friend) {
								var temp = {
									Username: friend.Username,
									DisplayName: friend.DisplayName,
									Avatar: friend.Avatar,
									Time: chat.ListMessages[chat.ListMessages.length - 1].Time,
									LastMessage: chat.ListMessages[chat.ListMessages.length - 1].Content,
									Seen: chat.ListUsers[1].Seen
								};
								save.messages.push(temp);
								console.log(save.messages);
							});
						}
					});
				});
			}).error(function(data) {
	            alert('Error!!!');
	        });
		};

		this.clickMessage = function(){
			save.messageNumber = 0;
		};
	}]);

	app.controller('ProfileController', ['$scope', '$http', function($scope, $http){
		var profile = this;

		profile.hide = true;

		profile.DisplayName = '';
		profile.Avatar = '';
		profile.Email = '';
		profile.DateOfBirth = '';

		var inUsername = document.getElementById('inUsername').value;
		var inPassword = document.getElementById('inPassword').value;

		this.init = function(){
			console.log(inUsername + inPassword);
			$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);	

	   		$http.get('/api/user/profile').success(function(data){
				profile.DisplayName = data.DisplayName;
				profile.Avatar = data.Avatar;
				profile.Email = data.Email;
				profile.DateOfBirth = data.DateOfBirth;
	   		});
		};
	}]);



	app.controller('PostController',['$scope', '$http', '$timeout','FileUploader',function($scope, $http, $timeout, FileUploader){
		var post = this;

		post.newBody = '';

		var inUsername = document.getElementById('inUsername').value;
		var inPassword = document.getElementById('inPassword').value;

	    post.new = null;
	    post.auth = null;
	    post.hide = true;
	    
	    post.anynomousShow = false;
	    post.feedShow = true;
	    
	    post.listPost = [];
	    post.listPostAnynomous = [];
	    
	    post.activeNew ='active';
	    post.activeAnynomous ='';

	    post.newCommentBody = '';

	    post.showNewImage = false;
	    post.newImage = '';

	    // edit post
	    post.isEditting = false;

	    this.showNewFeed = function(){
	    	post.anynomousShow = false;
	    	post.feedShow = true;
	    	post.activeNew = 'active';
	    	post.activeAnynomous = '';
	    };
	    this.showAnynomousFeed = function(){
	    	post.anynomousShow = true;
	    	post.feedShow = false;
	    	post.activeNew = '';
	    	post.activeAnynomous = 'active';
	    };

	    this.startEditPost = function(id) {
	    	post.isEditting = true;
	    	post.listPost.forEach(function(item){
    			if(item._id == id){
    				post.newBody = item.Body;		
    			}
    		});
	    }

	    this.doneEditPost = function(id) {
    		post.isEditting = false;

    		
    		$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);	
    		$http.put('/api/post/'+id, {Body: post.newBody}).success(function(){
    			post.getNewFeed();
    		});
	    }

	    this.cancelEditPost = function() {
	    	post.isEditting = false;	
	    }

	    this.deletePost = function(idPost) {
	    	//console.log(idPost);
	    	$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);	
	   		$http.delete('/api/post/' + idPost).success(function(data){
				// alert('Deleted!');
				post.listPost = [];
				post.getNewFeed();
	   		}).error(function(data) {
	   			alert('Error!');
	   		});
	    }

	    this.newPost = function(){
	    	if(post.new != null){
	    		
				if (post.new.IsAnonymous == undefined) {
					post.new.IsAnonymous = false;
				}

	    		if(post.showNewImage){
	    			post.new.Image = post.newImage;
	    			post.newImage = '';
	    			post.showNewImage = false;
	    		}

	    		$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
	    		$http.post('/api/post', {post:  post.new}).success(function(data){
	    			if(!data.IsAnonymous)
	    				post.listPost.unshift(data);
	    			else{
	    				data.DisplayName = 'anynomous';
		   				data.LinkPage = 'anynomous';
		   				data.Avatar = 'anynomous.jpg';
	    				post.listPost.unshift(data);
	    			}
	    			post.new = null;
	    		});
	    	}
	    };

	    this.newComment = function(postId){
	    	console.log('new comment '+postId + ' '+ post.newCommentBody);


	    	$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
	    	$http.post('/api/post/addcomment',{idPost: postId, Body: post.newCommentBody}).success(function(data){
	    		post.listPost.forEach(function(item){
	    			if(item._id == postId){
	    				data.data.CreateDate = moment(data.data.CreateDate).format('llll');
	    				item.ListComments.unshift(data.data);
	    			}
	    				
	    		});

	    		post.listPostAnynomous.forEach(function(item){
	    			if(item._id == postId){
	    				data.data.CreateDate = moment(data.data.CreateDate).format('llll');
	    				item.ListComments.unshift(data.data);
	    			}
	    				
	    		});

	    		console.log(data);
	    	});
	    	post.newCommentBody = '';
	    };


	    $scope.onFileSelect = function(){
	    	$timeout(function(){
	    		var file = $scope.myFile;

		    	console.log('file is ' + JSON.stringify(file));

		    	var fd = new FormData();
		        fd.append('image', file);
		        // console.log(fd.file);

		        $http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
		        $http.post('/api/post/image', fd, {
		            transformRequest: angular.identity,
		            headers: {'Content-Type': undefined}
		        })
		        .success(function(data){
		        	post.newImage = data.name;
		        	post.showNewImage = true;
		        })
		        .error(function(data){
		        });

		    	console.log('change file');
	    	},1);
	    };

	    this.addLike = function(id){
	    	$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
	    	$http.put('/api/post/addlike/'+id).success(function(newPost){
	    		console.log(newPost);
	    		post.listPost.forEach(function(item){
	    			if(item._id == id){
	    				if(item.ListLikes.length > newPost.ListLikes.length){	//hủy like
	    					item.numLike--;
	    				}else{
	    					item.numLike++;
	    				}
	    				item.ListLikes = newPost.ListLikes;
	    				
	    			}
	    		});
	    	});
		}
	    
	    this.normalizePost = function(data){
	    	data.forEach(function(item){
	    		var temp = moment(item.CreateDate).format('llll');
	    		item.CreateDate = temp;

	    		item.ListComments.forEach(function(i){
	    			var temp = moment(i.CreateDate).format('llll');
		    		i.CreateDate = temp;
	    		});

	    		item.numLike = item.ListLikes.length;
	    	});
	    };

	    this.getNewFeed = function(){
	    	console.log('get new feed');
	   		$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);	
	   		$http.get('/api/post/wallpost').success(function(data){
	   			post.normalizePost(data);
				data.forEach(function(item) {
					if (item.IsAnonymous) {
						item.DisplayName = 'anynomous';
						item.LinkPage = 'anynomous';
						item.Avatar = 'anynomous.jpg';
					}
				});
	   			post.listPost = data;
	   		});
	    };
   
	    this.init = function(){
	    	post.hide = true;
	    	this.getNewFeed();
	    	post.isEditting = false;
	    };
	    
	    this.test = function(){
	    	console.log('test');
	    };

	}]);
})()
