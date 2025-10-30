const { waitForBackendReady } = require('./features/step-definitions/common/waitForPort.js');

export const config = {
  // ... existing settings ...
  onPrepare: async function () {
    console.log('⏳ Waiting for backend (port 3001) to be ready...');
    await waitForBackendReady();
  },
};

exports.config = {
  runner: 'local',
  framework: 'cucumber',
  specs: ['./features/**/*.feature'],
  cucumberOpts: {
    require: ['./features/step-definitions/**/*.js'],
    timeout: 60000,
    //tagExpression
  },

  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless=new', '--disable-gpu', '--no-sandbox'],
      },
    },
  ],

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'reports/allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
        useCucumberStepReporter: true,   // ✅ enables Given/When/Then in Allure
      },
    ],
  ],

  beforeSuite: async function () {
    const { getAuthToken } = require('./helpers/auth.helper');
    global.authToken = await getAuthToken();
  },
};
