var koa = require('koa.io');
var serve = require('koa-static');
var bodyParser = require('koa-body');
var level = require('level');
var mongoose = require('mongoose');
var router = require('koa-router')();
var store = require('koa-level');
var moment = require('moment');

var sessionDB = level('./db');
mongoose.connect('mongodb://lcy:lcy@localhost/chat');

var app = koa();

app.use(serve(__dirname + '/public'));
app.use(bodyParser());

app.keys = ['keys'];
app.session({
    store: store({db: sessionDB})
});

var Index = require('./controllers/index');
var User = require('./controllers/user');
var Message = require('./controllers/message');

router.get('/login', User.loginPage);
router.post('/login', User.login);
router.get('/logout', User.logout);
router.get('/register', User.registerPage);
router.post('/register', User.register);
router.get('/', User.loginRequired, Index.index);
router.get('/room', User.loginRequired, Index.getRoom);
router.get('/me', User.loginRequired, User.userPage);
router.get('/qq', User.loginRequired, User.changeQQ);

app.use(router.routes());

app.io.use(function* (next) {
    // on connect
    yield User.online;
    yield* next;
    // on disconnect
    yield User.leave;
});

app.io.route('new message', Message.add);

app.listen(3000);

module.exports = app.io;