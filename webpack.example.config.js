var webpack = require('webpack'),
    path = require('path');
var eslintrcPath = path.resolve(__dirname, '.eslintrc');

module.exports = {

  output: {
    publicPath: './assets/',
    path: 'example/assets/',
    filename: '[name].js'
  },

  debug: false,
  devtool: false,
  entry: {
    example: ['./src/example.js']
  },

  externals: {
    react: 'React'
  },

  stats: {
    colors: true,
    reasons: false
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.NormalModuleReplacementPlugin( // allow examples to include react-mentions
      /^react-intl-tel-input$/,
      __dirname + '/dist/main.js'
    )
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
      exclude: /(node_modules|libphonenumber\.js)/,
      loader: 'babel-loader',
      query: { compact: false }
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
