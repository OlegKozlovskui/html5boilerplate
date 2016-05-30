var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    browserSync = require('browser-sync').create();

gulp.task('sass', function () {
    return gulp.src('sass/style.scss')
        .pipe(sass())
        .pipe(autoprefixer('> 1%', 'last 2 versions', 'ie 9', 'Opera 12.1'))
        .pipe(csso())
        .pipe(gulp.dest('css'));
});

gulp.task('html', function () {
    return gulp.src('*.html');
});

gulp.task('js', function () {
    return gulp.src('js/*.js');
});

gulp.task('browser-sync', function () {
    browserSync.init(["css/*.css", "js/*.js", "*.html"], {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('*.html', ['html']);
    gulp.watch('js/*.js', ['js']);
});

gulp.task('default', ['sass', 'watch', 'html', 'js', 'browser-sync']);