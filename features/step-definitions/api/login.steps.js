import { Given, When, Then, BeforeAll } from '@wdio/cucumber-framework';
import axios from 'axios';
import assert from 'assert';
import testContext, { setResponse, getResponse, setValue } from '../common/context.js';
import { registerOrLogin } from '../common/registerOrLogin.js';

const baseURL = 'http://localhost:3001/api';
let credentials;

BeforeAll(async () => {
  const unique = Date.now();
  const email = `bdd_login_${unique}@mail.com`;
  const password = 'password123';
  credentials = { email, password };

  try {
    const user = await registerOrLogin(email, password);
    // optionally publish token for other step files if they look for it
    if (user?.token) setValue('token_login', user.token);
    console.log('🔑 Shared user for login scenarios — token present:', !!user?.token);
  } catch (err) {
    console.error('Failed to ensure shared user in BeforeAll:', err.message || err);
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


