import axios from 'axios';

const baseURL = 'http://localhost:3001/api';

/**
 * Register a user, or log in if already exists.
 * Retries transient failures with exponential backoff.
 */
export async function registerOrLogin(email, password, attempts = 5) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const resp = await axios.post(`${baseURL}/users`, {
        user: { username: `bdduser_${Date.now()}`, email, password },
      });
      return resp.data.user;
    } catch (err) {
      const status = err.response?.status;
      if (status === 422 || status === 409) {
        try {
          const loginResp = await axios.post(`${baseURL}/users/login`, { user: { email, password } });
          return loginResp.data.user;
        } catch (loginErr) {
          console.warn(`Login after existing-email failed (attempt ${i}):`, loginErr.message);
        }
      }
      if (i < attempts) {
        const delay = 500 * i;
        console.warn(`Register attempt ${i} failed (${err.message}). Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      err.message = `registerOrLogin failed after ${attempts} attempts: ${err.message}`;
      throw err;
    }
  }
}
