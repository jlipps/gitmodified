"use strict";

var gulp = require('gulp')
  , header = require('gulp-header')
  , merge = require('merge-stream')
  , filter = require('gulp-filter')
  , sourcemaps = require('gulp-sourcemaps')
  , traceur = require('gulp-traceur');

gulp.task('default', function () {
  var traceurOpts = {
    asyncFunctions: true,
    blockBinding: true,
    modules: 'commonjs',
    annotations: true,
    arrayComprehension: true,
    types: true,
    typeAssertions: true,
    typeAssertionModule: 'rtts-assert',
    sourceMaps: true
  };
  var binFilter = filter(function (file) {
    return /cli\.js/.test(file.path);
  });
  var lib = gulp.src('lib/es6/**/*.js')
                .pipe(sourcemaps.init())
                .pipe(traceur(traceurOpts))
                .pipe(sourcemaps.write())
                .pipe(binFilter)
                   .pipe(header("require('source-map-support').install();\n"))
                   .pipe(header('#!/usr/bin/env node\n'))
                   .pipe(binFilter.restore())
                .pipe(gulp.dest('lib/es5'));
  var test = gulp.src('test/es6/**/*.js')
                 .pipe(traceur(traceurOpts))
                 .pipe(gulp.dest('test/es5'));
  return merge(lib, test);
});


