var views = require('co-views');
var render = views(__dirname + '/../views', {
    map: {html: 'nunjucks'}
});

var Message = require('../models/message');

exports.index = function *() {
    this.body = yield render('index', {
        name: this.session.user.username
    });
};