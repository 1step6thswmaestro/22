'use strict';

var fs          = require('fs');
var path        = require('path');
var gulp        = require('gulp');
var concat      = require('gulp-concat');
var rename      = require('gulp-rename');
var watch       = require('gulp-watch');
var sass        = require('gulp-sass');
var template    = require('gulp-template');

var base_dir = 'src/frontend/resources/nativeAssets/';
var target_dir = 'src/frontend/compiled/';

gulp.task('compile_assets_html', compileAssets_html);
gulp.task('compile_assets_sass', compileAssets_sass);
gulp.task('watch', onWatch);
gulp.task('default', ['compile_assets_html', 'compile_assets_sass', 'watch']);

function compileAssets_html(){
    build_files(__dirname, base_dir + '*/*.html', target_dir + 'index.html');
}

function compileAssets_sass(){
    compile_sass_concat(__dirname, [base_dir + '*/*.scss'], target_dir + 'index.css');
}

function build_files(root, src_files, dest_file){
    // concat into foldername.js
    // write to output
    // minify
    // rename to folder.min.js
    // write to output again
    return gulp.src(src_files)
        .pipe(concat(path.basename(dest_file)))
        .pipe(template({domain: '/INDEL2'}))
        .pipe(gulp.dest(path.dirname(dest_file)))
        //.pipe(uglify())
        //.pipe(rename(folder + '.min.js'))
        //.pipe(gulp.dest(scriptsPath));
}

function compile_sass_concat(root, src_files, dest_file){
    return gulp.src(src_files)
        .pipe(sass({includePaths: [base_dir]}))
        .pipe(concat(path.basename(dest_file)))
        .pipe(gulp.dest(path.dirname(dest_file)))
}

function onWatch(){
    gulp.watch([base_dir + '/*', base_dir + '/*/*'], compileAssets_html);
    gulp.watch([base_dir + '/*', base_dir + '/*/*'], compileAssets_sass);
}
