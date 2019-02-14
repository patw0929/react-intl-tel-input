/* eslint-disable import/no-extraneous-dependencies,import/no-dynamic-require,global-require */
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Load environment variables from .env file. Surpress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });

const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config/webpack.config.prod');

// Create the production build and print the deployment instructions.
function build() {
  console.log('Creating an optimized production build...');
  webpack(config).run((err) => {
    if (err) {
      console.error('Failed to create a production build. Reason:');
      console.error(err.message || err);
      process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log(`The ${chalk.cyan('dist')} folder is ready to be deployed.`);
    console.log();
  });
}

build();
