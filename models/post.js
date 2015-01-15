var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    Body: String,
    Image: String,
    UserId: String,
    DisplayName: String,        //thêm vào lúc 1:26, không có thì không search nổi
    LinkPage: String,           //thêm vào lúc 1:26, không có thì không search nổi
    Avatar: String,             //thêm vào lúc 1:26, không có thì không search nổi
    CreateDate: Date,
    IsAnonymous: Boolean,
    ListTags: [
        {
            UserId: String,
            DisplayName: String,
            LinkPage: String
        }
    ],
    ListToBeNotified: [
        {
            UserId: String
        }
    ],
    ListLikes: [
        {
            UserId: String,
            DisplayName: String,
            LinkPage: String
        }
    ],
    ListComments: [
        {
            UserId: String,
            DisplayName: String,
            LinkPage: String,
            Avatar: String,                 //thêm vào lúc 1:26, không có thì không search nổi
            CreateDate: Date,
            Body: String,
            ListTags: [
                {
                    UserId: String,
                    DisplayName: String,
                    LinkPage: String
                }
            ],
            ListLikes: [
                {
                    UserId: String,
                    DisplayName: String,
                    LinkPage: String
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema);