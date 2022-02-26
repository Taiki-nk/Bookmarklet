const path = require('path')
// const webpack = require('webpack')

module.exports = {
  entry: {
    index: path.join(__dirname, 'src', 'index.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
	},
	mode: 'development',
  // devtool: 'cheap-module-eval-source-map',
  // target: 'node',
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  // plugins: [
  //   externalPlugins
  // ]
}
