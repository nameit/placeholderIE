var gulp = require('gulp'),
    runSequence = require('run-sequence'),
	browserSync = require('browser-sync'),
	stylus = require('gulp-stylus'),
	jade = require('gulp-jade'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins()

/***************** configuration *****************/

var serveConfig = {
	files: [
		'source/*.html',
		'source/css/*.css',
		'source/js/**/*.js'
	],
	server: {
		baseDir: 'source/'
	}
};

gulp.task('browser-sync', function () {
	browserSync(serveConfig);
});


/********************  clean  ********************/
gulp.task('clean',function(){
	return gulp.src(['source/*.html'], {read: false}).pipe(plugins.rimraf());
});

/********************  compile && combine  ********************/



gulp.task('templates',function(){
	gulp.src('source/jade/*.jade')
	.pipe(plugins.changed('source/'))
	.pipe(jade({
		pretty:true
	}))
	.pipe(gulp.dest('source/'))
});





/******************  watch  *************************/

gulp.task("watch",function(){
		gulp.watch('source/jade/*.jade',['templates'])
	})

	

/******************  task  *********************/



gulp.task('default',function(){
	runSequence('clean','templates','browser-sync','watch')
});  //顺序尽量和watch一致，且要html在css前

