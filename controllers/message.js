exports.add = function *() {
    this.emit('new message', {
        username: this.session.user.username,
        content: this.data[0]
    });
};