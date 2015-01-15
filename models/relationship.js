 var mongoose = require('mongoose');

var RelationshipSchema = new mongoose.Schema({
    UserId1: String,
    UserId2: String,
    Description: String
});

module.exports = mongoose.model('Relationship', RelationshipSchema);