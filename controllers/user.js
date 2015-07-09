var views = require('co-views');
var render = views(__dirname + '/../views', {
    map: {html: 'nunjucks'}
});
var User = require('../models/user');

exports.loginPage = function *() {
    this.body = yield render('login');
};

exports.login = function *(next) {
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

exports.registerPage = function *() {
    this.body = yield render('register');
};

exports.register = function *() {
    var user = new User(this.request.body);
    yield user.save();
    this.redirect('/login');
};