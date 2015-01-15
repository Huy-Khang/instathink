var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var oauth2 = require('../controllers/oauth2');

router.route('/authorize')
  .get(auth.isAuthenticatedREST, oauth2.authorization)
  .post(auth.isAuthenticatedREST, oauth2.decision);

// Create endpoint handlers for oauth2 token
router.route('/token')
  .post(auth.isClientAuthenticated, oauth2.token);


 module.exports = router;