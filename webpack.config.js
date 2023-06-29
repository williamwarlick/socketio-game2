const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
        index: './src/js/index.js',
        moveablock: './src/js/moveablock.js',
        waiting: './src/js/waiting.js',
        gamecomplete: './src/js/game-complete.js',
        roundack: './src/js/round-acknowledge.js',
        gameinstructions: './src/js/game-instructions.js',
        roundstarting: './src/js/round-starting.js',
        consent: './src/js/header.js',
        admin: './src/js/header.js',
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
      template: './src/game-complete.html',
      inject: true,
      chunks: ['gamecomplete'],
      filename: 'game-complete.html'
  }),
    new HtmlWebpackPlugin({
      template: './src/moveablock.html',
      inject: true,
      chunks: ['moveablock'],
      filename: 'moveablock.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/round-acknowledge.html',
      inject: true,
      chunks: ['roundack'],
      filename: 'round-acknowledge.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/game-instructions.html',
      inject: true,
      chunks: ['gameinstructions'],
      filename: 'game-instructions.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/round-starting.html',
      inject: true,
      chunks: ['roundstarting'],
      filename: 'round-starting.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/consent.html',
      inject: true,
      chunks: ['consent'],
      filename: 'consent.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/admin.html',
      inject: true,
      chunks: ['admin'],
      filename: 'admin.html'
    }),
  ],
};