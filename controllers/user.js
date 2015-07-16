var views = require('co-views');
var render = views(__dirname + '/../views', {
    map: {html: 'nunjucks'}
});
var User = require('../models/user');

exports.loginPage = function *() {
    this.body = yield render('login');
};

exports.userPage = function *() {
    this.body = yield render('user', {
        name: this.session.user.username,
        qq: this.session.user.qq ? this.session.user.qq : ''
    });
};

exports.changeQQ = function *() {
    var qq = this.query.qq;
    yield User.findByIdAndUpdate(
        {_id: this.session.user._id},
        {qq: qq}
    ).exec();
    this.session.user.qq = qq;
    this.body = {success: 1};
};

exports.login = function *() {
    var username = this.request.body.username;
    var password = this.request.body.password;
    var user = yield User.findOne({username: username}).exec();
    if (user) {
        if (yield user.comparePassword(password)) {
            this.session.user = user;
            this.redirect('/');
        }
    }
};

exports.logout = function *() {
    yield User.findByIdAndUpdate(
        {_id: this.session.user._id},
        {status: 0}
    ).exec();
    this.session.user = null;
    this.redirect('/login');
};

exports.online = function *() {
    var user = yield User.findByIdAndUpdate(
        {_id: this.session.user._id},
        {status: 1}
    ).exec();
    this.broadcast.emit('user online', {
        name: user.username,
        qq: user.qq
    });
};

exports.leave = function *() {
    var user = yield User.findByIdAndUpdate(
        {_id: this.session.user._id},
        {status: 0}
    ).exec();
    this.broadcast.emit('user leave', {name: user.username});
};

exports.registerPage = function *() {
    this.body = yield render('register');
};

exports.register = function *() {
    var user = new User(this.request.body);
    yield user.save();
    this.redirect('/login');
};

exports.loginRequired = function *(next) {
    if (this.session.user) {
        yield* next;
    } else {
        this.redirect('/login');
    }
};