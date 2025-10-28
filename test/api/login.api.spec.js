const axios = require('axios');

describe('API - Login', () => {
  const baseURL = 'http://localhost:3001/api';
  const validEmail = `test_${Date.now()}@mail.com`;
  const password = 'password123';

before(async () => {
    // create a new user first (so login can succeed)
    await axios.post(`${baseURL}/users`, {
      user: {
        username: `loginuser_${Date.now()}`,
        email: validEmail,
        password: password,
      },
    });
  });

  it('should log in successfully with valid credentials', async () => {
    const response = await axios.post(`${baseURL}/users/login`, {
      user: {
        email: validEmail,
        password: password,
      },
    });

    console.log('Login success:', response.status, response.data);
    expect(response.status).toBe(200);
    expect(response.data.user).toHaveProperty('token');
    expect(response.data.user.email).toBe(validEmail);
  });

  it('should fail to log in with wrong password', async () => {
    try {
      await axios.post(`${baseURL}/users/login`, {
        user: {
          email: validEmail,
          password: 'wrongpassword',
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.errors['email or password'][0]).toContain('is invalid');
    }
  });

  it('should fail to log in with invalid email format', async () => {
    try {
      await axios.post(`${baseURL}/users/login`, {
        user: {
          email: 'invalid_email_format',
          password: password,
        },
      });
    } catch (error) {
      expect(error.response.status).toBe(403);
    }
  });
});
