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
    filename: 'main.js',
    library: 'IntlTelInput',
    libraryTarget: 'umd',
  },

  entry: {
    main: ['./src/containers/App.js']
  },

  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
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
      loader: 'uglify-loader!babel-loader'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.scss/,
      loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: "30-40", speed: 1}}'
      ]
    }]
  },

  eslint: {
    configFile: eslintrcPath
  }
};
