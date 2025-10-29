import { Given, When, Then, BeforeAll } from '@wdio/cucumber-framework';
import axios from 'axios';
import assert from 'assert';
import testContext, { setResponse, getResponse } from '../common/context.js';

const baseURL = 'http://localhost:3001/api';
let credentials;

BeforeAll(async () => {
  const unique = Date.now();
  const email = `bdd_login_${unique}@mail.com`;
  const password = 'password123';
  credentials = { email, password };

  // register a new user; surface clear error if server isn't available
  try {
    await axios.post(`${baseURL}/users`, {
      user: { username: `bdduser_${unique}`, email, password },
    });
    console.log('🔑 Shared user for login scenarios');
  } catch (err) {
    console.error('Failed to create shared user in BeforeAll:', err.code || err.message);
    // rethrow so Cucumber/Wdio marks the hook/scenarios as failed with a clear message
    throw err;
  }
});

Given('an existing user is registered', () => {
  assert.ok(credentials.email, 'Credentials were not set');
});

Then('the API should return a token', async () => {
  // ensure the step awaits something so Cucumber treats it as async
  await Promise.resolve();
  const resp = getResponse();
  assert.ok(resp, 'No response was recorded for the login request');
  assert.strictEqual(resp.status, 200, `Unexpected login status: ${resp.status}`);
  assert.ok(resp.data && resp.data.user && resp.data.user.token, 'Expected token to be present in response');
  console.log('✅ Token returned successfully');
});

When('I log in with valid credentials', async () => {
  const resp = await axios.post(`${baseURL}/users/login`, {
    user: { email: credentials.email, password: credentials.password },
  });
  setResponse(resp);
  console.log('✅ Login success:', resp.status, credentials.email);
});

When('I log in with an invalid password', async () => {
  try {
    await axios.post(`${baseURL}/users/login`, {
      user: { email: credentials.email, password: 'wrongpassword' },
    });
    // If it doesn't throw, mark that as unexpected
    console.error('❌ Unexpected success – backend accepted invalid password');
    setResponse({ status: 200 });
  } catch (err) {
    setResponse(err.response || { status: 500 });
    console.log('✅ Invalid login returned expected error:', getResponse().status);
  }
  return Promise.resolve(); // ✅ ensures step finishes cleanly
});


