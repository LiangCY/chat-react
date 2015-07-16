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
        author: {
            name: this.session.user.username,
            qq: this.session.user.qq
        },
        content: message.content,
        date: message.date
    });
};