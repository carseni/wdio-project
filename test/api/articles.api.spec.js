const axios = require('axios');
describe('API - Articles CRUD', () => {
  const baseURL = 'http://localhost:3001/api';
  let token;
  let createdSlug;

  it('should create a new article successfully', async () => {
    const response = await axios.post(`${baseURL}/articles`, {
      article: {
        title: 'My first article',
        description: 'API testing with WDIO',
        body: 'This is a great example!',
        tagList: ['api', 'wdio'],
      },
    }, {
      headers: { Authorization: `Token ${global.authToken}` },
    });

    expect(response.status).toBe(201);
    createdSlug = response.data.article.slug;
    console.log('Created article slug:', createdSlug);
  });

  it('should fetch the created article by slug', async () => {
    const response = await axios.get(`${baseURL}/articles/${createdSlug}`);
    expect(response.status).toBe(200);
    expect(response.data.article.slug).toBe(createdSlug);
  });

  it('should update the article successfully and capture new slug', async () => {
    const response = await axios.put(`${baseURL}/articles/${createdSlug}`, {
      article: {
        title: 'My updated article',
        description: 'Updated via API test',
        body: 'This article has been updated successfully!',
      },
    }, {
      headers: { Authorization: `Token ${global.authToken}` },
    });

    expect(response.status).toBe(200);
    expect(response.data.article.title).toBe('My updated article');

    // ✅ capture the new slug
    createdSlug = response.data.article.slug;
    console.log('Updated article slug:', createdSlug);
  });

  it('should fetch the updated article using the new slug', async () => {
    const response = await axios.get(`${baseURL}/articles/${createdSlug}`);
    expect(response.status).toBe(200);
    expect(response.data.article.title).toBe('My updated article');
  });

  it('should delete the article successfully', async () => {
    const response = await axios.delete(`${baseURL}/articles/${createdSlug}`, {
      headers: { Authorization: `Token ${global.authToken}` },
    });
    expect(response.status).toBe(204);
  });

  it('should return 404 when fetching a deleted article', async () => {
    try {
      await axios.get(`${baseURL}/articles/${createdSlug}`);
      throw new Error('Article should not exist');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});
