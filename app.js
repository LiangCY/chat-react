var koa = require('koa.io');
var views = require('co-views');
var level = require('level');
var route = require('koa-route');
var session = require('koa-generic-session');
var store = require('koa-level');

var render = views(__dirname + '/public', {
    map: {html: 'swig'}
});

var db = level('./db');

var app = koa();
app.keys = ['keys'];
app.use(session({
    store: store({db: db})
}));


app.use(route.get('/index', index));

app.io.use(function* (next) {
    console.log(this.handshake);
    //console.log(this.session);
    // on connect
    yield* next;
    // on disconnect
});

// router for socket event
app.io.route('new message', function* () {
    // we tell the client to execute 'new message'
    var message = this.args[0];
    this.broadcast.emit('new message', message);
});

function *index() {
    this.body = yield render('index', {name: this.session.name});
}

app.listen(3000);