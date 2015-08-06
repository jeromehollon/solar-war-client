var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var del = require('del');
gulpLoadPlugins = require('gulp-load-plugins'),
plugins = gulpLoadPlugins();

var paths = {
	dest: "phonegap/www/",
	jslibs: [
		'src/libs/jquery-2.1.4.min.js',
		'src/libs/underscore-min.js',
		'src/libs/backbone-min.js',
		'src/libs/pixi.min.js',
		'src/libs/*'
	],
	less: [
		'src/css/**'
	],
	jsapp: [
		'src/js/app.js',
		'src/js/utils/*',
		'src/js/models/*',
		'src/js/views/*',
		'src/js/routers/*',
		'src/js/adapters/*',
	],
	assets: [
		"src/index.html",
		"src/tpl/*",
	]
	
}

gulp.task('default', ['watch', 'copyToPhonegap', 'minify-libs', 'minify', 'lessify'], function() {  
});

gulp.task('clean', function(cb){
	return del(["phonegap/www/*"], cb);
});

gulp.task('copyToPhonegap', function() {
	return gulp.src("src/**").pipe(gulp.dest(paths.dest));
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets).pipe(gulp.dest(paths.dest));
});

gulp.task('minify-libs', function(){
	return gulp.src(paths.jslibs)
		.pipe(plugins.uglify())
		.pipe(plugins.concat('app-libs.js'))
		.pipe(gulp.dest(paths.dest + "js"));		
});
gulp.task('minify', function(){
	return gulp.src(paths.jsapp)
		.pipe(plugins.uglify())
		.pipe(plugins.concat('app.min.js'))
		.pipe(gulp.dest(paths.dest + "js"));		
});

gulp.task('lessify', function() {		
	return gulp.src('src/css/styles.less')
		.pipe(less())
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest(paths.dest + "css"));
});

gulp.task('watch', function() {
	gulp.watch(paths.jslibs, ['minify-libs']);
	gulp.watch(paths.less, ['lessify']);
	gulp.watch(paths.jsapp, ['minify']);
	gulp.watch(paths.assets, ['copy-assets']);
});

gulp.task('run', ["default"], plugins.shell.task("phonegap run android", {
		cwd: "phonegap"
	}));

