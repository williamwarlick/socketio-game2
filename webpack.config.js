const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
        index: './src/js/index.js',
        moveablock: './src/js/moveablock.js',
        waiting: './src/js/waiting.js',
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
      },
      {
        test: /\.mustache$/,
        use: [
          {
            loader: 'mustache-loader',
          },
        ],
      },
    ]},
  plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: true,
        chunks: ['index'],
        filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/waiting.html',
      inject: true,
      chunks: ['waiting'],
      filename: 'waiting.html'
  }),
    new HtmlWebpackPlugin({
      template: './src/moveablock/moveablock.html',
      inject: true,
      chunks: ['moveablock'],
      filename: 'moveablock.html'
    }),
  ]
};