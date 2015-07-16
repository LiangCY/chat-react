var views = require('co-views');
var render = views(__dirname + '/../views', {
    map: {html: 'nunjucks'}
});

var User = require('../models/user');
var Message = require('../models/message');

exports.index = function *() {
    this.body = yield render('index', {
        name: this.session.user.username
    });
};

exports.getRoom = function *() {
    var messages = [];
    var users = [];
    var dbMessages = yield Message.find().populate('user').sort('-date').exec();
    for (var i = 0; i < dbMessages.length; i++) {
        messages.push({
            author: {
                name: dbMessages[i].user._id == this.session.user._id ? 'me' : dbMessages[i].user.username,
                qq: dbMessages[i].user.qq
            },
            content: dbMessages[i].content,
            date: dbMessages[i].date
        });
    }
    var onlineUsers = yield User.find({status: 1}).sort('username').exec();
    for (var j = 0; j < onlineUsers.length; j++) {
        if (onlineUsers[j]._id != this.session.user._id) {
            users.push({
                name: onlineUsers[j].username,
                qq: onlineUsers[j].qq
            });
        }
    }
    var self = yield User.findById(this.session.user._id).exec();
    this.body = {
        messages: messages,
        users: users,
        me: self
    };
};