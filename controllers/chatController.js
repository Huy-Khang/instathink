var Chat = require('../models/chat');
var User = require('../models/user');
var io = require('../io');

exports.getChatsById = function(req, res) {
    Chat.find().where('ListUsers.UserId').in([req.user._id]).exec(function(err, chats) {
        if (err)
            res.send(err);
        res.json(chats);
    });
}

exports.getChatBy2Username = function(req, res) {
    var user1, user2;
    var flag = false;
    console.log(req.body.Username1+' '+req.body.Username2);
    User.find().where('Username').in([req.body.Username1]).exec(function(err, users) {
        user1 = users[0];
        User.find().where('Username').in([req.body.Username2]).exec(function(err, users) {
            user2 = users[0];
            // console.log(user2.DisplayName);
            Chat.find().where('ListUsers.UserId').in([user1._id]).exec(function(err, chats) {
                if (err)
                    res.send(err);
                if (chats != undefined)
                {
                    chats.forEach(function(chat) {
                        chat.ListUsers.forEach(function(user) {
                            if (user.UserId == user2._id)
                            {
                                flag = true;
                                res.json(chat);
                            }
                        });
                    });
                }
            });

            setTimeout(function(){
                if (flag == false)
                {
                    var chat = new Chat();
                    chat.CreateDate = new Date(); 
                    chat.ListUsers.push({
                        UserId: user1._id,
                        DisplayName: user1.DisplayName,
                        Avatar: user1.Avatar,
                        LinkPage: user1.LinkPage,
                        Seen: true
                    });
                    chat.ListUsers.push({
                        UserId: user2._id,
                        DisplayName: user2.DisplayName,
                        Avatar: user2.Avatar,
                        LinkPage: user2.LinkPage,
                        Seen: true
                    });

                    chat.save(function(err) {
                        if (err)
                            res.send(err);
                        //console.log(chat);
                        res.json(chat);
                    });
                }
            },1000);
        });
    });
}

exports.postNewChat = function(users, res) {
    var chat = new Chat();

    chat.CreateDate = new Date(); 
    chat.ListUsers = users;

    chat.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Chat added to the database!', data: chat });
    });
}

exports.addMessageToChat = function(req, res) {
    User.find().where('Username').in([req.body.Username]).exec(function(err, users) {
        user = users[0];
        Chat.findById(req.params.id, function(err, chat){
    		chat.ListMessages.push({
                Content: req.body.messageContent,
                Time: new Date(),
                UserId: user.UserId,
                DisplayName: user.DisplayName,
                Avatar: user.Avatar,
                LinkPage: user.LinkPage
            });
    		chat.save(function(err) {
                if (err)
                    res.send(err);
                exports.changeStateSeen(req.params.id, user._id);

                if (req.user._id != chat.ListUsers[0].UserId)
                    io.sockets.emit(chat.ListUsers[0].UserId + 'message', 'New Message');
                else
                    io.sockets.emit(chat.ListUsers[1].UserId + 'message', 'New Message');

                res.json(chat);
            });
    	});
    });
}

exports.addUserToChat = function(req, res) {
	Chat.findById(id, function(err, chat){
		chat.ListUsers.push(user);
		chat.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User added to the Chat!', data: user});
        });
	});
}

exports.deleteUserFromChat = function(idchat, iduser, res) {
	Chat.findById(idchat, function(err, chat) {
		chat.ListUsers.pull({UserId: iduser}, function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User deleted from the Chat!'});
        });
	});
}

exports.changeStateSeen = function(idchat, iduser) {
    Chat.findById(idchat, function(err, chat) {
    	chat.ListUsers.forEach(function(chatUser) {
    		if (chatUser.UserId == iduser) {
    			chatUser.Seen = true;
    		}
    		else {
    			chatUser.Seen = false;
    		}
    	});
        chat.save();
    });
}