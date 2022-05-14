const { reload } = require('browser-sync');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
//const { src, dest } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');

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
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('./build/css'));
});

// sprite
gulp.task('sprite', function buildSprite(cb) {
    var spriteData = gulp.src('./source/images/icons/*.png').pipe(spritesmith({
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
gulp.task('copy:fonts', function fontsCopy() {
    return gulp.src('./source/fonts/**/*')
        .pipe(gulp.dest('./build/fonts'));
});

// copy images
gulp.task('copy:images', function imagesCopy() {
    return gulp.src('./source/images/**/*')
        .pipe(gulp.dest('./build/images'));
});

// copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

// watchers
gulp.task('watch', function myWatchers() {
    gulp.watch('./source/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('./source/styles/**/*.scss', gulp.series('styles:compile'));
});

// default
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));