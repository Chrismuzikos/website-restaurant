var gulp       = require('gulp');
var gutil      = require("gulp-util")
var sass       = require('gulp-sass');
var copy       = require('gulp-copy');
var del        = require('del');
var uglify     = require('gulp-uglify');
var include    = require('gulp-include');
var sourcemaps = require('gulp-sourcemaps');
var plumber    = require("gulp-plumber")
var options    = require("minimist")(process.argv.slice(2))

var assets_dir = 'assets';
var public_dir = 'public';

gulp.task('clean', function () {
	return del([
    public_dir + '/fonts',
    public_dir + '/css',
    public_dir + '/js',
  ]);
});

gulp.task('copy', [ 'clean' ] , function () {
  gulp.src( [
		'bower_components/bootstrap-sass/assets/fonts/**/*',
		'bower_components/font-awesome/fonts/**/*',
	] ).pipe( copy( public_dir + '/fonts/' , { prefix : 10 } ) );
});

gulp.task('styles', function() {
    gulp.src(assets_dir + '/scss/**/*.scss')
        .pipe(options.production ? gutil.noop() : plumber() )
				.pipe(include({
					includePaths: [
				  	__dirname + "/bower_components"
					],
					hardFail : true
				}))
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: options.production ? 'compressed' : 'nested',
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( public_dir + '/css/'));
});

gulp.task('scripts', function () {
    gulp.src(assets_dir + '/js/**/*.js')
        .pipe(options.production ? gutil.noop() : plumber() )
        .pipe(include({
					includePaths: [
				  	__dirname + "/bower_components"
					],
					hardFail : true
				}))
        .pipe(sourcemaps.init())
        .pipe( uglify({
          'mangle' : options.production ? true : false,
          'compress' : options.production ? true : false,
          'preserveComments' : options.production ? 'licence' : 'all'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( public_dir + '/js/'));
});

gulp.task( 'watch' , function() {
    gulp.watch( assets_dir + '/scss/**/*.scss' , [ 'styles' ] );
    gulp.watch( assets_dir + '/js/**/*.js' , [ 'scripts' ] );
});

gulp.task( 'default' , [ 'clean' , 'copy' , 'styles' , 'scripts' , 'watch' ] );
