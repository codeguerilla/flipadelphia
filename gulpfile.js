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

gulp.task('js', ['clean'], function() {
  gulp.src('www/**/*.js')
    .pipe(gulp.dest('www-build'))
});

gulp.task('watch', function() {
  gulp.watch(path + '/**/*.jade', ['jade']);
});

gulp.task('default', ['jade', 'js', 'watch']);