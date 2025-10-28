const axios = require('axios');

describe('API - Tags', () => {
  const baseURL = 'http://localhost:3001/api';
  const token = global.authToken; // optional, but included for consistency

  it('should fetch the tags list successfully', async () => {
    const response = await axios.get(`${baseURL}/tags`, {
      headers: { Authorization: `Token ${token}` }
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('tags');
    expect(Array.isArray(response.data.tags)).toBe(true);

    if (response.data.tags.length > 0) {
      console.log('🏷️ Tags:', response.data.tags);
    } else {
      console.warn('⚠️ No tags found (empty list is acceptable).');
    }
  });
});
