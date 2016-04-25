module.exports = {
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
};