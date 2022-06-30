const gulp = require("gulp");
const fileinclude = require("gulp-file-include");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');


const paths = {
  scripts: {
    src: "./source",
    dest: "./build/",
  },
};

// Styles

sass.compiler = require("sass");
const styles = () => {
  return gulp
    .src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), csso()]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// HTML

async function html () {
  return gulp
    .src([
      "source/html/pages/*.html",
      "!source/html/blocks/*.html", // ignore
    ])
    .pipe(plumber())
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
};

// Scripts

const scripts = () => {
  return gulp
    .src("source/js/script.js")
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
};

exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return gulp
    .src("source/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest("build/img"));
};

exports.images = optimizeImages;

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}").pipe(gulp.dest("build/img"));
};

exports.images = copyImages;

// WebP

const createWebp = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
};

exports.createWebp = createWebp;

// Sprite

const sprite = () => {
  return gulp
    .src("source/img/icons/*.svg")
    .pipe(
      svgstore({
        inlineSvg: true,
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// Copy

const copy = (done) => {
  gulp
    .src(
      [
        "source/fonts/*.{woff2,woff}",
        "source/*.ico",
        "source/img/**/*.svg",
        "!source/img/icons/*.svg",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
  done();
};

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
};

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/**/*.js", gulp.series(scripts));
  gulp.watch("source/html/**/*.html", gulp.series(html, reload));
  gulp.watch("source/img/**/*.{png,jpg,svg}", gulp.series(copyImages, copyImages));
};

// Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp)
);

exports.build = build;

// Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(styles, html, scripts, sprite, createWebp),
  gulp.series(server, watcher)
);
