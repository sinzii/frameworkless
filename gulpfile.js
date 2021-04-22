const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

gulp.task('scss', () => {
    return gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('reload-browser', (done) => {
    browserSync.reload();
    done();
});

gulp.task('serve', (done) => {
    browserSync.init({
        proxy: 'localhost:3000'
    });

    gulp.watch(['./scss/**/*.scss'], gulp.series(['scss', 'reload-browser']));

    done();
});
