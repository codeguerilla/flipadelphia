var gulp = require("gulp");
var jade = require("gulp-jade");
var del = require("del");

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