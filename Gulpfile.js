/* jshint node: true */

(function () {
	'use strict';

	var gulp = require('gulp');
	var sass = require('gulp-sass');
	var jshint = require('gulp-jshint');
	var jscs = require('gulp-jscs');
	var shell = require('gulp-shell');
	var mocha = require('gulp-mocha');
	var istanbul = require('gulp-istanbul');
	var coveralls = require('gulp-coveralls');

	gulp.task('lint', function () {
		return gulp.src([
			'./build_scripts/**/*.js',
			'./config/**/*.js',
			'./models/**/*.js',
			'./routes/**/*.js',
			'./scrapers/**/*.js',
			'./*.js',
		])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jscs())
		.pipe(jscs.reporter())
		.pipe(jscs.reporter('fail'));

		// .pipe(stylish.combineWithHintResults())
		// .pipe(jshint.reporter('jshint-stylish'));
	});

	gulp.task('scss', function () {
		gulp.src('./public/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./public/css'));
	});

	gulp.task('scss:watch', function () {
		gulp.watch('./public/scss/**/*.scss', ['scss']);
	});

	gulp.task('scrape', ['pcWarning', 'usWarning']);

	gulp.task('pcWarning', shell.task([
		'node scrapers/pcWarnings.js',
	]));

	gulp.task('usWarning', shell.task([
		'node scrapers/usWarnings.js',
	]));

	gulp.task('build_db', shell.task([
		'node build_scripts/build.js',
	]));

	gulp.task('mocha', function () {
		return gulp
			.src('tests/**/*.js', { read: false })
			.pipe(mocha({ reporter: 'nyan' }));
	});

	gulp.task('pre-coveralls', function () {
		return gulp.src('routes/**/*.js')
			.pipe(istanbul())
			.pipe(istanbul.hookRequire());
	});

	gulp.task('coverage', ['pre-coveralls'], function () {
		return gulp
			.src('tests/**/*.js', { read: false })
			.pipe(mocha({ reporter: 'spec' }))
			.pipe(istanbul.writeReports());
	});

	gulp.task('coveralls', ['coverage'], function () {
		return gulp
			.src(__dirname + '/coverage/lcov.info')
			.pipe(coveralls());
	});

	gulp.task('default', ['lint', 'scss', 'scss:watch']);
	gulp.task('ci', ['lint', 'scss', 'mocha']);
	gulp.task('deploy', ['lint', 'scss', 'scrape']);
})();
