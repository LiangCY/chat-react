var gulp = require('gulp');
var server = require('gulp-develop-server');

gulp.task('server:start', function () {
    server.listen({
        path: './app.js',
        execArgv: ['--harmony']
    })
});

gulp.task('server:restart', function () {
    gulp.watch('**/*.js', server.restart);
});

gulp.task('default', ['server:start', 'server:restart']);