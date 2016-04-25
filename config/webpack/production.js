const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  plugins: [
    new ExtractTextPlugin('components.css'),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
  ]
};