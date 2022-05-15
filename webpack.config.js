const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CompressImgPlugin = require('./plugins')
console.log('=============');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].11build.js'
  },
  module: {
    rules: [{
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name:'[name].[ext]',
            outputPath: '/img.build'
          }
        }
      ]
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressImgPlugin()
  ]
}
