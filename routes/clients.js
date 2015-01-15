var express = require('express');
var router = express.Router();
var client = require('../controllers/client');
var auth = require('../controllers/auth');
var oauth2 = require('../controllers/oauth2');

router.route('/clients')
  .post(auth.isAuthenticatedREST, client.postClients)
  .get(auth.isAuthenticatedREST, client.getClients);

module.exports = router;