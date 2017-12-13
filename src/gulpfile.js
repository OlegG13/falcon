const gulp           = require('gulp'),
      minifyCss      = require('gulp-clean-css'),
      renameFile     = require('gulp-rename'),
      sass           = require('gulp-sass'),
      combineMq      = require('gulp-combine-mq'),
      autoprefixer   = require('gulp-autoprefixer'),
      jsmin          = require('gulp-uglify'),
      mainBowerFiles = require('main-bower-files'),
      addsrc         = require('gulp-add-src'),
      sprite         = require('gulp.spritesmith'),
      changed        = require('gulp-changed'),
      imagemin       = require('gulp-imagemin'),
      svgStore       = require('gulp-svgstore'),
      cheerio        = require('gulp-cheerio'),
      concat         = require('gulp-concat'),
      sourcemaps     = require('gulp-sourcemaps'),
      runSequence    = require('run-sequence'),
      browserSync    = require('browser-sync').create();


const scssSrc = 'components/*.scss';
const cssDist = '../dist/css';

const jsSrc          = 'js/*.js';
const jsDist         = '../dist/js';

const svgSpriteSrc  = "components/svg/sprite/";
const svgSpriteDest = "../dist/img/";

const htmlSrc = '../dist/index.html';

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "../dist/"
    }
  });
});

/* Call while working with project */
gulp.task('default', ['watch','serve']);

/* Call at first start, after changes in bower.json or in gulp.js */
gulp.task('build', function (cb) {
  runSequence('svg', 'sprite', 'cssbuild', 'libs', 'jsbuild', cb);
});

/* Watch command */
gulp.task('watch', ['css', 'js'], function () {
  gulp.watch(scssSrc, ['css']);
  gulp.watch(jsSrc, ['js']);
  gulp.watch(svgSpriteSrc + "**/*.svg", ['svg']);
  gulp.watch(htmlSrc).on('change', browserSync.reload);
});

/* CSS production file packaging */
gulp.task('css', function () {

  /* Bower css libraries. You can config list of files in bower.json */
  var bowerCss = mainBowerFiles('**/*.css');

  return gulp.src('final.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        precision:    10,
        includePaths: require('node-bourbon').includePaths
      }).on('error', sass.logError))
      .pipe(addsrc.append(bowerCss))
      .pipe(concat('main.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(cssDist))
      .pipe(browserSync.stream());
});

/* CSS production file packaging */
gulp.task('cssbuild', function () {

  /* Bower css libraries. You can config list of files in bower.json */
  var bowerCss = mainBowerFiles('**/*.css');

  return gulp.src('final.scss')
      .pipe(sass({
        precision:    10,
        includePaths: require('node-bourbon').includePaths
      }).on('error', sass.logError))
      .pipe(addsrc.append(bowerCss))
      .pipe(concat('main.css'))
      .pipe(autoprefixer({
        browsers: ['last 4 versions', 'ie > 8', '> 1%']
      }))
      .pipe(combineMq())
      .pipe(minifyCss({"keepSpecialComments": 0}))
      .pipe(gulp.dest(cssDist));
});

/* JS production file packaging */
gulp.task('js', function () {

  /* Packaging all js files into one minified file */
  return gulp.src(jsSrc)
      .pipe(sourcemaps.init())
      .pipe(concat('main.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(jsDist));
});

/* JS project scripts minimize */
gulp.task('jsbuild', function () {
  return gulp.src(jsSrc)
      .pipe(concat('main.js'))
      .pipe(jsmin())
      .pipe(gulp.dest(jsDist));
});

/* JS production file packaging */
gulp.task('libs', function () {

  /* Bower js libraries. You can config list of files in bower.json */
  var bowerJs = mainBowerFiles('**/*.js');

  /* Packaging all js files into one minified file */
  return gulp.src(bowerJs)
      .pipe(concat('plugins.js'))
      .pipe(jsmin())
      .pipe(gulp.dest(jsDist));
});

/* Sprite */
gulp.task('sprite', function () {

  // Generate our spritesheet
  return gulp.src('components/icons/img/*.png')
      .pipe(sprite({
        imgName: '../img/sprite.png',
        cssName: 'sprite.scss'
      }))
      .pipe(gulp.dest('../dist/img'))
      .pipe(gulp.dest('components/icons/'))
});

/* Build SVG icons sprite */
gulp.task("svg", function () {
  return gulp.src(svgSpriteSrc + "**/*.svg", {base: svgSpriteSrc})
             .pipe(imagemin([
               imagemin.svgo({
                 plugins: [
                   {cleanupIDs: true},
                   {removeTitle: true},
                   {removeDimensions: true},
                   {removeViewBox: false},
                   {removeStyleElement: true},
                   // {cleanupListOfValues: {
                   //   floatPrecision: 0,
                   //   leadingZero: true,
                   //   defaultPx: true,
                   //   convertToPx: true
                   // }},
                   {removeAttrs: {attrs: ["data-name"]}}
                 ]
               })
             ]))
             .pipe(renameFile({
               prefix: "svg-icon__"
             }))
             .pipe(svgStore({fileName: "svg-sprite.svg", inlineSvg: true}))
             .pipe(gulp.dest(svgSpriteDest));
});
