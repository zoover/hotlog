const gulp = require('gulp');
const babel = require('gulp-babel');
const gdt = require('gulp-dev-tasks');
const eslintrc = require('./.eslintrc.json');

gdt.setRules(eslintrc.rules);

gulp.task('build', function() {
 return gulp.src('src/**/*.js')
   .pipe(babel({presets: ['es2015', 'stage-2']}))
   .pipe(gulp.dest('build/'));
});

gulp.task('default', ['lint', 'build'], function() {
 gulp.watch('src/**/*.js', ['lint', 'build']);
});
