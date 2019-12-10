/**
 * author caoqiwen;
*/
const gulp = require('gulp');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const rename = require('gulp-rename');
const w = require('gulp-watch');
const autoprefix = require('gulp-autoprefixer');
gulp.task('compile-css', () => {
    return gulp.src(['../**/**/*.less', '../**/*.less', '!../**/_*.less', '!../node_modules/**/*.less'])
        .pipe(less())
        .pipe(cssmin())
        .pipe(autoprefix({ //通过autoprefix自动添加兼容各大浏览器的样式前缀，例如-webkit-，-o-
            overrideBrowserslist: ['last 2 versions'], //兼容最新2个版本
            cascade: false
        }))
        .pipe(rename((path) => {
            path.extname = '.wxss';
        }))
        .pipe(gulp.dest(function (file) { return file.base }));
});
gulp.task('watch', () => {
    return w('./', function () {
        gulp.start('compile-css');
        // gulp.start('auto');
    });
});
// gulp.task('compile-js', () => {
//     return gulp.src(['../src/**/*.js'])
//         .pipe(gulp.dest('../examples/dist/'));
// });

// gulp.task('compile-json', () => {
//     return gulp.src(['../src/**/*.json'])
//         .pipe(gulp.dest('../examples/dist/'));
// });

// gulp.task('compile-wxml', () => {
//     return gulp.src(['../src/**/*.wxml'])
//         .pipe(gulp.dest('../examples/dist/'));
// });

gulp.task('auto', () => {
    gulp.watch('../**/*.less', ['compile-css']);
    // gulp.watch('../src/**/*.js', ['compile-js']);
    // gulp.watch('../src/**/*.json', ['compile-json']);
    // gulp.watch('../src/**/*.wxml', ['compile-wxml']);
});
// gulp.task('default', ['compile-css', 'compile-js', 'compile-json', 'compile-wxml', 'auto']);
gulp.task('default', ['compile-css', 'auto','watch']);
