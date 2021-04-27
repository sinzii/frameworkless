const gulp = require('gulp');
const sass = require('gulp-sass');
const tsConfig = require('./tsconfig.json');
const browserify = require('browserify');
const glob = require('glob');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync').create();

gulp.task('scss', () => {
    return gulp.src('./scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', () => {
    const files = glob.sync('./scripts/**/*.ts');
    return browserify(files)
        .plugin('tsify', tsConfig)
        // .plugin('tinyify')
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./public/js'));
})

gulp.task('reload-browser', (done) => {
    browserSync.reload();
    done();
});

gulp.task('serve', gulp.series('js', 'scss', (done) => {
    browserSync.init({
        proxy: 'localhost:3000'
    });

    gulp.watch(['./scss/**/*.scss'], gulp.series(['scss', 'reload-browser']));
    gulp.watch(['./scripts/**/*.ts'], gulp.series(['js', 'reload-browser']));

    done();
}));
