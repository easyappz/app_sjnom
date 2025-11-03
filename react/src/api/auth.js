import instance from './axios';

export async function register({ username, password }) {
  try {
    const res = await instance.post('/api/auth/register/', { username, password });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function login({ username, password }) {
  try {
    const res = await instance.post('/api/auth/login/', { username, password });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function me() {
  try {
    const res = await instance.get('/api/auth/me/');
    return res.data;
  } catch (error) {
    throw error;
  }
}
