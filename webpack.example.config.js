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
    react: 'React',
    'react-dom': 'ReactDOM'
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
    new webpack.NormalModuleReplacementPlugin(
      /^react-intl-tel-input$/,
      __dirname + '/dist/main.js'
    ),
    new webpack.NormalModuleReplacementPlugin(
      /^\.\/main\.css$/,
      __dirname + '/dist/main.css'
    ),
  ],

  resolve: {
    extensions: ['', '.js'],
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /(node_modules|libphonenumber\.js)/,
      loader: 'babel-loader',
      query: { compact: false }
    }, {
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.png$/i,
      loader: 'file?name=images/[name].[ext]'
    }]
  },

  eslint: {
    configFile: eslintrcPath
  }
};
