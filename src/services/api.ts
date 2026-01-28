import axios from 'axios';
import type {
  LoginData,
  LoginResponse,
  RegisterClientData,
  ServiceCategory,
  ServiceRequest,
  ContractorProfile,
  WalletBalance,
  Transaction,
  Assignment,
  Review,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Changed from 'access_token' to 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - simplified for PHP backend
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login.php', data);
    // Store token from PHP backend
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async (): Promise<void> => {
    // PHP backend doesn't need logout endpoint, just clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  registerClient: async (data: RegisterClientData): Promise<any> => {
    const response = await apiClient.post('/auth/register.php', {
      ...data,
      role: 'client'
    });
    // Store token from registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  registerContractor: async (data: FormData): Promise<any> => {
    // Convert FormData to JSON for PHP backend
    const jsonData: any = {
      role: 'contractor'
    };
    
    data.forEach((value, key) => {
      jsonData[key] = value;
    });

    const response = await apiClient.post('/auth/register.php', jsonData);
    
    // Store token from registration
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  passwordReset: async (email: string): Promise<void> => {
    // Not implemented in PHP backend yet
    throw new Error('Password reset not implemented');
  },
};

// Service Categories APIs
export const categoriesAPI = {
  getAll: async (): Promise<ServiceCategory[]> => {
    const response = await apiClient.get('/categories/list.php');
    return response.data.categories || [];
  },

  getById: async (id: number): Promise<ServiceCategory> => {
    const response = await apiClient.get(`/categories/list.php?id=${id}`);
    return response.data;
  },
};

// Service Requests APIs
export const serviceRequestsAPI = {
  create: async (data: Partial<ServiceRequest>): Promise<ServiceRequest> => {
    const response = await apiClient.post<ServiceRequest>('/requests/create.php', data);
    return response.data;
  },

  getAll: async (): Promise<ServiceRequest[]> => {
    const response = await apiClient.get('/requests/list.php');
    return response.data.requests || [];
  },

  getById: async (id: number): Promise<ServiceRequest> => {
    const response = await apiClient.get(`/requests/list.php?id=${id}`);
    return response.data;
  },

  confirmPayment: async (id: number): Promise<ServiceRequest> => {
    // Not implemented in current PHP backend
    throw new Error('Payment confirmation not implemented');
  },

  confirmCompletion: async (id: number): Promise<ServiceRequest> => {
    // Not implemented in current PHP backend
    throw new Error('Completion confirmation not implemented');
  },

  cancel: async (id: number): Promise<void> => {
    // Not implemented in current PHP backend
    throw new Error('Cancel not implemented');
  },
};

// Contractors APIs
export const contractorsAPI = {
  getAll: async (): Promise<ContractorProfile[]> => {
    const response = await apiClient.get('/contractors/list.php');
    return response.data.contractors || [];
  },

  getById: async (id: number): Promise<ContractorProfile> => {
    const response = await apiClient.get(`/contractors/profile.php?id=${id}`);
    return response.data;
  },

  getMe: async (): Promise<ContractorProfile> => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const response = await apiClient.get(`/contractors/profile.php?id=${user.id}`);
    return response.data;
  },

  updateAvailability: async (is_available: boolean): Promise<void> => {
    // Not implemented in current PHP backend
    throw new Error('Update availability not implemented');
  },

  getVerificationStatus: async (): Promise<any> => {
    // Not implemented in current PHP backend
    throw new Error('Verification status not implemented');
  },
};

// Assignments APIs - Not implemented in PHP backend
export const assignmentsAPI = {
  getPending: async (): Promise<Assignment[]> => {
    const response = await apiClient.get('/requests/list.php');
    return response.data.requests || [];
  },

  accept: async (assignmentId: number): Promise<Assignment> => {
    const response = await apiClient.post('/requests/respond.php', {
      request_id: assignmentId,
      action: 'accept'
    });
    return response.data;
  },

  decline: async (assignmentId: number): Promise<void> => {
    await apiClient.post('/requests/respond.php', {
      request_id: assignmentId,
      action: 'reject'
    });
  },

  start: async (assignmentId: number): Promise<Assignment> => {
    throw new Error('Start assignment not implemented');
  },

  complete: async (assignmentId: number, notes: string): Promise<Assignment> => {
    throw new Error('Complete assignment not implemented');
  },
};

// Wallet APIs - Not implemented in PHP backend
export const walletAPI = {
  getBalance: async (): Promise<WalletBalance> => {
    throw new Error('Wallet not implemented');
  },

  getTransactions: async (): Promise<Transaction[]> => {
    throw new Error('Transactions not implemented');
  },

  depositMpesa: async (amount: number, phone: string): Promise<any> => {
    throw new Error('M-Pesa deposit not implemented');
  },

  withdrawMpesa: async (amount: number, phone: string): Promise<any> => {
    throw new Error('M-Pesa withdraw not implemented');
  },

  payDeposit: async (serviceRequestId: number): Promise<any> => {
    throw new Error('Pay deposit not implemented');
  },

  getEscrow: async (): Promise<Transaction[]> => {
    throw new Error('Escrow not implemented');
  },
};

// Reviews APIs - Not implemented in PHP backend
export const reviewsAPI = {
  create: async (data: Partial<Review>): Promise<Review> => {
    throw new Error('Reviews not implemented');
  },

  getAll: async (): Promise<Review[]> => {
    return [];
  },

  getContractorReviews: async (contractorId: number): Promise<Review[]> => {
    return [];
  },
};

export default apiClient;
