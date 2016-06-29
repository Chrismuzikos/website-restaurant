var gulp    = require('gulp');
var gutil   = require("gulp-util")
var sass    = require('gulp-sass');
var clean   = require('del');
var image   = require('gulp-image');
var uglify  = require('gulp-uglify');
var include = require('gulp-include');
var pump    = require('pump');
var plumber = require("gulp-plumber")
var options = require("minimist")(process.argv.slice(2))
var concat  = require('gulp-concat-util');

var assets_dir = 'assets';
var public_dir = 'public';

gulp.task('clean', function () {
	return del([
    public_dir + '/**/*'
  ]);
});

gulp.task('copy', function () {
  gulp.src( 'bower_components/bootstrap-sass/assets/fonts' )
    .pipe(gulp.copy( public_dir ));
});

gulp.task('images', function () {
  gulp.src( assets_dir + '/img/**/*')
    .pipe(image())
    .pipe(gulp.dest(public_dir + '/img/' ));
});

gulp.task('styles', function() {
    gulp.src(assets_dir + '/scss/**/*.scss')
        .pipe(options.production ? gutil.noop() : plumber() )
        .pipe(include())
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: options.production ? 'compressed' : 'nested',
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest( public_dir + '/css/'));
});

gulp.task('scripts', function () {
    gulp.src(assets_dir + '/js/**/*.js')
        .pipe(options.production ? gutil.noop() : plumber() )
        .pipe(include())
        .pipe(sourcemaps.init())
        .pipe( uglify({
          'mangle' : options.production ? true : false,
          'compress' : options.production ? true : false,
          'preserveComments' : options.production ? 'licence' : 'all'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest( public_dir + '/js/'));
});

gulp.task( 'watch' , function() {
    gulp.watch( [ assets_dir + '/scss/**/*.scss' ] , [ 'styles' ] )
        .watch( [ assets_dir + '/img/**/*' ] , [ 'images' ] )
        .watch( [ assets_dir + '/js/**/*.js' ] , [ 'scripts' ] );
});

gulp.task( 'production' , [ 'clean' , 'copy' , 'styles' , 'scripts' , 'images' ] );
gulp.task( 'default' , [ 'clean' , 'copy' , 'watch' ] );
