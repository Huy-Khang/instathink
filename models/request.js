var mongoose = require('mongoose');

var RequestSchema = new mongoose.Schema({
    UserId1: String,
    UserId2: String,
    Time: Date
});

module.exports = mongoose.model('Request', RequestSchema);
