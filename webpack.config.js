process.env.AWS_SERVICES = 'lambda'; // only include the AWS lambda sdk in the bundle
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const overrides = {
  development: {
    devtool: 'cheap-module-source-map',
  },
  test: {
    devtool: 'cheap-module-source-map',
    entry: null,
    module: {
      loaders: [
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?sourceMaps=true'},
        {test: /\.json$/, exclude: /node_modules/, loader: 'json-loader'}
      ]
    },
    output: {
      filename: 'spec.js'
    },
    quiet: true
  },
  production: {
    watch: false,
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js'
    },
    plugins: [
      new ExtractTextPlugin('components.css'),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
      new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    ]
  }
};

module.exports = function(env) {
  return Object.assign({
    watch: true,
    entry: {
      application: './app/runtime/start.js'
    },
    externals: null,
    module: {
      loaders: [
        {test: [/\.svg(\?|$)/, /\.png(\?|$)/, /\.jpg(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/], include: /node_modules/, loader: 'file?name=[name]-[hash].[ext]'},
        {test: /\.css$/, exclude: /typography/, loader: ExtractTextPlugin.extract('css-loader?sourceMap')},
        {test: /\.css$/, include: /typography/, loader: ExtractTextPlugin.extract('css-loader')},
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
        {test: /aws-sdk/, loaders: ['transform?aws-sdk/dist-tools/transform']},
        {test: /\.json$/, loaders: ['json']}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    },
    resolve: {
      root: [
        path.resolve(`${__dirname}/app`),
        path.resolve(`${__dirname}/node_modules`)
      ]
    },
    plugins: [
      new ExtractTextPlugin('components.css'),
      new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
    ],
    node: {
      fs: 'empty'
    }
  }, overrides[env]);
};