import { Given, When, Then, BeforeAll } from '@wdio/cucumber-framework';
import axios from 'axios';
import assert from 'assert';
import testContext, { setResponse, getResponse, setValue } from '../common/context.js';
import { registerOrLogin } from '../../../helpers/registerOrLogin.js';

const baseURL = 'http://localhost:3001/api';
let token;

// 🔹 Create one user for all tag scenarios
BeforeAll(async () => {
  const unique = Date.now();
  const email = `bdd_tags_${unique}@mail.com`;
  const password = 'password123';

  try {
    const user = await registerOrLogin(email, password);
    token = user.token;
    setValue('token_tags', token);
    console.log('🔑 Shared token for tag scenarios');
  } catch (err) {
    console.error('Failed to create/login shared user for tags BeforeAll:', err.message || err);
    throw err;
  }
});


// ---------- Fetch Tags ----------
When('I request all tags', async () => {
  try {
    const resp = await axios.get(`${baseURL}/tags`, {
      headers: { Authorization: `Token ${token}` },
    });
    setResponse(resp);
    console.log('🏷️ Tags fetched:', resp.data.tags?.length ?? 0);
  } catch (err) {
    console.error('❌ Fetch tags failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

// status assertion handled by shared step: features/step-definitions/common/status.steps.js

Then('the response should include a list of tags', () => {
  const resp2 = getResponse();
  assert.ok(Array.isArray(resp2.data.tags), 'Tags should be an array');
  console.log('✅ Tags:', resp2.data.tags);
});
