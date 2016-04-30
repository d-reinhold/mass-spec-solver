const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(env) {
  return Object.assign({}, {
    entry: {
      application: './app/runtime/start.js'
    },
    externals: null,
    module: {
      loaders: [
        {test: [/\.svg(\?|$)/, /\.png(\?|$)/, /\.jpg(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/], include: /node_modules/, loader: 'file?name=[name]-[hash].[ext]'},
        {test: /\.css$/, exclude: /typography/, loader: ExtractTextPlugin.extract('css-loader?sourceMap')},
        {test: /\.css$/, include: /typography/, loader: ExtractTextPlugin.extract('css-loader')},
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    },
    resolve: {
      alias: {
        'native-or-bluebird': `${__dirname}/../../app/lib/native_or_bluebird.js`
      },
      root: [
        path.resolve(`${__dirname}/../app`),
        path.resolve(`${__dirname}/../`),
        path.resolve(`${__dirname}/../node_modules`)
      ]
    },
    plugins: [
      new ExtractTextPlugin('components.css'),
      new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
    ]
  }, require(`./webpack/${env}`));
};
