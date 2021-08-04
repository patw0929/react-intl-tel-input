
const webpack = require('webpack');
const paths = require('../config/paths');

module.exports = {
  devtool: false,
  entry: {
    main: '../src/components/IntlTelInput.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: paths.appSrc,
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
              loader: 'sass-loader',
              options: {
                  implementation: require('sass'),
                  sassOptions: { outputStyle: 'expanded' }
              }
          }
        ],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
          publicPath: './',
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
};

