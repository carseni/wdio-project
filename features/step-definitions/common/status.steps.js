import { Then } from '@wdio/cucumber-framework';
import assert from 'assert';
import { getResponse } from './context.js';

// Debug logging to help diagnose registration/loading issues
try {
  // eslint-disable-next-line no-console
  console.log('[status.steps] loaded:', __filename);
} catch (e) {}

function assertStatus(statusCode) {
  const response = getResponse();
  // eslint-disable-next-line no-console
  if (!response) console.log(`[status.steps] no response recorded when expecting ${statusCode}`);
  assert.ok(response, 'No response was recorded for the request');
  assert.strictEqual(response.status, statusCode, `Expected status ${statusCode} but got ${response.status}`);
}

Then('the API should return status {int}', (statusCode) => {
  assertStatus(statusCode);
});

// Backwards-compatible phrase used in some features
Then('the API should respond with status {int}', (statusCode) => {
  assertStatus(statusCode);
});

// Additional common variants (covers small wording differences)
Then('the API should return status code {int}', (statusCode) => {
  assertStatus(statusCode);
});
