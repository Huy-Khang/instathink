var Request = require('../models/request');
var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var requestController = require('../controllers/requestController');

router.get('/request/toprequest',  auth.isAuthenticatedREST, requestController.getTopRequest);
router.get('/request/requestuser1byname/:name', auth.isAuthenticatedREST, requestController.getUser1ByName);
router.get('/request/requestuser2byname/:name', auth.isAuthenticatedREST, requestController.getUser2ByName);

router.get('/request/user1/:id', auth.isAuthenticatedREST, requestController.getRequestOfUser1);
router.get('/request/user2/:id', auth.isAuthenticatedREST, requestController.getRequestOfUser2);
router.post('/request', auth.isAuthenticatedREST, requestController.postNewRequest);
router.delete('/request/:id', auth.isAuthenticatedREST, requestController.deleteRequest);

module.exports = router;