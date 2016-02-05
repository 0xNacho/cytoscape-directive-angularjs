var gulp    = require('gulp'),
	gutil    = require('gulp-util'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat');

gulp.task('minifyJS', function(){
	gulp.src('./src/*.js')
    	.pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', function(){
    gulp.run('minifyJS'); 
});