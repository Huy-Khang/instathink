
var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var fs = require('fs');


router.get('/getimage/:image', function(req, res){
	var image = req.params.image;
	var img = fs.readFileSync(appRoot + "/uploads/image/" + image);
	res.end(img, 'binary');
});


router.get('/', function(req, res){			
	res.render('updateAvatar');
});

module.exports = router;