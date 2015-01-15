var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
    CreateDate: Date,
    ListMessages: [
        {
            Content: String,
            Time: Date,
            UserId: String,
            DisplayName: String,
            Avatar: String,
            LinkPage: String
        }
    ],
    ListUsers: [
        {
            UserId: String,
            DisplayName: String,
            Avatar: String,
            LinkPage: String,
            Seen: Boolean
        }
    ]
});

module.exports = mongoose.model('Chat', ChatSchema);