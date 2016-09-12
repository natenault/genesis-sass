'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps');

gulp.task("compileSass", function() {
	return gulp.src("sass/style.scss")
		.pipe(maps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(maps.write('.'))
		.pipe(gulp.dest('.'));
});

gulp.task('watchSass', function() {
	gulp.watch('sass/**/*.scss', ['compileSass']);
});

gulp.task("build", ['compileSass']);

gulp.task("default", ['build']);
