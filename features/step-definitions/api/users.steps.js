import { Given, When, Then } from '@wdio/cucumber-framework';
import axios from 'axios';
import assert from 'assert';
import testContext, { setResponse, getResponse } from '../common/context.js';

const baseURL = 'http://localhost:3001/api';
let existingEmail;

Given('an existing user', async () => {
  const email = `existing_${Date.now()}@mail.com`;
  existingEmail = email;
  await axios.post(`${baseURL}/users`, {
    user: { username: `user_${Date.now()}`, email, password: 'password123' },
  });
});

When('I register a new user', async () => {
  const resp = await axios.post(`${baseURL}/users`, {
    user: {
      username: `newuser_${Date.now()}`,
      email: `new_${Date.now()}@mail.com`,
      password: 'password123',
    },
  });
  setResponse(resp);
});

Then('the response should contain a valid token', () => {
  const resp = getResponse();
  assert.strictEqual(resp.status, 201);
  assert.ok(resp.data.user.token);
});

When('I try to register with the same email', async () => {
  try {
    await axios.post(`${baseURL}/users`, {
      user: { username: `dup_${Date.now()}`, email: existingEmail, password: 'password123' },
    });
  } catch (err) {
    setResponse(err.response);
  }
});

Then('the response should return status {int}', (statusCode) => {
  const resp = getResponse();
  assert.strictEqual(resp.status, statusCode);
});
