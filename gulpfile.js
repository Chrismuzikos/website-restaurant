var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    copy = require('gulp-copy'),
    filter = require('gulp-filter'),
    config = require('./gulp-config.json'),
    sourcemaps = require('gulp-sourcemaps');

// Clean task
gulp.task('cln', function() {
  return del([config.paths.distribution + '/**/*']);
});

// Styles task
gulp.task('vcss', function(){
  return gulp
  	.src(config.paths.vendorcss)
  	.pipe(concat('vendor.min.css'))
    .pipe(gulp.dest(config.paths.source + '/css'))
    .pipe(cssnano())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
  	.pipe(gulp.dest(config.paths.distribution + '/css'))
    .pipe(notify({ message: 'Vendor CSS task complete' }));
});

gulp.task('css', function() {
  return sass(config.paths.source + '/scss/style.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    // .pipe(gulp.dest(config.paths.distribution + '/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.distribution + '/css'))
    .pipe(livereload())
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts task
gulp.task('vjs', function(){
	return gulp
		.src(config.paths.vendorjs)
		.pipe(concat('vendor.min.js'))
    // .pipe(uglify())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.paths.distribution + '/js'))
    .pipe(notify({ message: 'Vendor scripts task complete' }));
});

gulp.task('js', function() {
  return gulp.src(config.paths.source + '/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest(config.paths.distribution + '/js'))
    // .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.paths.distribution + '/js'))
    .pipe(livereload())
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images task
gulp.task('img', function() {
  return gulp.src(config.paths.source + '/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(config.paths.distribution + '/img'))
    .pipe(livereload())
    .pipe(notify({ message: 'Images task complete' }));
});

// Copy fonts vendor task perso
gulp.task('cp-fonts', function () {
  gulp.src( [
		'bower_components/bootstrap-sass-official/assets/fonts/**/*',
		'bower_components/font-awesome/fonts/**/*',
	] ).pipe( copy( config.paths.distribution + '/fonts/' , { prefix : 10 } ) )
  .pipe(livereload())
  .pipe(notify({ message: 'Copy fonts task complete' }));
});

// Copy HTML task
gulp.task('cp-html', function () {
  gulp.src(config.paths.source + '/*.html')
    .pipe( copy( config.paths.distribution, { prefix : 10 } ) )
    .pipe(livereload())
    .pipe(notify({ message: 'Copy html task complete' }));
});

// Watch task
gulp.task('watch', function() {
  // Create LiveReload server
  livereload.listen();
  // Watch .scss files
  gulp.watch(config.paths.source + '/scss/**/*.scss', ['css']);
  // Watch .js files
  gulp.watch(config.paths.source + '/js/**/*.js', ['js']);
  // Watch image files
  gulp.watch(config.paths.source + '/img/**/*', ['img']);
  // Watch .html files
  gulp.watch(config.paths.source + '/*.html', ['cp-html']);
  // Watch fonts files
  gulp.watch(config.paths.source + '/fonts', ['cp-fonts']);
});

// The default task for build
gulp.task('default', ['cln'], function() {
    gulp.start('cp-fonts', 'cp-html', 'vcss', 'css', 'vjs', 'js', 'img');
});
