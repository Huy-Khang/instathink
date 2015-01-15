/*
soure tree như shit ><
*/
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
// var busboy = require('connect-busboy');
var multer = require('multer');

mongoose.connect('mongodb://localhost/test');


global.appRoot = path.resolve(__dirname);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// app.use(bodyParser());
// app.use(busboy());
app.use(multer());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(require('stylus').middleware({ src: __dirname + '/public' }));
app.use('/public',express.static(path.join(__dirname, 'public')));
// app.use('/friendprofile/public',express.static(path.join(__dirname, 'public')));
// app.use('/img', express.static(path.join(__dirname, 'public/img')));
// app.use('/public/js', express.static(path.join(__dirname, 'public/js')));
// app.use('/public/css', express.static(path.join(__dirname, 'public/css')));
// app.use('/vendor', express.static(path.join(__dirname, 'public/vendor')));

var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({
    secret:'what the fuck? >"<',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var indexRoute = require('./routes/index');         //route for all views
var userRoute = require('./routes/users');          //route for REST request related to user
var postRoute = require('./routes/posts');          // ~
var chatRoute = require('./routes/chats');    
var relationshipRoute = require('./routes/relationships'); 
var requestRoute = require('./routes/requests'); 
var notificationRoute = require('./routes/notifications');  //~
var oauthRoute = require('./routes/oauth2');
var clientRoute = require('./routes/clients');
var imageRoute = require('./routes/images');

app.use('/', indexRoute);
app.use('/api', userRoute);
app.use('/api', postRoute);
app.use('/api', chatRoute);
app.use('/api', relationshipRoute);
app.use('/api', requestRoute);
app.use('/api', notificationRoute);
app.use('/oauth2', oauthRoute);
app.use('/api', clientRoute);
app.use('/image', imageRoute);


// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


module.exports = app;
