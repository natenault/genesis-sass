'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var del = require('del');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

// SETUP: PLUMBER
var handleErrors = function(err) {
  notify.onError({
    title: 'Error',
    message: '<%= error %>'
  })(err);
  this.emit('end');
};

var plumberOptions = {
  errorHandler: handleErrors
};

// SETUP: AUTOPREFIXER OPTS
var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 2%', 'ie >= 10'],
  cascade: false
};

// SETUP: PATHS
var paths = {
  scripts: {
    src: ['js/*.js', '!js/*.min.js'],
    dist: 'js'
  },
  sass: {
    src: 'sass/**/*.scss'
  },
  styles: {
    src: 'sass/style.scss',
    dist: './'
  }
};

// STYLES
gulp.task('clean:styles', function() {
  return del(['style.css']);
});

gulp.task('styles', ['clean:styles'], function() {
  return gulp
    .src(paths.styles.src)
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.styles.dist))
    .pipe(browserSync.stream());
});

// SCRIPTS
gulp.task('clean:scripts', function() {
  return del(['js']);
});

gulp.task('scripts', function() {
  return gulp
    .src(paths.scripts.src)
    .pipe(plumber(plumberOptions))
    .pipe(babel({ presets: ['env'] }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest(paths.scripts.dist))
    .pipe(browserSync.stream());
});

// WATCH
gulp.task('watch', function() {
  gulp.watch(paths.sass.src, ['styles']);
  gulp.watch(paths.scripts.src, ['scripts']);
});

// BROWSERSYNC
gulp.task('browsersync', function() {
  browserSync.init({
    proxy: 'genesis.dev',
    reloadDebounce: 1000
  });
});

gulp.task('build', ['styles', 'scripts']);

gulp.task('serve', ['build', 'browsersync', 'watch']);

gulp.task('default', ['build']);
