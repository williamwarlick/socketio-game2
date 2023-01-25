const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
        index: './src/index.js',
        game1: './src/game1.js',
        game2: './src/game2.js',
        checkers: './src/checkers/checkers.js',
        moveablock: './src/moveablock/moveablock.js',
    },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[id].[chunkhash].js'
  },
  mode: 'development',
  //resolve: {
  //  alias: {
  //    'handlebars': 'handlebars/dist/handlebars.js'
  //  }
  //},
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: ['style-loader', 'css-loader'],
      }
    ]},
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: true,
        chunks: ['index'],
        filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
        template: './src/game1.html',
        inject: true,
        chunks: ['game1'],
        filename: 'game1.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/game2.html',
      inject: true,
      chunks: ['game2'],
      filename: 'game2.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/checkers/checkers.html',
      inject: true,
      chunks: ['checkers'],
      filename: 'checkers.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/moveablock/moveablock.html',
      inject: true,
      chunks: ['moveablock'],
      filename: 'moveablock.html'
    }),
  ]
};