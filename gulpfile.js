var gulp = require('gulp');
var plumber = require('gulp-plumber');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var uncss = require('gulp-uncss');
var nano = require('gulp-cssnano');
var imageop = require('gulp-image-optimization');

gulp.task('htmlminify', function () {
    gulp.src('*.html')
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('production'))
});

gulp.task('cssconcat', function () {
    gulp.src(['css/reset.css',
              'css/normalize.css',
              'css/habit.css',
              'css/960.css',
              'css/768.css',
              'css/320.css'])
        .pipe(plumber())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('.'))
});

gulp.task('cssminify', function () {
    gulp.src('style.css')
        .pipe(plumber())
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(nano())
        .pipe(gulp.dest('production'));
});

gulp.task('imgopt', function () {
    gulp.src(['favicon.png'])
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('production'));
});

gulp.task('default', ['cssconcat', 'cssminify', 'htmlminify', 'imgopt']);
