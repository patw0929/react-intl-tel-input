
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const paths = require('../config/paths');

module.exports = {
  devtool: false,
  entry: {
    main: '../src/components/IntlTelInputApp.js',
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
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/,
          /\.png$/,
          /\.svg$/,
        ],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader?outputStyle=expanded',
        ],
      },
      // {
      //   test: /\.css$/,
      //   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      // },
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: [
      //     'file-loader?name=[name].[ext]',
      //     {
      //       loader: 'image-webpack-loader',
      //       options: {
      //         pngquant: {
      //           quality: '30-40',
      //           speed: 1,
      //         },
      //       },
      //     },
      //   ],
      // },
    ],
  },
};

