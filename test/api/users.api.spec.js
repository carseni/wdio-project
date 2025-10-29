import axios from 'axios';

describe('API - Users', () => {
  const baseURL = 'http://localhost:3001/api';

  it('should register a new user successfully', async () => {
    const response = await axios.post(`${baseURL}/users`, {
      user: {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@mail.com`,
        password: 'password123'
      }
    });

    expect(response.status).toBe(201);
    expect(response.data.user).toHaveProperty('token');
    expect(response.data.user).toHaveProperty('email');
  });

  it('should fail to register a user with an existing email', async () => {
    const existingEmail = 'existing@mail.com';
    try {
      await axios.post(`${baseURL}/users`, {
        user: {
          username: `duplicate_${Date.now()}`,
          email: existingEmail,
          password: 'password123'
        }
      });
    } catch (error) {
      expect(error.response.status).toBe(422);
      expect(error.response.data.errors.email[0]).toContain('has already been taken');
    }
  });
});