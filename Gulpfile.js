var gulp    = require('gulp'),
	gutil    = require('gulp-util'),
  uglify  = require('gulp-uglify'),
  concat  = require('gulp-concat');
	Server = require('karma').Server;

gulp.task('minifyJS', function(){
	gulp.src('./src/*.js')
    	.pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', function(){
    gulp.run(['minifyJS', 'test']); 
});