var koa = require('koa.io');
var serve = require('koa-static');
var bodyParser = require('koa-body');
var level = require('level');
var mongoose = require('mongoose');
var route = require('koa-route');
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

app.use(route.get('/', Index.index));
app.use(route.get('/login', User.loginPage));
app.use(route.post('/login', User.login));
app.use(route.get('/register', User.registerPage));
app.use(route.post('/register', User.register));

app.io.use(function* (next) {
    // on connect
    console.log(this.session.user.username);
    yield* next;
    // on disconnect
});

app.io.route('new message', Message.add);

app.listen(3000);