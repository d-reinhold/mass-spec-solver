process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('babel-core/register');
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const mergeStream = require('merge-stream');
const del = require('del');
const path = require('path');
const webpackTestConfig = require('./webpack.config')('test');
function isProduction() { return process.env.NODE_ENV === 'production';}

function javascript() {
  return gulp.src(['app/components/application.js'])
    .pipe(plugins.plumber())
    .pipe(webpack(require('./webpack.config')(process.env.NODE_ENV)));
}

function sass() {
  let stream = gulp.src('app/stylesheets/application.scss').pipe(plugins.plumber());
  if (!isProduction()) {
    stream = stream
      .pipe(plugins.watch('app/stylesheets/**/*.scss'))
      .pipe(plugins.sassGraphAbs([path.join(__dirname, 'app', 'stylesheets')]));
  }
  return stream
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.init()))
    .pipe(plugins.sass({errLogToConsole: true}))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.if(!isProduction(), plugins.sourcemaps.write()))
    .pipe(plugins.if(isProduction(), plugins.minifyCss()));
}

gulp.task('build', function() {
  return del(['public/build/*', '!public/build/.gitkeep']).then(function() {
    return mergeStream(javascript(), sass()).pipe(gulp.dest('public/build'));
  });
});

gulp.task('jasmine', function() {
  const JasminePlugin = require('gulp-jasmine-browser/webpack/jasmine-plugin');
  const plugin = new JasminePlugin();
  return gulp.src(['spec/**/*_spec.js'])
    .pipe(webpack(Object.assign({}, webpackTestConfig, {plugins: [plugin]})))
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({whenReady: plugin.whenReady}));
});

gulp.task('dev-server', function() {
  plugins.connect.server({
    root: 'public',
    fallback: 'public/index.html',
    port: 5000
  });
});
gulp.task('start', ['build', 'dev-server', 'jasmine']);
gulp.task('default', function() { runSequence('lint', 'spec-unit'); });
