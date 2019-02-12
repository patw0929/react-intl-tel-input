/* eslint-disable import/no-extraneous-dependencies,import/no-dynamic-require,global-require */
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Load environment variables from .env file. Surpress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });

const chalk = require('chalk');
const fs = require('fs-extra');
const rimrafSync = require('rimraf').sync;
const webpack = require('webpack');
const recursive = require('recursive-readdir');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
recursive(paths.appBuild, () => {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  rimrafSync(`${paths.appBuild}/*`);
  rimrafSync(`${paths.appDist}/*`);

  // Start the webpack build
  // eslint-disable-next-line no-use-before-define
  build();
});

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
    console.log();

    // Copy static files to dist folder
    // eslint-disable-next-line no-use-before-define
    copyToDistFolder();

    const openCommand = process.platform === 'win32' ? 'start' : 'open';
    const homepagePath = require(paths.appPackageJson).homepage;
    const publicPath = config.output.publicPath;

    if (homepagePath && homepagePath.indexOf('.github.io/') !== -1) {
      // "homepage": "http://user.github.io/project"
      console.log(`The project was built assuming it is hosted at ${chalk.green(publicPath)}.`);
      console.log(`You can control this with the ${chalk.green('homepage')} field in your ${chalk.cyan('package.json')}.`);
      console.log();
      console.log(`The ${chalk.cyan('dist')} folder is ready to be deployed.`);
      console.log(`To publish it at ${chalk.green(homepagePath)}, run:`);
      console.log();
      console.log(`  ${chalk.cyan('git')} commit -am ${chalk.yellow('"Save local changes"')}`);
      console.log(`  ${chalk.cyan('git')} checkout -B gh-pages`);
      console.log(`  ${chalk.cyan('git')} add -f dist`);
      console.log(`  ${chalk.cyan('git')} commit -am ${chalk.yellow('"Rebuild website"')}`);
      console.log(`  ${chalk.cyan('git')} filter-branch -f --prune-empty --subdirectory-filter dist`);
      console.log(`  ${chalk.cyan('git')} push -f origin gh-pages`);
      console.log(`  ${chalk.cyan('git')} checkout -`);
      console.log();
    } else if (publicPath !== '/') {
      // "homepage": "http://mywebsite.com/project"
      console.log(`The project was built assuming it is hosted at ${chalk.green(publicPath)}.`);
      console.log(`You can control this with the ${chalk.green('homepage')} field in your ${chalk.cyan('package.json')}.`);
      console.log();
      console.log(`The ${chalk.cyan('dist')} folder is ready to be deployed.`);
      console.log();
    } else {
      // no homepage or "homepage": "http://mywebsite.com"
      console.log('The project was built assuming it is hosted at the server root.');
      if (homepagePath) {
        // "homepage": "http://mywebsite.com"
        console.log(`You can control this with the ${chalk.green('homepage')} field in your ${chalk.cyan('package.json')}.`);
        console.log();
      } else {
        // no homepage
        console.log(`To override this, specify the ${chalk.green('homepage')} in your ${chalk.cyan('package.json')}.`);
        console.log('For example, add this to build it for GitHub Pages:');
        console.log();
        console.log(`  ${chalk.green('"homepage"')}${chalk.cyan(': ')}${chalk.green('"http://myname.github.io/myapp"')}${chalk.cyan(',')}`);
        console.log();
      }
      console.log(`The ${chalk.cyan('dist')} folder is ready to be deployed.`);
      console.log('You may also serve it locally with a static server:');
      console.log();
      console.log(`  ${chalk.cyan('npm')} install -g pushstate-server`);
      console.log(`  ${chalk.cyan('pushstate-server')} dist`);
      console.log(`  ${chalk.cyan(openCommand)} http://localhost:9000`);
      console.log();
    }
  });
}

function copyToDistFolder() {
  fs.copySync(`${paths.appBuild}/`, paths.appDist);
}
