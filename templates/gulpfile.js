var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    livereload = require('gulp-livereload')
    minify = require('gulp-minify'),

gulp.task('styles', function(){
  gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('css'))
		.pipe(autoprefixer())
		.pipe(minifycss())
		.pipe(gulp.dest('css'))
		.pipe(livereload());
});


gulp.task('default',['styles']);
gulp.task('build', ['styles']) //Build task if bootstrap is not included
gulp.task('watch', function() {

	livereload.listen();

	// Watch .scss files
	gulp.watch('src/scss/**/*.scss', ['styles']);
});
