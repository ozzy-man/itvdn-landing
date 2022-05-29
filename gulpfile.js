const { reload } = require('browser-sync');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
//const { src, dest } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// static server
gulp.task('server', function browserSyncOper() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "./build"
        }
    });

    gulp.watch('./build/**/*').on('change', browserSync.reload);

});

// pug compile
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('./source/template/index.pug')
        .pipe(
            pug({
                pretty: true
            })
        )
        .pipe(gulp.dest('./build'));
});

// styles compile
gulp.task('styles:compile', function buildStyles() {
    return gulp.src('./source/styles/main.scss')
        .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('./sourcemaps/'))
        .pipe(gulp.dest('./build/css'));
});

// js
gulp.task('js', function buildJS() {
    return gulp.src([
        'source/js/init.js',
        'source/js/validation.js',
        'source/js/form.js',
        'source/js/navigation.js',
        'source/js/main.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});

// sprite
gulp.task('sprite', function buildSprite(cb) {
    const spriteData = gulp.src('./source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    //   return spriteData.pipe(gulp.dest('path/to/output/'));
    spriteData.img.pipe(gulp.dest('./build/images/'));
    spriteData.css.pipe(gulp.dest('./source/styles/global/'));
    cb();
});

// delete
gulp.task('clean', function del(cb) {
    return rimraf('./build', cb);
});

// copy fonts
//gulp.task('copy:fonts', function fontsCopy() {
//    return gulp.src('./source/fonts/**/*')
//        .pipe(gulp.dest('./build/fonts'));
//});

// copy webfonts
gulp.task('copy:webfonts', function webfontsCopy() {
    return gulp.src('./source/webfonts/**/*')
        .pipe(gulp.dest('./build/webfonts'));
});

// copy images
gulp.task('copy:images', function imagesCopy() {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('./build/images'));
});

// copy
//gulp.task('copy', gulp.parallel('copy:fonts', 'copy:webfonts', 'copy:images'));
gulp.task('copy', gulp.parallel('copy:webfonts', 'copy:images'));

// watchers
gulp.task('watch', function myWatchers() {
    gulp.watch('./source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('./source/styles/**/*.scss', gulp.series('styles:compile'));
    gulp.watch('./source/js/**/*.js', gulp.series('js'));
});

// default
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'js', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));