'use strict';

// A required polyfill for Node 0.10 in order to get postcss working.
var Promise = require('es6-promise').Promise;

module.exports = function(grunt) {

// A required polyfill for Node 0.10 in order to get postcss working.
var Promise = require('es6-promise').Promise;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8000,
          base: '_site',
          keepalive: true
        }
      }
    },
    watch: {
      styles: {
        files: '_site/css/*.css',
        tasks: ['postcss']
      }
    },
    postcss: {
      options: {

        processors: [
          require('autoprefixer')({browsers: 'last 4 versions'}), // add vendor prefixes
        ]
      },
      dist: {
        src: '_site/css/*.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', ['postcss']);

};