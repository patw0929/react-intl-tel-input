'use strict';

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var webpackExampleConfig = require('./webpack.example.config.js'),
    webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

var imageminPngquant = require('imagemin-pngquant');

module.exports = function (grunt) {
  // Let *load-grunt-tasks* require everything
  require('load-grunt-tasks')(grunt);

  // Read configuration from package.json
  var folders = {
    src: "src",
    test: "test",
    dist: "dist",
    example: "example"
  };

  grunt.initConfig({
    folders: folders,

    webpack: {
      example: webpackExampleConfig,
      dist: webpackDistConfig
    },

    'webpack-dev-server': {
      options: {
        hot: true,
        port: 8000,
        host: '0.0.0.0',
        webpack: webpackDevConfig,
        publicPath: '/assets/',
        contentBase: './<%= folders.src %>/'
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
              mountFolder(connect, folders.example)
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

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          use: [imageminPngquant({quality: '30-40', speed: 1})]
        },
        files: [{
          flatten: true,
          expand: true,
          src: '<%= folders.src %>/images/*',
          dest: '<%= folders.dist %>/images/'
        }]
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
              '<%= folders.src %>/index.html'
            ],
            dest: '<%= folders.example %>/',
            filter: 'isFile'
          },
          {
            flatten: true,
            expand: true,
            src: [
              '<%= folders.src %>/libphonenumber.js'
            ],
            dest: '<%= folders.dist %>/',
            filter: 'isFile'
          },
          {
            flatten: true,
            expand: true,
            src: '<%= folders.src %>/styles/*',
            dest: '<%= folders.dist %>/styles/'
          }
        ]
      }
    },

    clean: {
      example: {
        files: [{
          dot: true,
          src: [
            '<%= folders.example %>'
          ]
        }]
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= folders.dist %>'
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

  grunt.registerTask('build', ['clean:example', 'imagemin', 'copy', 'webpack:example']);
  grunt.registerTask('build:dist', ['clean:dist', 'imagemin', 'copy', 'webpack:dist']);

  grunt.registerTask('default', []);
};
