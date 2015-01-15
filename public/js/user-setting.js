(function(){

	var app = angular.module('sn', []);

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


	app.controller('MainController',['$http', '$scope','$timeout', function($http, $scope, $timeout){
		var main = this;

		main.user = [];

		var inUsername = document.getElementById('inUsername').value;
		var inPassword = document.getElementById('inPassword').value;

		main.showUserInfo = function() {
				main.userInfoShow = true;
				main.loginInfoShow = false;
				main.userInfoActive = 'active';
				main.loginInfoActive = '';
		}

		main.showLoginInfo = function() {
			main.userInfoShow = false;
			main.loginInfoShow = true;
			main.userInfoActive = '';
			main.loginInfoActive = 'active';
		}

		this.init = function() {
			console.log('tan');

			main.userInfoShow = true;
			main.loginInfoShow = false;
			main.userInfoActive = 'active';
			main.loginInfoActive = '';


			main.hide = true;
			$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
			$http.get('api/user/profile').success(function(data) {
				main.user = data;
				main.newImage = main.user.Avatar;
			}).error(function(data) {
	            alert('Error!!!');
	        });
		};
	
		$scope.onFileSelect = function(){
	    	$timeout(function(){
		    	console.log('file is ' + JSON.stringify($scope.myFile));

		    	var file = $scope.myFile;

		    	if (file != undefined) {
					var fd = new FormData();
					fd.append('image', file);
					console.log('ttt');

					$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
					$http.post('/api/post/image', fd, {
							transformRequest: angular.identity,
							headers: {
								'Content-Type': undefined
							}
						})
						.success(function(data) {
							console.log(data.name);
							main.newImage = data.name;
							//post.showNewImage = true;
						})
						.error(function(data) {
							console.log('err');
						});
				}
		    	console.log('change file');
	    	}, 1);
	    };	

	    this.saveUserInfo = function(){
	    	main.user.Avatar = main.newImage;
    		$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
    		$http.put('api/user/profile', {user: main.user}).success(function(data) {
    			console.log(data);
    			alert('User info was updated!');
    		}).error(function(data) {
                alert('Error!!!');
            });
	    };

	    main.oldPassword = '';
	    main.newPassword = '';

	    this.saveLoginInfo = function(){
	    	$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(inUsername + ':' + inPassword);
    		$http.post('/api/user/password', {oldPassword: main.oldPassword, newPassword: main.newPassword}).success(function(data) {
    			alert('Login info was updated!');
    		}).error(function(data) {
                $scope.message = 'Error!!!';
            });
	    };

	}]);
})()
