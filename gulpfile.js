var gulp = require("gulp"),
    jade = require("gulp-jade"),
    del = require("del"),
    server = require("gulp-connect");

var path = 'www';

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task('jade', ['clean'], function() {
  gulp.src('www/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('www-build'))
});

gulp.task('static', ['clean'], function() {
  gulp.src(['www/**/*.js', 'www/**/*.css'])
    .pipe(gulp.dest('www-build'))
});

gulp.task('watch', function() {
  gulp.watch(path + '/**/*.jade', ['jade']);
  gulp.watch([path + '/**/*.js', path + '/**/*.css'], ['static']);
});

gulp.task('default', ['jade', 'static', 'watch']);

gulp.task('connect', ['watch'], function() {
    server.server({
        root: "www-build"
    });
})