'use strict';

var fs          = require('fs');
var path        = require('path');
var gulp        = require('gulp');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var watch       = require('gulp-watch');
var sass        = require('gulp-sass');
var template    = require('gulp-template');

var base_dir = './src/frontend/';
var target_dir = './public/resources/nativeAssets/';

gulp.task('compile_html', compile_html);
gulp.task('compile_sass', compile_sass);
gulp.task('compile_assets', compile_assets);
gulp.task('watch', onWatch);
gulp.task('default', ['compile_html', 'compile_sass', 'compile_assets', 'watch']);

function compile_html(){
    build_files(__dirname, base_dir + 'accounts/*.html', target_dir + '/accounts');
    build_files_concat(__dirname, base_dir + 'main/*.html', target_dir + '/index.html');
}

function compile_sass(){
    compile_sass_concat(__dirname, [base_dir + '*/*.scss'], target_dir + 'index.css');
}

function compile_assets(){
    copy_files(__dirname, base_dir + '/**/*.svg', target_dir+'/svg');
}

function build_files(root, src_files, dest_file){
    return gulp.src(src_files, { base: base_dir })
        .pipe(gulp.dest(path.dirname(dest_file)))
}

function build_files_concat(root, src_files, dest_file){
    return gulp.src(src_files)
        .pipe(concat(path.basename(dest_file)))
        .pipe(gulp.dest(path.dirname(dest_file)))
}


function copy_files(root, src_files, dest_file){
    return gulp.src(src_files, { base: base_dir })
    .pipe(gulp.dest(dest_file))
}

function compile_sass_concat(root, src_files, dest_file){
    return gulp.src(src_files)
        .pipe(sass({includePaths: [base_dir]}))
        .pipe(concat(path.basename(dest_file)))
        .pipe(gulp.dest(path.dirname(dest_file)))
}

function onWatch(){
    gulp.watch([base_dir + '/*', base_dir + '/*/*'], compile_html);
    gulp.watch([base_dir + '/*', base_dir + '/*/*'], compile_sass);
}
