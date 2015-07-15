var Message = require('../models/message');

exports.add = function *(next, content) {
    var user = this.session.user;
    var newMessage = new Message({
        user: user._id,
        content: content,
        date: new Date()
    });
    var message = yield newMessage.save();
    this.broadcast.emit('new message', {
        username: this.session.user.username,
        content: message.content,
        date: message.date
    });
};

exports.list = function *() {
    var dbMessages = yield Message.find().populate('user').sort('date').exec();
    var messages = [];
    for (var i = 0; i < dbMessages.length; i++) {
        messages.unshift({
            author: dbMessages[i].user._id == this.session.user._id ? 'me' : dbMessages[i].user.username,
            content: dbMessages[i].content,
            date: dbMessages[i].date
        });
    }
    this.body = messages;
};
