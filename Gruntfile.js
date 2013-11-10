
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
          keepalive: true,
          base: './preview'
        }
      },
      optimize: {
        options: {
          port: 9001,
          keepalive: true,
          base: './production'
        }
      }
    },

    // delete everything from preview or production directories before optimize task
    clean: {
      optimize: {
        src: 'production/'
      },
      preview: {
        src: 'preview/'
      },
      preview_css: {
        src: 'preview/css/'
      },
      preview_js: {
        src: 'preview/js/'
      },
      preview_img: {
        src: 'preview/img/'
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

    // get the css and js inside scripts.ejs and head.ejs build:js blocks
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
          {expand: true, flatten: true, cwd: 'dev/', src: ['templates/components/global/head.ejs'], dest: 'production/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'dev/', src: ['templates/components/global/scripts.ejs'], dest: 'production/', filter: 'isFile'},
          {expand: true, cwd: 'dev/', src: ['templates/**'], dest: 'production/'},
          {expand: true, cwd: 'dev/', src: ['js/**'], dest: 'production/'},
          {expand: true, cwd: 'dev/', src: ['css/**'], dest: 'production/'},
          {expand: true, cwd: 'dev/', src: ['img/**'], dest: 'production/'},
          {expand: true, cwd: 'dev/', src: ['data/**'], dest: 'production/'},
          {expand: true, cwd: 'dev/', src: ['.ht*'], dest: 'production/'},
          {expand: true, cwd: 'dev/', src: ['robots.txt'], dest: 'production/'},
          {expand: true, cwd: 'dev/', src: ['js/vendor/modernizr.custom.js'], dest: 'production/'},
          {expand: true, flatten: true, cwd: 'dev/', src: ['css/fonts/**'], dest: 'production/fonts/', filter: 'isFile'}
        ]
      }
    },

    watch: {
      css: {
        files: 'dev/css/**/*.css',
        tasks: ['refresh_css'],
        options: {
          debounceDelay: 250,
          livereload: true
        },
      },
      js: {
        files: 'dev/js/**/*.js',
        tasks: ['refresh_js'],
        options: {
          debounceDelay: 250,
          livereload: true
        },
      },
      // was getting Warning: EMFILE, too many open files
      // img: {
      //   files: 'dev/img/**/*',
      //   tasks: ['refresh_img'],
      //   options: {
      //     debounceDelay: 250,
      //     livereload: true
      //   },
      // },
      pages: {
        files: 'dev/pages/**/*',
        tasks: ['preview'],
        options: {
          debounceDelay: 250,
          livereload: true
        },
      },
      templates: {
        files: 'dev/templates/**/*',
        tasks: ['preview'],
        options: {
          debounceDelay: 250,
          livereload: true
        },
      },
      data: {
        files: 'dev/data/**/*',
        tasks: ['preview'],
        options: {
          debounceDelay: 250,
          livereload: true
        },
      },
    },

    exec: {
      start_server: {
        command: 'grunt connect:preview &'
      }
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
        options: {
          optimizationLevel: 1
        },
        files: [ {
          expand: true,
          cwd: 'production/img/',
          src:'**/*',
          dest: 'production/img/'
        } ]
      }
    }

  });

  // these plugins provide necessary tasks
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // DEVELOPMENT
  // preview the site during development
  grunt.registerTask('preview', [
    'clean:preview',
    'copy:preview',
    'ejs_static:preview',
    'exec',
    'watch'
  ]);

  // refresh the preview css
  grunt.registerTask('refresh_css', ['clean:preview_css', 'copy:css' ]);

  // refresh the preview js
  grunt.registerTask('refresh_js', ['clean:preview_js', 'copy:js' ]);

  // refresh the preview img
  grunt.registerTask('refresh_img', ['clean:preview_img', 'copy:img' ]);
  // END DEVELOPEMENT

  // DEPLOYMENT
  // optimize the site for deployment
  grunt.registerTask('optimize', [
    'clean:optimize',
    'copy:optimize',
    'useminPrepare',
    'concat',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'ejs_static:optimize',
    // 'copy:optimize',
    'clean:post_optimize',
    'imagemin',
    'connect:optimize'
  ]);
  // END DEPLOYMENT

};