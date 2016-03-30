/*
 * Webpack development server configuration
 *
 * This file is set up for serving the webpack-dev-server, which will watch for changes and recompile as required if
 * the subfolder /webpack-dev-server/ is visited. Visiting the root will not automatically reload.
 */

var webpack = require('webpack'),
    path = require('path');
var eslintrcPath = path.resolve(__dirname, '.eslintrc');

module.exports = {
  devtool: 'eval',
  watch: true,
  output: {
    filename: '[name].js',
    publicPath: '/assets/'
  },
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      './src/containers/IntlTelInputApp.js'
    ],
    example: [
      'webpack/hot/only-dev-server',
      './src/example.js'
    ]
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },

  stats: {
    colors: true,
    reasons: true
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      'styles': __dirname + '/src/styles',
      'mixins': __dirname + '/src/mixins',
      'components': __dirname + '/src/components/',
      'react-intl-tel-input': './containers/IntlTelInputApp.js',
    },
    root: __dirname + '/src',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|libphonenumber\.js)/,
      loader: 'react-hot!babel-loader'
    }, {
      test: /\.scss/,
      loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded'
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: "30-40", speed: 1}}'
      ]
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\/main\.css$/,
      __dirname + '/dist/main.css'
    ),
  ],

  eslint: {
    configFile: eslintrcPath
  }
};
