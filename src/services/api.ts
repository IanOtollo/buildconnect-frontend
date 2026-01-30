import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message;
};

// ── Add this block ────────────────────────────────────────────────
export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),

  logout: () => 
    api.post('/auth/logout'),

  // Optional: If your backend has these, add them later
  // register: (data) => api.post('/auth/register', data),
  // refresh: () => api.post('/auth/refresh'),
  // me: () => api.get('/auth/me'),   // to fetch current user on load
};
// ───────────────────────────────────────────────────────────────────

export { api, getErrorMessage };
