var views = require('co-views');
var render = views(__dirname + '/../views', {
    map: {html: 'nunjucks'}
});

exports.index = function *() {
    this.body = yield render('index', {name: this.session.user.username});
};