
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

    // delete everything from preview or production directories before preview or optimize task
    clean: {
      preview: {
        src: 'preview/'
      },
      pre_optimize: {
        src: 'production/'
      },
      post_optimize: {
        src: [
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
      optimize: {
        files: [
          {expand: true, cwd: 'dev/', src: ['**'], dest: 'production/'},
          {expand: true, flatten: true, cwd: 'dev/', src: ['css/fonts/**'], dest: 'production/fonts/', filter: 'isFile'}
        ]
      }
    },

    // get the scripts inside scripts.ejs and head.ejs build:js blocks
    'useminPrepare': {
      html: [
        'production/templates/components/global/head.ejs',
        'production/templates/components/global/scripts.ejs'
      ],
      options: {
        dest: 'production',
        root: 'production'
      }
    },

    // update the scripts links to point to the concatenated and minified js/main.js
    usemin: {
      html: [
        'production/templates/components/global/head.ejs',
        'production/templates/components/global/scripts.ejs'
      ],
      options: {
        // this is necessary so that usemin can find the revved css and js files
        assetsDirs: ['production']
      }
    },

    filerev: {
      files: {
        src: [
          'production/js/main.js',
          'production/js/vendor/modernizr_custom.js',
          'production/css/main.css'
        ]
      }
    },

    // watch: {
    //   preview: {
    //     files: 'dev/**',
    //     tasks: ['refresh_preview'],
    //     options: {
    //       debounceDelay: 250,
    //       livereload: true,
    //       spawn: false
    //     },
    //   },
    // },

    watch: {
      css: {
        files: 'dev/css/**',
        tasks: ['refresh_css'],
        options: {
          debounceDelay: 250,
          livereload: true,
          spawn: false
        },
      },
      js: {
        files: 'dev/js/**',
        tasks: ['refresh_js'],
        options: {
          debounceDelay: 250,
          livereload: true,
          spawn: false
        },
      },
      // img: {
      //   files: 'dev/img/**',
      //   tasks: ['refresh_preview'],
      //   options: {
      //     debounceDelay: 250,
      //     livereload: true,
      //     spawn: false
      //   },
      // },
      // templates: {
      //   files: 'dev/templates/**',
      //   tasks: ['refresh_preview'],
      //   options: {
      //     debounceDelay: 250,
      //     livereload: true,
      //     spawn: false
      //   },
      // },
      // data: {
      //   files: 'dev/data/**',
      //   tasks: ['refresh_preview'],
      //   options: {
      //     debounceDelay: 250,
      //     livereload: true,
      //     spawn: false
      //   },
      // },
      // this matches any files in root dir like .htaccess, robots.txt, etc
      everything_else: {
        files: 'dev/!(css|js)/**',
        tasks: ['refresh_preview'],
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
    },

    modernizr: {
      "devFile" : "remote",
      "outputFile" : "dev/js/vendor/modernizr_custom.js",
      // add feature tests here
      "extra" : {
        "shiv" : true,
        "load" : true,
        "cssclasses" : true,
        "cssanimations": true
      },
      "uglify" : true,
      "parseFiles" : false
    }

  });

  // discussion @ https://github.com/gruntjs/grunt/issues/975
  //
  // JSHINT
  grunt.registerTask('jshint', [], function () {

    // load plugins for jshint task
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // execute the task
    grunt.task.run(
      'jshint'
    );

  });
  // END JSHINT

  // DEVELOPMENT
  //
  // preview the site during development
  grunt.registerTask('preview', [], function () {

    // load plugins for preview task
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ejs-static');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // execute the task
    grunt.task.run(
      'jshint',
      'clean:preview',
      'modernizr',
      'copy:preview',
      'ejs_static:preview',
      'connect:preview',
      'watch'
    );

  });
  // end preview the site during development

  // refresh preview site when files change
  // necessary tasks are still loaded because of running grunt process (watch), so no need to load plugins
  grunt.registerTask('refresh_css', [
    'copy:preview',
    'ejs_static:preview'
  ]);
  grunt.registerTask('refresh_js', [
    'jshint',
    'copy:preview',
    'ejs_static:preview'
  ]);
  grunt.registerTask('refresh_preview', [
    'copy:preview',
    'ejs_static:preview'
  ]);
  // end refresh preview site when files change
  //
  // END DEVELOPEMENT

  // OPTIMIZE
  //
  // optimize the site for deployment
  grunt.registerTask('optimize', [], function () {

    // load plugins for optimize task
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-filerev');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-ejs-static');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // execute the task
    grunt.task.run(
      'jshint',
      'clean:pre_optimize',
      'modernizr',
      'copy:optimize',
      'useminPrepare',
      'concat',
      'cssmin',
      'uglify',
      'filerev',
      'usemin',
      'ejs_static:optimize',
      'clean:post_optimize',
      'imagemin',
      'connect:optimize'
    );

  });
  // END OPTIMIZE

};