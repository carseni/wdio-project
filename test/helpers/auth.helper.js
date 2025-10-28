const axios = require('axios');

const baseURL = 'http://localhost:3001/api';

async function registerUser() {
  const unique = Date.now();
  const email = `auto_${unique}@mail.com`;
  const password = 'password123';
  const username = `user_${unique}`;

  const response = await axios.post(`${baseURL}/users`, {
    user: { username, email, password },
  });

  return { email, password, token: response.data.user.token };
}

async function loginUser(email, password) {
  const response = await axios.post(`${baseURL}/users/login`, {
    user: { email, password },
  });

  return response.data.user.token;
}

async function getAuthToken() {
  const { email, password } = await registerUser();
  return await loginUser(email, password);
}

// ✅ CommonJS export — MUST be at the very end
module.exports = { registerUser, loginUser, getAuthToken };
