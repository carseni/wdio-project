const axios = require('axios');

const baseURL = 'http://localhost:3001/api';

(async () => {
  try {
    const unique = Date.now();
    const email = `debug_comments_${unique}@mail.com`;
    const password = 'password123';

    const register = await axios.post(`${baseURL}/users`, {
      user: { username: `debuguser_${unique}`, email, password },
    });

    const token = register.data.user.token;
    console.log('token:', !!token);

    const articleResponse = await axios.post(`${baseURL}/articles`, {
      article: {
        title: `DEBUG Article ${unique}`,
        description: 'Article created for debug comments',
        body: 'Testing comments debug',
        tagList: ['debug', 'comments'],
      },
    }, { headers: { Authorization: `Token ${token}` } });

    const articleSlug = articleResponse.data.article.slug;
    console.log('articleSlug:', articleSlug);

    const postComment = await axios.post(`${baseURL}/articles/${articleSlug}/comments`, {
      comment: { body: 'This is a debug comment.' },
    }, { headers: { Authorization: `Token ${token}` } });

    console.log('POST comment status:', postComment.status);
    console.log('POST comment data:', postComment.data);

    const getComments = await axios.get(`${baseURL}/articles/${articleSlug}/comments`);
    console.log('GET comments status:', getComments.status);
    console.log('GET comments data:', getComments.data);

  } catch (err) {
    console.error('ERROR:', err.response?.status, err.response?.data || err.message);
  }
})();
