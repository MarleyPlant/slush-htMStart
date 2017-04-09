var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var cleanCSS    = require('gulp-clean-css');
var sourcemaps  = require('gulp-sourcemaps');
var pug         = require('gulp-pug');

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'pug'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/**/*.pug", ['pug']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ' Minified: ' + details.stats.minifiedSize);
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

gulp.task('pug', function buildHTML() {
  return gulp.src('app/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest("app/"))
});

gulp.task('default', ['serve']);
