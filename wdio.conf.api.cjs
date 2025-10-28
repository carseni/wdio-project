const { getAuthToken } = require('./test/helpers/auth.helper');

exports.config = {
  runner: 'local',

  specs: ['./test/api/**/*.spec.js'],
  exclude: [],

  automationProtocol: 'devtools',
  services: ['devtools'],

  capabilities: [{
    browserName: 'chrome',
    'wdio:devtoolsOptions': { headless: true },
  }],

  logLevel: 'info',
  outputDir: './logs',

  framework: 'mocha',
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'reports/allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
      },
    ],
  ],

  mochaOpts: { ui: 'bdd', timeout: 60000 },

  onPrepare() {
    const fs = require('fs');
    const path = require('path');
    const dir = path.resolve(__dirname, 'test/api');
    console.log('🔍 Looking for spec files in:', dir);
    console.log('📁 Found files:', fs.readdirSync(dir));
  },

  beforeSession: async function () {
  console.log('🔑 Generating global auth token...');
  try {
    global.authToken = await getAuthToken();
    console.log('✅ Global token generated successfully');
  } catch (error) {
    console.error('❌ Failed to generate global token:', error.message);
    throw error;
  }
},

  before() {
    console.log('🚀 Running API tests in Node environment');
  },
};
