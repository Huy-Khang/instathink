var Relationship = require('../models/relationship');
var express = require('express');
var router = express.Router();
var auth = require('../controllers/auth');
var relationshipController = require('../controllers/relationshipController');


router.post('/relationship/delete', auth.isAuthenticatedREST, relationshipController.khangDeleteRelationship);
router.get('/relationshipByName/:name', auth.isAuthenticatedREST, relationshipController.getRelationshipByName);
router.get('/relationship', auth.isAuthenticatedREST, relationshipController.getRelationshipById);
router.post('/relationship', auth.isAuthenticatedREST, relationshipController.postNewRelationship);
router.delete('/relationship/:idRelationship', auth.isAuthenticatedREST, relationshipController.deleteRelationship);
router.put('/relationship/:id', auth.isAuthenticatedREST, relationshipController.changeDescriptionRelationship);

module.exports = router;

/*var express = require('express');
var router = express.Router();
var Relationship = require('../models/relationship');

router.get('/:id', function(req, res) {
    Relationship.find({UserId1:req.params.id}, function(err, relationships) {
        if (err)
            res.send(err);
        res.json(relationships);
    });
});

router.post('/', function(req, res) {
    var relationship = new Relationship();

    relationship = req.body;

    Relationship.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Relationship added to the database!', data: relationship });
    });
});

router.delete('/:id',function(req, res) {
    Relationship.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Relationship removed from the database!' });
    });
});

router.put('/:id', function(req, res) {
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
});

module.exports = router;
*/