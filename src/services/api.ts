import axios from 'axios';

const getBaseURL = () => {
  const url = process.env.REACT_APP_API_URL || '';
  return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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
  // Contractor: accept or reject a pending request
  respond: (requestId: number, action: 'accept' | 'reject') =>
    api.post('/requests/respond', { request_id: requestId, action }),
  // Contractor: mark midpoint or final completion
  updateProgress: (requestId: number, stage: 'midpoint' | 'final', notes?: string) =>
    api.post('/requests/progress', { request_id: requestId, stage, notes }),
  // Client: approve or decline a contractor progress update
  confirmProgress: (requestId: number, stage: 'midpoint' | 'final', action: 'approve' | 'decline', reason?: string) =>
    api.post('/requests/confirm', { request_id: requestId, stage, action, reason }),
};

export const walletAPI = {
  getBalance: () => api.get('/wallet/balance'),
  getTransactions: () => api.get('/wallet/transactions'),
  deposit: (data: any) => api.post('/wallet/deposit', data),
};

export const contractorsAPI = {
  getAll: () => api.get('/contractors'),
  getById: (id: string | number) => api.get(`/contractors/${id}`),
  getMe: () => api.get('/contractors/me'),
  updateAvailability: (is_available: boolean) => api.patch('/contractors/me', { is_available }),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications/get'),
  markRead: (id?: number) => api.post('/notifications/get', id ? { notification_id: id } : {}),
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
  // Pay 20% deposit to start work
  payDeposit: (data: { phone: string; amount: number; service_request_id: number }) =>
    api.post('/payments/stkpush', { ...data, payment_stage: 'deposit' }),
  // Pay 80% balance after midpoint is approved
  payBalance: (data: { phone: string; amount: number; service_request_id: number }) =>
    api.post('/payments/stkpush', { ...data, payment_stage: 'balance' }),
  // General wallet top-up (not tied to a service request)
  depositWallet: (data: { phone: string; amount: number; description?: string }) =>
    api.post('/wallet/deposit', data),
};

export { api, getErrorMessage };

