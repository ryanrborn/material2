const path = require('path');
const {customLaunchers, platformMap} = require('./browser-providers');

module.exports = config => {
  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-browserstack-launcher'),
      require('karma-sauce-launcher'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-sourcemap-loader'),
    ],
    files: [
      {pattern: 'node_modules/core-js/client/core.min.js', included: true, watched: false},
      {pattern: 'node_modules/tslib/tslib.js', included: true, watched: false},
      {pattern: 'node_modules/systemjs/dist/system.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/zone.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/proxy.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/sync-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/jasmine-patch.min.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/async-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/fake-async-test.js', included: true, watched: false},
      {pattern: 'node_modules/hammerjs/hammer.min.js', included: true, watched: false},
      {pattern: 'node_modules/moment/min/moment-with-locales.min.js', included: true, watched: false},

      // Include all Angular dependencies
      {pattern: 'node_modules/@angular/**/*', included: false, watched: false},
      {pattern: 'node_modules/rxjs/**/*', included: false, watched: false},

      {pattern: 'test/karma-system-config.js', included: true, watched: false},
      {pattern: 'test/karma-test-shim.js', included: true, watched: false},

      // Include a Material theme in the test suite.
      {pattern: 'dist/packages/**/core/theming/prebuilt/indigo-pink.css', included: true, watched: true},

      // Includes all package tests and source files into karma. Those files will be watched.
      // This pattern also matches all sourcemap files and TypeScript files for debugging.
      {pattern: 'dist/packages/**/*', included: false, watched: true},
    ],

    customLaunchers: customLaunchers,

    preprocessors: {
      'dist/packages/**/*.js': ['sourcemap']
    },

    reporters: ['dots'],
    autoWatch: false,

    sauceLabs: {
      testName: 'Angular Material Unit Tests',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      idleTimeout: 600,
      commandTimeout: 600,
      maxDuration: 5400,
    },

    browserStack: {
      project: 'Angular Material Unit Tests',
      startTunnel: false,
      retryLimit: 3,
      timeout: 1800,
      video: false,
    },

    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    captureTimeout: 180000,

    browsers: ['ChromeHeadlessLocal'],
    singleRun: false,

    // Try Websocket for a faster transmission first. Fallback to polling if necessary.
    transports: ['websocket', 'polling'],

    browserConsoleLogOptions: {
      terminal: true,
      level: 'log'
    },

    client: {
      jasmine: {
        // TODO(jelbourn): re-enable random test order once we can de-flake existing issues.
        random: false
      }
    },
  });

  if (process.env['CIRCLECI']) {
    const instanceIndex = Number(process.env['CIRCLE_NODE_INDEX']);
    const maxParallelInstances = Number(process.env['CIRCLE_NODE_TOTAL']);
    const tunnelIdentifier = `${process.env['CIRCLE_BUILD_NUM']}-${instanceIndex}`;
    const buildIdentifier = `angular-material-${tunnelIdentifier}`;
    const testPlatform = process.env['TEST_PLATFORM'];

    if (testPlatform === 'browserstack') {
      config.browserStack.build = buildIdentifier;
      config.browserStack.tunnelIdentifier = tunnelIdentifier;
    } else if (testPlatform === 'saucelabs') {
      config.sauceLabs.build = buildIdentifier;
      config.sauceLabs.tunnelIdentifier = tunnelIdentifier;
    }

    const platformBrowsers = platformMap[testPlatform];
    const browserInstanceChunks = splitBrowsersIntoInstances(
        platformBrowsers, maxParallelInstances);

    // Configure Karma to launch the browsers that belong to the given test platform
    // and instance.
    config.browsers = browserInstanceChunks[instanceIndex];
  }
};

/**
 * Splits the specified browsers into a maximum amount of chunks. The chunk of browsers
 * are being created deterministically and therefore we get reproducible tests when executing
 * the same CircleCI instance multiple times.
 */
function splitBrowsersIntoInstances(browsers, maxInstances) {
  let chunks = [];
  let assignedBrowsers = 0;

  for (let i = 0; i < maxInstances; i++) {
    const chunkSize = Math.floor((browsers.length - assignedBrowsers) / (maxInstances - i));
    chunks[i] = browsers.slice(assignedBrowsers, assignedBrowsers + chunkSize);
    assignedBrowsers += chunkSize;
  }

  return chunks;
}
