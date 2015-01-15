var Request = require('../models/request');
var User = require('../models/user');
var io = require('../io');


exports.getTopRequest = function(req, res){
    var re = [];
    Request.find({UserId2: req.user._id}, function(err, requests){
        requests.forEach(function(item){
            User.findById(item.UserId1, function(err, user){
                re.push(user);
            });
        });
        setTimeout(function(){
            res.json(re);
        }, 1000);
    });
};

exports.getUser1ByName = function(req, res) {
    User.find({
        Username: req.params.name
    }, function(err, users) {
        if (!err) {
            Request.find({
                UserId1: req.user._id,
                UserId2: users[0]._id
            }, function(err, requests) {
                if (requests.length > 0) {
                    res.send({
                        re: true
                    });
                } else {
                    res.send({
                        re: false
                    });
                }
            });
        }
    });
};
exports.getUser2ByName = function(req, res){
    User.find({
        Username: req.params.name
    }, function(err, users) {
        if (!err) {
            Request.find({
                UserId1: users[0]._id,
                UserId2: req.user._id
            }, function(err, requests) {
                if (requests.length > 0) {
                    res.send({
                        re: true
                    });
                } else {
                    res.send({
                        re: false
                    });
                }
            });
        }
    });
};

exports.getRequestOfUser1 = function(req, res) {
    Request.find({UserId1:req.params.id}, function(err, requests) {
        if (err)
            res.send(err);
        res.json(requests);
    });
}

exports.getRequestOfUser2 = function(req, res) {
    Request.find({UserId2:req.params.id}, function(err, requests) {
        if (err)
            res.send(err);
        res.json(requests);
    });
}

exports.postNewRequest = function(req, res) {
    var request = new Request();
    User.find({
        Username: req.body.name
    }, function(err, users) {
        if (!err) {
            request.UserId1 = req.user._id;
            request.UserId2 = users[0]._id;
            request.Time = new Date();
            request.save(function(err) {

                if (err) {
                    res.json({
                        re: false
                    });
                } else {
                    res.json({
                        re: true
                    });
                    io.sockets.emit(users[0].Username+'request',{user: req.user});
                }

            });
        }
    });
}

exports.deleteRequest = function(req, res) {
    Request.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Request removed from the database!' });
    });
}