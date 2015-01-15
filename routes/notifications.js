/*
notification do hệ thống tự tạo và giao tiếp giữa server với client bằng SocketIO
vậy có cần tạo route cho nó không?
nếu có thì những trường hợp nào?
*/

// var Notification = require('../models/notification');
var User = require('../models/user');
var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var notController = require('../controllers/notificationController');

router.get('/notifications', auth.isAuthenticatedREST, notController.getNotification);		
router.put('/notifications', auth.isAuthenticatedREST, notController.postNotification);

module.exports = router;