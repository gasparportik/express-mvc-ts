var gulp = require('gulp');
var concat = require('gulp-concat');
var shell = require('gulp-shell');

gulp.task('compile', shell.task(['tsc -p .']));

gulp.task('build', ['compile'], function () {
    return gulp.src(['build/Controller.js', 'build/annotations.js', 'build/index.js']).pipe(concat('index.js')).pipe(gulp.dest('.'));
});

gulp.task('dts', ['compile'], function () {
    return gulp.src(['build/*.d.ts']).pipe(concat('index.d.ts')).pipe(gulp.dest('.'));
});

gulp.task('t4-generate', function () {
    var tt = '"c:\\Program Files (x86)\\Common Files\\microsoft shared\\TextTemplating\\14.0\\TextTransform.exe"';
    return gulp.src('src/annotations.tt', { read: false })
        .pipe(shell([tt + ' <%= file.path %>']));
});

gulp.task('patch', shell.task(['npm --no-git-tag-version version patch']));
 