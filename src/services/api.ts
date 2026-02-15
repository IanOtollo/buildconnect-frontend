import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

const getErrorMessage = (error: any) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message;
};

export const authAPI = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  registerClient: (data: any) => api.post('/auth/register', { ...data, role: 'client' }),
  registerContractor: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string | number) => api.get(`/categories/${id}`),
};

export const serviceRequestsAPI = {
  getAll: () => api.get('/service-requests'),
  getById: (id: string | number) => api.get(`/service-requests/${id}`),
  create: (data: any) => api.post('/service-requests', data),
};

export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getTransactions: () => api.get('/wallet/transactions'),
  deposit: (data: any) => api.post('/wallet/deposit', data),
};

export const contractorsAPI = {
  getMe: () => api.get('/contractors/me'),
  updateAvailability: (is_available: boolean) => api.patch('/contractors/me', { is_available }),
};

export const assignmentsAPI = {
  getPending: () => api.get('/assignments/pending'),
  accept: (id: number) => api.post(`/assignments/${id}/accept`),
  decline: (id: number) => api.post(`/assignments/${id}/decline`),
};

export const aiAPI = {
  getEstimate: (data: { description: string; location: string }) =>
    api.post('/ai/estimate', data),
};

export const paymentsAPI = {
  initiateSTKPush: (data: { phone: string; amount: number; description: string }) =>
    api.post('/payments/stkpush', data),
};

export { api, getErrorMessage };
