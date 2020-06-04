const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');

// File path variables
const files = {
  scssPath: "app/scss/**/*.scss",
  jsPath: "app/js/**/*.js",
};

// Sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist"));
}

//JS task
function jsTask() {
  return src(files.jsPath)
    .pipe(concat("bundle.js"))
    // .pipe(uglify())
    .pipe(dest("dist"));
}

//Cashebusting task
function casheBustTask() {
  const cbString = new Date().getTime();
  return src(["index.html"])
    .pipe(replace(/cb=\d+/g, "cb=" + cbString))
    .pipe(dest("."));
}

// Watch task
function watchTask() {
    watch([files.scssPath, files.jsPath],
        parallel(scssTask, jsTask)
    );
}

//Default task
exports.default = series(
  parallel(scssTask, jsTask),
  casheBustTask,
  watchTask  
);
