const gulp = require('gulp');
const minify = require('gulp-minify'); //for Js
const minifyCss = require('gulp-clean-css'); //For Css
const rename = require('gulp-rename');
const del = require('del');
const argv = require('yargs').argv;

// TASKS TO MINIFY scripts.bundle.js AND vendors.bundle.js

gulp.task('minifyDemoScripts', function () {
  return gulp.src('./src/assets/demo/default/base/scripts.bundle.js')
    .pipe(minify())
    .pipe(gulp.dest('./src/assets/demo/default/base'));
});
gulp.task('minifyVendorsScripts', function () {
  return gulp.src('./src/assets/vendors/base/vendors.bundle.js')
    .pipe(minify())
    .pipe(gulp.dest('./src/assets/vendors/base'));
});
gulp.task('minifyDemoStyles', function () {
  return gulp.src('./src/assets/demo/default/base/style.bundle.css')
    .pipe(minifyCss({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '-min', keepBreaks: false }))
    .pipe(gulp.dest('./src/assets/demo/default/base'));
});
gulp.task('minifyVendorsStyles', function () {
  return gulp.src('./src/assets/vendors/base/vendors.bundle.css')
    .pipe(minifyCss({ compatibility: 'ie8' }))
    .pipe(rename({ suffix: '-min', keepBreaks: false }))
    .pipe(gulp.dest('./src/assets/vendors/base'));
});

gulp.task('minify', gulp.parallel('minifyDemoScripts', 'minifyVendorsScripts', 'minifyDemoStyles', 'minifyVendorsStyles'));


// TASKS TO REFRESH WEB CODE (FROM COMMON)
// PART 1 (delete)
gulp.task('delete-core', function () {
  return del('./src/app/core', { force: true });
});

gulp.task('delete-shared', function () {
  return del('./src/app/shared', { force: true });
});
gulp.task('delete-theme', function () {
  return del('./src/app/theme', { force: true });
});
gulp.task('delete-start', function () {
  return del('./src/app/start', { force: true });
});
gulp.task('delete-ui', function () {
  return del('./src/app/ui', { force: true });
});
gulp.task('delete-ui-custom', function () {
  return del('./src/app/ui-custom', { force: true });
});
gulp.task('delete-commonBusiness', function () {
  return del('./src/app/commonBusiness', { force: true });
});
gulp.task('delete-special', function () {
  return del('./src/app/*.ts', { force: true });
});
gulp.task('delete-outer1', function () {
  let base = './src/';
  return del([base + 'environments'], { force: true });
});
gulp.task('delete-outer2', function () {
  let base = './src/';
  return del([base + 'assets'], { force: true });
});

gulp.task('delete-outer3', function () {
  let base = './src/';
  return del([base + '*', '!' + base + '/app'], { force: true });
});
gulp.task('delete-outer', gulp.series('delete-outer1', 'delete-outer2', 'delete-outer3'));

// PART 2 (copy)
gulp.task('copy-core', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/core/**/*']).pipe(gulp.dest('./src/app/core'));
});
gulp.task('copy-shared', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/shared/**/*']).pipe(gulp.dest('./src/app/shared'));
});
gulp.task('copy-ui', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/ui/**/*']).pipe(gulp.dest('./src/app/ui'));
});
gulp.task('copy-ui-custom', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/ui-custom/**/*']).pipe(gulp.dest('./src/app/ui-custom'));
});
gulp.task('copy-commonBusiness', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/commonBusiness/**/*']).pipe(gulp.dest('./src/app/commonBusiness'));
});
gulp.task('copy-theme', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/theme/**/*']).pipe(gulp.dest('./src/app/theme'));
});
gulp.task('copy-start', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/start/**/*']).pipe(gulp.dest('./src/app/start'));
});
gulp.task('copy-special', function () {
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/app/*.ts']).pipe(gulp.dest('./src/app'));
});
gulp.task('copy-outer', function () {
  gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/environments/**/*']).pipe(gulp.dest('./src/environments'));
  gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/*']).pipe(gulp.dest('./src'));
  return gulp.src(['../../Hasib.Common/Hasib.Common.Web/src/assets/**/*']).pipe(gulp.dest('./src/assets'));

});

gulp.task('d-shared', gulp.parallel('delete-outer', 'delete-core', 'delete-shared', 'delete-ui', 'delete-ui-custom', 'delete-commonBusiness', 'delete-theme', 'delete-start', 'delete-special'));
gulp.task('c-shared', gulp.series('copy-outer', gulp.parallel('copy-core', 'copy-shared', 'copy-ui', 'copy-ui-custom', 'copy-commonBusiness', 'copy-theme', 'copy-start', 'copy-special')));
