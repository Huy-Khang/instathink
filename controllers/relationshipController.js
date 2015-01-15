var Relationship = require('../models/relationship');
var userController = require('../controllers/userController');
var User = require('../models/user');
var Request = require('../models/request');


exports.getRelationshipByName = function(req, res) {
    User.find({
        Username: req.params.name
    }, function(err, users) {
        if (!err) {
            Relationship.find({
                    $or: [{
                        UserId1: req.user._id,
                        UserId2: users[0]._id
                    }, {
                        UserId1: users[0]._id,
                        UserId2: req.user._id
                    }]
                },
                function(err, relationships) {
                    if (relationships.length > 0) {
                        res.json({
                            re: true
                        });
                    } else {
                        res.json({
                            re: false
                        })
                    }
                });
        }
    });
};

exports.getRelationshipById = function(req, res) {
    var friends = [];

    Relationship.find({
        $or: [{
            UserId1: req.user._id
        }, {
            UserId2: req.user._id
        }]
    }, function(err, relationships) {
        if (err)
            res.send(err);

        relationships.forEach(function(relationship) {
            if (relationship.UserId1 != req.user._id) {
                User.find().where('_id').in([relationship.UserId1]).exec(function(err, userFriend) {
                    if (err) {} else {
                        userFriend[0]._id = relationship._id;
                        // console.log(userFriend[0]);
                        friends.push(userFriend[0]);
                    }
                });
            } else {
                User.find().where('_id').in([relationship.UserId2]).exec(function(err, userFriend) {
                    if (err) {} else {
                        userFriend[0]._id = relationship._id;
                        // console.log(userFriend[0]);
                        friends.push(userFriend[0]);
                    }
                });
            }
        });

        setTimeout(function() {
            res.json(friends);
        }, 1000);

    });
}

exports.khangDeleteRelationship = function(req, res) {
    User.find({
        Username: req.body.name
    }, function(err, users) {
        Relationship.find({
            $or: [{
                UserId1: req.user._id,
                UserId2: users[0]._id
            }, {
                UserId1: users[0]._id,
                UserId2: req.user._id
            }]
        }, function(err, relationships) {
            relationships[0].remove(function(err) {
                if (!err) {
                    res.json({
                        re: true
                    });
                } else {
                    res.json({
                        re: false
                    });
                }
            });
        });
    });
};


exports.postNewRelationship = function(req, res) {
    User.find({
        Username: req.body.name
    }, function(err, users) {
        var relationship = new Relationship();
        relationship.UserId1 = req.user._id;
        relationship.UserId2 = users[0]._id;
        relationship.Description = req.body.Description;

        relationship.save(function(err) {
            Request.find({UserId1: users[0]._id, UserId2: req.user._id}, function(err, requests) {
                if (!err) {
                    requests[0].remove(function(err) {
                        if (!err) {
                            res.json({
                                re: true
                            });
                        } else {
                            res.json({
                                re: false
                            });
                        }
                    });
                }

            });
        });
    });
}

exports.deleteRelationship = function(req, res) {
    Relationship.findByIdAndRemove(req.params.idRelationship, function(err) {
        if (err)
            res.send(err);
        res.json({
            message: 'Relationship removed from the database!'
        });
    });
}

exports.changeDescriptionRelationship = function(req, res) {
    Relationship.findById(req.params.id, function(err, relationship) {
        if (err)
            res.send(err);

        relationship.Description = req.body.Description;

        relationship.save(function(err) {
            if (err)
                res.send(err);
            res.json(relationship);
        });
    });
}