var gulp = require('gulp');
var mergeStream = require('merge-stream');
var del = require('del');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var webpack = require('webpack-stream');

function isProduction() { return process.env.NODE_ENV === 'production';}

function javascript() {
  var webpackConfig = Object.assign({}, require('../config/webpack.config')(process.env.NODE_ENV), {watch: !isProduction()});
  return gulp.src(['app/components/application.js'])
    .pipe(plugins.plumber())
    .pipe(webpack(webpackConfig));
}

function sass() {
  var stream = gulp.src('app/stylesheets/application.scss').pipe(plugins.plumber());
  if (!isProduction()) {
    stream = stream
      .pipe(plugins.watch('app/stylesheets/**/*.scss'))
      .pipe(plugins.sassGraphAbs([path.join(__dirname, '..', 'app', 'stylesheets')]));
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
