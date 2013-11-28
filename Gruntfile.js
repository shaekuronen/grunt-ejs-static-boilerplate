
var pages = require('./dev/data/pages.json');

/*global module:false*/
module.exports = function(grunt) {

  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // start a node server
    connect: {
      preview: {
        options: {
          port: 9000,
          base: 'preview'
        }
      },
      optimize: {
        options: {
          port: 9001,
          keepalive: true,
          base: 'production'
        }
      }
    },

    // delete everything from preview or production directories before optimize task
    clean: {
      preview: {
        src: 'preview/'
      },
      pre_optimize: {
        src: 'production/'
      },
      post_optimize: {
        src: [
          'production/pages/',
          'production/templates/',
          'production/scripts.ejs',
          'production/head.ejs'
        ]
      }
    },

    ejs_static: {
      preview: {
        options: {
          dest: 'preview',
          path_to_data: 'dev/data/pages.json',
          path_to_layouts: 'dev/templates/layouts',
          index_page: 'home',
          parent_dirs: true,
          underscores_to_dashes: true,
          file_extension: '.html'
        }
      },
      optimize: {
        options: {
          dest: 'production',
          path_to_data: 'dev/data/pages.json',
          path_to_layouts: 'production/templates/layouts',
          index_page: 'home',
          parent_dirs: true,
          underscores_to_dashes: true,
          file_extension: '.html'
        }
      }
    },

    copy: {
      preview: {
        files: [
          {expand: true, cwd: 'dev/', src: ['img/**'], dest: 'preview/'},
          {expand: true, cwd: 'dev/', src: ['css/**'], dest: 'preview/'},
          {expand: true, cwd: 'dev/', src: ['js/**'], dest: 'preview/'},
          {expand: true, cwd: 'dev/', src: ['.ht*'], dest: 'preview/'}
        ]
      },
      img: {
        files: [
          {expand: true, cwd: 'dev/', src: ['img/**'], dest: 'preview/'}
        ]
      },
      css: {
        files: [
          {expand: true, cwd: 'dev/', src: ['css/**'], dest: 'preview/'}
        ]
      },
      js: {
        files: [
          {expand: true, cwd: 'dev/', src: ['js/**'], dest: 'preview/'}
        ]
      },
      optimize: {
        files: [
          {expand: true, cwd: 'dev/', src: ['**'], dest: 'production/'},
          {expand: true, flatten: true, cwd: 'dev/', src: ['templates/components/global/head.ejs'], dest: 'production/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'dev/', src: ['templates/components/global/scripts.ejs'], dest: 'production/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'dev/', src: ['css/fonts/**'], dest: 'production/fonts/', filter: 'isFile'}
        ]
      }
    },

    // get the scripts inside scripts.ejs and head.ejs build:js blocks
    'useminPrepare': {
      html: [
        'production/head.ejs',
        'production/scripts.ejs'
      ]
    },

    // update the scripts links to point to the concatenated and minified js/main.js
    usemin: {
      html: [
        'production/templates/components/global/head.ejs',
        'production/templates/components/global/scripts.ejs'
      ]
    },

    rev: {
      files: {
        src: [
          'production/js/main.js',
          'production/css/main.css'
        ]
      }
    },

    watch: {
      preview: {
        files: 'dev/**',
        tasks: ['preview'],
        options: {
          debounceDelay: 250,
          livereload: true,
          spawn: false
        },
      },
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'dev/js/site/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      }
    },

    imagemin: {
      production: {
        files: [{
          expand: true,
          cwd: 'production/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'production/img/'
        }]
      }
    }

  });


  // DEVELOPMENT
  // discussion @ https://github.com/gruntjs/grunt/issues/975

  // preview the site during development
  grunt.registerTask('preview', [], function () {

    // load plugins for preview task
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ejs-static');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // execute the task
    grunt.task.run(
      'clean:preview',
      'copy:preview',
      'ejs_static:preview',
      'connect:preview',
      'watch'
    );

  });
  // end preview the site during development
  // END DEVELOPEMENT

  // OPTIMIZE
  // optimize the site for deployment
  grunt.registerTask('optimize', [], function () {

    // load plugins for optimize task
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-ejs-static');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // execute the task
    grunt.task.run(
      'clean:pre_optimize',
      'copy:optimize',
      'useminPrepare',
      'concat',
      'cssmin',
      'uglify',
      'rev',
      'usemin',
      'ejs_static:optimize',
      'clean:post_optimize',
      'imagemin',
      'connect:optimize'
    );

  });
  // END OPTIMIZE

};