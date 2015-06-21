'use strict';

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var webpackExampleConfig = require('./webpack.example.config.js'),
    webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require('load-grunt-tasks')(grunt);

  // Read configuration from package.json
  var pkgConfig = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkgConfig,

    webpack: {
      example: webpackExampleConfig,
      dist: webpackDistConfig
    },

    'webpack-dev-server': {
      options: {
        hot: true,
        port: 8000,
        webpack: webpackDevConfig,
        publicPath: '/assets/',
        contentBase: './<%= pkg.src %>/'
      },

      start: {
        keepAlive: true
      }
    },

    connect: {
      options: {
        port: 8000
      },

      example: {
        options: {
          keepalive: true,
          middleware: function (connect) {
            return [
              mountFolder(connect, pkgConfig.example)
            ];
          }
        }
      }
    },

    open: {
      options: {
        delay: 500
      },
      dev: {
        path: 'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
      },
      example: {
        path: 'http://localhost:<%= connect.options.port %>/'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    copy: {
      dist: {
        files: [
          // includes files within path
          {
            flatten: true,
            expand: true,
            src: [
              '<%= pkg.src %>/index.html'
            ],
            dest: '<%= pkg.example %>/',
            filter: 'isFile'
          },
          {
            flatten: true,
            expand: true,
            src: [
              '<%= pkg.src %>/libphonenumber.js'
            ],
            dest: '<%= pkg.dist %>/',
            filter: 'isFile'
          },
          {
            flatten: true,
            expand: true,
            src: '<%= pkg.dist %>/*.png',
            dest: '<%= pkg.example %>/'
          },
          {
            flatten: true,
            expand: true,
            src: '<%= pkg.src %>/styles/*',
            dest: '<%= pkg.dist %>/styles/'
          },
          {
            flatten: true,
            expand: true,
            src: '<%= pkg.src %>/images/*',
            dest: '<%= pkg.dist %>/images/'
          }
        ]
      }
    },

    clean: {
      example: {
        files: [{
          dot: true,
          src: [
            '<%= pkg.example %>'
          ]
        }]
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= pkg.dist %>'
          ]
        }]
      }
    },

    'gh-pages': {
      options: {
        base: 'example'
      },
      src: ['**']
    }
  });

  grunt.registerTask('publish:examples', ['gh-pages']);

  grunt.registerTask('serve', function (target) {
    if (target === 'example') {
      return grunt.task.run(['clean:dist', 'webpack:dist', 'build', 'open:example', 'connect:example']);
    }

    grunt.task.run([
      'open:dev',
      'webpack-dev-server'
    ]);
  });

  grunt.registerTask('test', ['karma']);

  grunt.registerTask('build', ['clean:example', 'copy', 'webpack:example']);

  grunt.registerTask('default', []);
};
