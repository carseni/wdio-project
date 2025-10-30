import { Given, When, Then, BeforeAll } from '@wdio/cucumber-framework';
import axios from 'axios';
import assert from 'assert';
import testContext, { setResponse, getResponse, clearResponse, setValue } from '../common/context.js';
import { registerOrLogin } from '../../../helpers/registerOrLogin.js';

const baseURL = 'http://localhost:3001/api';
let token;
let createdSlug;

// 🔹 Runs once for all scenarios (same user and token)
BeforeAll(async () => {
  const unique = Date.now();
  const email = `bdd_articles_${unique}@mail.com`;
  const password = 'password123';

  try {
    const user = await registerOrLogin(email, password);
    token = user.token;
    setValue('token_articles', token);
    console.log('🔑 Shared token for all article scenarios');
  } catch (err) {
    console.error('Failed to create/login shared user for articles BeforeAll:', err.message || err);
    throw err;
  }
});

// ---------- Create ----------
When('I create a new article', async () => {
  try {
    const respCreate = await axios.post(`${baseURL}/articles`, {
      article: {
        title: 'BDD Article',
        description: 'Article created via Cucumber',
        body: 'This is an article created from a BDD test.',
        tagList: ['bdd', 'api'],
      },
    }, {
      headers: { Authorization: `Token ${token}` },
    });
    setResponse(respCreate);
    createdSlug = respCreate.data.article.slug;
    console.log('✅ Article created:', createdSlug);
  } catch (err) {
    console.error('❌ Create failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

// status assertion handled by shared step: features/step-definitions/common/status.steps.js

Then('the response should include an article slug', () => {
  assert.ok(createdSlug, 'Expected an article slug to be defined');
});

// ---------- Fetch ----------
When('I request the article by slug', async () => {
  try {
  const respFetch = await axios.get(`${baseURL}/articles/${createdSlug}`);
  setResponse(respFetch);
  console.log('✅ Article fetched:', respFetch.status);
  } catch (err) {
    console.error('❌ Fetch failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

Then('the API should return the article with the correct title', () => {
  const resp = getResponse();
  assert.strictEqual(resp.status, 200);
  assert.strictEqual(resp.data.article.slug, createdSlug);
});

// ---------- Update ----------
When('I update the article title and description', async () => {
  try {
    const respUpdate = await axios.put(`${baseURL}/articles/${createdSlug}`, {
      article: {
        title: 'BDD Article Updated',
        description: 'Updated article description',
      },
    }, {
      headers: { Authorization: `Token ${token}` },
    });
    setResponse(respUpdate);
    createdSlug = respUpdate.data.article.slug;
    console.log('✅ Article updated:', createdSlug);
  } catch (err) {
    console.error('❌ Update failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

Then('the API should return the updated article with status {int}', (statusCode) => {
  const resp = getResponse();
  assert.strictEqual(resp.status, statusCode);
  assert.strictEqual(resp.data.article.title, 'BDD Article Updated');
});

// ---------- Delete ----------
When('I delete the article', async () => {
  try {
    const respDel = await axios.delete(`${baseURL}/articles/${createdSlug}`, {
      headers: { Authorization: `Token ${token}` },
    });
    setResponse(respDel);
    console.log('✅ Article deleted:', respDel.status);
  } catch (err) {
    console.error('❌ Delete failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

// ---------- Fetch Deleted ----------
When('I request the deleted article', async () => {
  try {
    await axios.get(`${baseURL}/articles/${createdSlug}`);
    throw new Error('Expected 404 but article still exists');
  } catch (err) {
    setResponse(err.response);
    console.log('✅ Deleted article fetch returned expected error:', getResponse().status);
  }
});

// generic status assertion moved to shared step: features/step-definitions/common/status.steps.js

export default {};