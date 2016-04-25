process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');

require('./tasks/assets');
const {Jasmine, Lint} = require('pui-react-tools');

gulp.task('spec-integration', function(callback) {
  var testData = require('./spec/integration/support/test_data');
  gulp.task('setup', testData.setup);
  gulp.task('teardown', testData.tearDown);
  gulp.task('run', function() {
    return gulp.src('spec/integration/**/*.js')
      .pipe(plugins.plumber())
      .pipe(plugins.jasmine({includeStackTrace: true}));
  });

  process.env.SERVER_URL = process.env.SERVER_URL || 'localhost:4000';
  runSequence('setup', 'run', 'teardown', callback);
});

Lint.install();

Jasmine.install({
  headlessServerOptions: {random: true},
  getAdditionalAppAssets: () => [gulp.src(require.resolve('phantomjs-polyfill/bind-polyfill'))]
});


gulp.task('spec-unit', ['spec-app']);
gulp.task('jasmine-server', ['jasmine']);
gulp.task('dev-server', function() {
  plugins.connect.server({
    root: 'public',
    fallback: 'public/index.html',
    port: 5000
  });
});
gulp.task('start', ['build', 'dev-server', 'jasmine-server']);
gulp.task('default', function() { runSequence('lint', 'spec-unit'); });
