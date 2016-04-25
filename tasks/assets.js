var gulp = require('gulp');
var mergeStream = require('merge-stream');
var del = require('del');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var webpack = require('webpack-stream');

function isDevelopment() { return process.env.NODE_ENV === 'development'; }
function isProduction() { return process.env.NODE_ENV === 'production';}

function javascriptStatic() {
  return mergeStream([
    gulp.src(require.resolve(`react/dist/react-with-addons${isDevelopment() ? '' : '.min'}`))
      .pipe(plugins.rename(`react.js`)),
    gulp.src(require.resolve(`react-dom/dist/react-dom${isDevelopment() ? '' : '.min'}`))
      .pipe(plugins.rename(`react-dom.js`))
  ]);
}

function javascript(options = {}) {
  var webpackConfig = Object.assign({}, require('../config/webpack.config')(process.env.NODE_ENV), options);
  return gulp.src(['app/components/application.js'])
    .pipe(plugins.plumber())
    .pipe(webpack(webpackConfig));
}

function sass({watch = false} = {}) {
  var stream = gulp.src('app/stylesheets/application.scss').pipe(plugins.plumber());
  if (watch) {
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
  return del(['public/*', '!public/.gitkeep', '!public/index.html', '!public/nginx.conf']).then(function() {
    return mergeStream(
      javascriptStatic(),
      javascript({watch: isDevelopment()}),
      sass({watch: isDevelopment()})
    ).pipe(gulp.dest('public'));
  });
});
