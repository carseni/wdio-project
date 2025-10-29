import { Given, When, Then, BeforeAll, Before } from '@wdio/cucumber-framework';
import axios from 'axios';
import assert from 'assert';
import testContext, { setResponse, getResponse, setValue } from '../common/context.js';

const baseURL = 'http://localhost:3001/api';
let token;
let articleSlug;
let commentId;

// 🔹 Create one user shared across all scenarios
BeforeAll(async () => {
  const unique = Date.now();
  const email = `bdd_comments_${unique}@mail.com`;
  const password = 'password123';

  const register = await axios.post(`${baseURL}/users`, {
    user: { username: `bdduser_${unique}`, email, password },
  });

  token = register.data.user.token;
  // publish token into shared context so the common Given can find it
  setValue('token_comments', token);
  console.log('🔑 Shared token for all comment scenarios');
});

// Create a fresh article per scenario to keep comment lists isolated
Before(async () => {
  try {
    const uniqueArticle = Date.now();
    const articleResponse = await axios.post(`${baseURL}/articles`, {
      article: {
        title: `BDD Comment Article ${uniqueArticle}`,
        description: 'Article created for comment tests',
        body: 'Testing comments on this article',
        tagList: ['bdd', 'comments'],
      },
    }, {
      headers: { Authorization: `Token ${token}` },
    });
    articleSlug = articleResponse.data.article.slug;
    console.log('📝 Created article for comments (Before):', articleSlug);
    // reset commentId per scenario
    commentId = null;
  } catch (err) {
    console.error('❌ Article creation in Before failed:', err.response?.status, err.response?.data);
    throw err;
  }
});


// (Article is created in BeforeAll and reused across scenarios)

// ---------- Add Comment ----------
When('I add a comment to the article', async () => {
  try {
    const resp = await axios.post(`${baseURL}/articles/${articleSlug}/comments`, {
      comment: { body: 'This is a test comment via BDD.' },
    }, {
      headers: { Authorization: `Token ${token}` },
    });
    setResponse(resp);
    commentId = resp.data.comment.id;
    console.log('💬 Comment added with ID:', commentId);
  // keep concise log
  } catch (err) {
    console.error('❌ Add comment failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

// status assertion handled by shared step: features/step-definitions/common/status.steps.js

Then('the response should include a comment ID', () => {
  assert.ok(commentId, 'Comment ID was not returned');
});

// ---------- Fetch Comments ----------
When('I request all comments for the article', async () => {
  try {
    const resp = await axios.get(`${baseURL}/articles/${articleSlug}/comments`, {
      headers: { Authorization: `Token ${token}` },
    });
  setResponse(resp);
  console.log('📜 Comments fetched:', resp.data.comments.length);
  } catch (err) {
    console.error('❌ Fetch comments failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

Then('the API should return a list containing the created comment', () => {
  const resp = getResponse();
  assert.strictEqual(resp.status, 200);
  const found = resp.data.comments.some(c => c.id === commentId);
  assert.ok(found, `Comment with ID ${commentId} not found`);
});

// ---------- Delete Comment ----------
When('I delete the comment', async () => {
  try {
    const resp = await axios.delete(`${baseURL}/articles/${articleSlug}/comments/${commentId}`, {
      headers: { Authorization: `Token ${token}` },
    });
    setResponse(resp);
    console.log('🗑️ Comment deleted:', resp.status);
  } catch (err) {
    console.error('❌ Delete comment failed:', err.response?.status, err.response?.data);
    throw err;
  }
});

// generic status assertion moved to shared step: features/step-definitions/common/status.steps.js

// ---------- Verify Empty After Deletion ----------
Then('the API should return an empty list', () => {
  const resp = getResponse();
  assert.strictEqual(resp.status, 200);
  assert.ok(Array.isArray(resp.data.comments), 'Expected comments array');
  assert.strictEqual(resp.data.comments.length, 0, 'Expected no comments left');
});
