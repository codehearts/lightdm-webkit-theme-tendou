module.exports = function (config) {
  'use strict';

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'js/*.js': ['jshint', 'coverage']
    },

    // list of files / patterns to load in the browser
    files: [
      'js/mock/*.js',
      'js/**/*.js',
      'tests/*.js'
    ],

    // list of files to exclude
    exclude: [],

    // optionally, configure the reporter
    // text displays it within the console (alternative: text-summary)
    // lcov creates a codecov compatible report
    coverageReporter: {
      reporters: [
        // generates ./coverage/lcov.info
        {type:'lcovonly', subdir: '.'},
        // generates ./coverage/coverage-final.json
        {type:'json', subdir: '.'},
      ]
    },

    jshintPreprocessor: {
      jshintrc: './.jshintrc',
      stopOnError: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // coverage is from karma-coverage and provides Istanbul coverage reports
    reporters: ['mocha', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values:
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    //   config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // start these browsers. available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
