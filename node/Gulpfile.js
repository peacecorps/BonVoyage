'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('scss', function () {
	gulp.src('./public/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/css'));
});

gulp.task('scss:watch', function () {
	gulp.watch('./public/scss/**/*.scss', ['scss']);
});

gulp.task('default', ['scss', 'scss:watch']);