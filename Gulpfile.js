(function() {
  'use strict';
   
  var gulp = require('gulp');
  var sass = require('gulp-sass');
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');

  gulp.task('lint', function() {
    return gulp.src([
      './build_scripts/**/*.js', 
      './config/**/*.js', 
      './models/**/*.js', 
      './routes/**/*.js',
      './scrapers/**/*.js',
      './*.js'
      ])
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
  });

  gulp.task('scss', function () {
    gulp.src('./public/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./public/css'));
  });

  gulp.task('scss:watch', function () {
    gulp.watch('./public/scss/**/*.scss', ['scss']);
  });

  gulp.task('default', ['lint', 'scss', 'scss:watch']);
  gulp.task('deploy', ['lint', 'scss']);
})();