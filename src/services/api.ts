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

// Group all auth-related API calls here
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),

  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role?: 'client' | 'contractor' 
  }) => api.post('/auth/register', userData),

  logout: () => api.post('/auth/logout'),

  refreshToken: () => api.post('/auth/refresh'),

  // Add more auth endpoints as needed (e.g., forgotPassword, verifyEmail, etc.)
};

export { api, getErrorMessage };
