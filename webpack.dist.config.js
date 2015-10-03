/*
 * Webpack distribution configuration
 *
 * This file is set up for serving the distribution version. It will be compiled to dist/ by default
 */

var webpack = require('webpack'),
    path = require('path');
var eslintrcPath = path.resolve(__dirname, '.eslintrc');

module.exports = {
  devtool: 'eval',
  watch: true,
  output: {
    publicPath: './',
    path: 'dist/',
    filename: 'main.js'
  },

  entry: {
    main: ['./src/containers/App.js']
  },

  externals: {
    react: 'React'
  },

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ],

  resolve: {
    extensions: ['', '.js'],
    alias: {
      'styles': __dirname + '/src/styles',
      'mixins': __dirname + '/src/mixins',
      'components': __dirname + '/src/components/'
    }
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: { compact: false }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.scss/,
      loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
    }, {
      test: /\.(png|jpg|woff|woff2)$/,
      loader: 'url-loader?limit=8192'
    }]
  },

  eslint: {
    configFile: eslintrcPath
  }
};
