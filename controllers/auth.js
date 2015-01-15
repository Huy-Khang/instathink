/*
xử lí login, authentication
*/

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

passport.serializeUser(function(user, done) {					//what is this? no idea :v
	// console.log('serializing user: '); console.log(user);
	if(user._id != null)
		done(null, user._id);
	else
		done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	// console.log(id);
	User.findById(id, function(err, user) {
		// console.log('deserializing user:', user);
		// done(null, id);
		done(err, user);
	});
});

var isValidPassword = function(user, password){
	if(bCrypt.compareSync(password, user.Password) || user.Password == password)
		return true;
	return false;
}


passport.use(new BasicStrategy(
	function(token, done){
		User.findOne({'Token': token}, function(err, user){
			if(err)
				return done(err);
			if(!user)
				return done(null, false);
			return done(null, user, {scope: 'read'});
		});
	}
));

passport.use(new GoogleStrategy({
		clientID: '531143909090-ssk3mvfecalt0lepkuit9r9cscio7jo8.apps.googleusercontent.com',
		clientSecret: 'u1yi98L3s9lCAmc6-_MDQcLs',
		callbackURL: 'http://localhost:3000/login/google/callback'
	},
	function(token, refreshToken, profile, done){
		process.nextTick(function(){
			User.findOne({'IdGoogle': profile.id},function(err,user){
				if(user){
					return done(null, user);

				}else{
					console.log('create user');
					var newUser = new User();

					newUser.Username = token;
					newUser.Password = token;
					newUser.IdGoogle = profile.id;
                    newUser.DisplayName  = profile.displayName;
                    newUser.Email = profile.emails[0].value; // pull the first email
                    newUser.Avatar = 'anynomous.jpg';


					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	})
);


passport.use('login', new BasicStrategy({
	passReqToCallback: true
},
	function(req,username, password, done){
			// console.log(username + ' ' + password);
			User.findOne({'Username': username},
				function(err,user){
					if(err){
						return done(err);
					}
					if(!user){
						console.log('user not found');
						return done(null,false,req.flash('message','User not found'));
					}
					if(!isValidPassword(user,password)){
						console.log('Invalid Password');
						return done(null,false,req.flash('message','Invalid password'));
					}
					return done(null,user);
				});
		}
));

passport.use('REST', new BasicStrategy({
	passReqToCallback: true
},
	function(req,username, password, done){
			// console.log(username + ' ' + password);
			User.findOne({'Token': username},
				function(err,user){
					if(err){
						return done(err);
					}
					if(!user){
						console.log('user not found');
						return done(null,false,req.flash('message','User not found'));
					}
					return done(null,user);
				});
		}
));

/////bảo mật server bằng oauth
var Token = require('../models/token');
var Client = require('../models/client');

passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ 'id': username }, function (err, client) {
      if (err) { return callback(err); }

      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }

      // Success
      return callback(null, client);
    });
  }
));

passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({'value': accessToken }, function (err, token) {
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }

      User.findOne({ '_id': token.userId }, function (err, user) {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }

        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));


exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });

//////////////////////////////////////////////////////////////////////////////










//login với gg thì làm sao đây, login thì được mà mỗi lần sau đó gọi service thì làm sao?
exports.loginGG = passport.authenticate('google',{scope: ['profile', 'email']});

exports.loginGGCallback = passport.authenticate('google',{
	successRedirect: '/newfeed',
	failureRedirect: '/'
});

exports.login = passport.authenticate('login', {			//use for login 
	successRedirect: '/newfeed',	
	failureRedirect: '/'
});


exports.isAuthenticated = function(req,res,next){
	if(req.isAuthenticated())
		return next();

	res.redirect('/');
};

exports.isNotAuthenticated = function(req, res, next){
	if(req.isAuthenticated())
		res.redirect('/newfeed');

	return next();
};

exports.logout = function(req, res){
	req.logout();
 	res.redirect('/');
};

exports.isAuthenticatedREST = passport.authenticate(['login','bearer'], { session: false});		//use for REST request, no session
