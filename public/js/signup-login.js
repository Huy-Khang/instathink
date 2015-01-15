(function(){

	var app = angular.module('sn', []);

	app.controller('MainController',['$http',function($http){
		var main = this;

	    main.user = null;
	    main.user2 = null;


	    this.init = function(){

	    };

	    this.signUp = function(){
	    	console.log('sign up');
	    	if(main.user.Password == main.user.RePassword){
	    		$http.post('/api/user/profile', {user: main.user}).success(function(data){
	    			if(data.Username != null){		//tạo tài khoản thành công => redirect to newfeed
	    				$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(data.Username + ':' + data.Password);
	    				$http.post('/login');
	    				window.location.assign('/newfeed');
	    			}
	    		});	
	    	}
	    };

	    this.signIn = function(){
	    	console.log('sign in');
	  		$http.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(main.user2.Username + ':' + main.user2.Password);
	  		$http.post('/login');
	  		window.location.assign('/newfeed');
	    };

	    this.google = function(){
	    	console.log('google');
	    	window.location.assign('/login/google');
	    };

	    this.test = function(){
	    	console.log('test');
	    };

	}]);
})()
