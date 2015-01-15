var Chat = require('../models/chat');
var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var chatController = require('../controllers/chatController');


router.get('/chat', auth.isAuthenticatedREST, chatController.getChatsById);
router.post('/chat/username', auth.isAuthenticatedREST, chatController.getChatBy2Username);
router.post('/chat', auth.isAuthenticatedREST, chatController.postNewChat);
router.put('/chat/addMessage/:id', auth.isAuthenticatedREST, chatController.addMessageToChat);
router.put('/chat/addUser/:id', auth.isAuthenticatedREST, function(req, res){    
    chatController.addUserToChat(req.params.id, {
        UserId: req.body.UserId,
        DisplayName: req.body.DisplayName,
        Avatar: req.body.Avatar,
        LinkPage: req.body.LinkPage,
        Seen: true
    }, res);
});
router.put('/chat/deleteUser/:idchat/:iduser', auth.isAuthenticatedREST, function(req, res){    
    chatController.deleteUserFromChat(req.params.idchat, req.params.iduser, res);
});

module.exports = router;

/*var express = require('express');
var router = express.Router();
var Chat = require('../models/chat');
var auth = require('../controllers/auth');


router.get('/', auth.isAuthenticatedREST, function(req, res) {
    // Chat.find({'ListUsers': {UserId:req.params.id}}, function(err, chats) {
    //     if (err)
    //         res.send(err);
    //     res.json(chats);
    // });
    res.json(req.user);
    // res.send('heelo');
});

router.post('/', function(req, res) {
    var chat = new Chat();
    console.log(req.body);
     chat = req.body;

    //chat.CreateDate = req.body.CreateDate;

    chat.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Chat added to the database!', data: chat });
    });
});

router.put('/message/:id', function(req, res) {
    var id = req.params.id;
    var message = req.body;

    Chat.update({_id: id}, {$push: {ListMessages: message}}, {$multi: false}, function (err) {
        if (err) return res.send(500);
        return res.send(201);
    });
});

router.put('/user/:id', function(req, res) {
    var id = req.params.id;
    var user = req.body;

    Chat.update({_id: id}, {$push: {ListUsers: user}}, {$multi: false}, function (err) {
        if (err) return res.send(500);
        return res.send(201);
    });
});

router.put('/deleteUser/:idchat/:iduser', function(req, res) {
    var idchat = req.params.idchat;
    var iduser = req.params.iduser;

    Chat.update(
        { _id: idchat },
        { $pull: { 'ListUsers': { UserId: iduser } } }
    );
});

router.put('/changeStateSeen/:id', function(req, res) {
        var id = req.params.id;
        var user = req.body;

    Chat.update({_id: id}, {$push: {ListUsers: user}}, {$multi: false}, function (err) {
        if (err) return res.send(500);
        return res.send(201);
    });
});

module.exports = router;
*/