const webpack = require('webpack');
const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  webpack: {
    base: {
      entry: {
        application: './app/runtime/start.js'
      },
      externals: null,
      module: {
        loaders: [
          {test: [/\.svg(\?|$)/, /\.png(\?|$)/, /\.jpg(\?|$)/, /\.eot(\?|$)/, /\.ttf(\?|$)/, /\.woff2?(\?|$)/], include: /node_modules/, loader: 'file?name=[name]-[hash].[ext]'},
          {test: /\.css$/, exclude: /typography/, loader: ExtractTextWebpackPlugin.extract('css-loader?sourceMap')},
          {test: /\.css$/, include: /typography/, loader: ExtractTextWebpackPlugin.extract('css-loader')},
          {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
      },
      resolve: {
        root: [
          path.resolve(`${__dirname}/app`),
          path.resolve(`${__dirname}/`),
          path.resolve(`${__dirname}/node_modules`)
        ]
      },
      plugins: [
        new ExtractTextWebpackPlugin('components.css'),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
      ]
    },
    development: {
      devtool: 'inline-source-map',
      watch: true
    },
    production: {
      output: {
        filename: '[name].js',
        chunkFilename: '[id].js'
      },
      plugins: [
        new ExtractTextWebpackPlugin('components.css'),
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
        new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
      ]
    },
    test: {
      devtool: 'cheap-module-source-map',
      entry: null,
      externals: null,
      module: {
        loaders: [
          {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?sourceMaps=true'},
          {test: /\.json$/, exclude: /node_modules/, loader: 'json-loader'}
        ]
      },
      output: {
        filename: 'spec.js'
      },
      quiet: true,
      watch: true
    }
  }
};