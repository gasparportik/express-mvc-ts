var gulp = require('gulp');
var del = require('del');
var shell = require('gulp-shell');

gulp.task('copy-lib', function () {
    return gulp.src(['../../index.js'])
        .pipe(gulp.dest('node_modules/express-mvc-ts/.'));
});

gulp.task('copy-dts', function () {
    return gulp.src(['../../express-mvc-ts.d.ts'])
        .pipe(gulp.dest('.'));
});

gulp.task('build', ['copy-lib', 'copy-dts'], shell.task(['tsc -p .']));

gulp.task('run', shell.task(['node app.js'], { interactive: true }));
