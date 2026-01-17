import axios from 'axios';
import type {
  LoginData,
  LoginResponse,
  RegisterClientData,
  RegisterContractorData,
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
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login/', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout/');
  },

  registerClient: async (data: RegisterClientData): Promise<any> => {
    const response = await apiClient.post('/auth/register/client/', data);
    return response.data;
  },

  registerContractor: async (data: FormData): Promise<any> => {
    const response = await apiClient.post('/auth/register/contractor/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  passwordReset: async (email: string): Promise<void> => {
    await apiClient.post('/auth/password-reset/', { email });
  },
};

// Service Categories APIs
export const categoriesAPI = {
  getAll: async (): Promise<ServiceCategory[]> => {
    const response = await apiClient.get<ServiceCategory[]>('/categories/');
    return response.data;
  },

  getById: async (id: number): Promise<ServiceCategory> => {
    const response = await apiClient.get<ServiceCategory>(`/categories/${id}/`);
    return response.data;
  },
};

// Service Requests APIs
export const serviceRequestsAPI = {
  create: async (data: Partial<ServiceRequest>): Promise<ServiceRequest> => {
    const response = await apiClient.post<ServiceRequest>('/service-requests/', data);
    return response.data;
  },

  getAll: async (): Promise<ServiceRequest[]> => {
    const response = await apiClient.get<ServiceRequest[]>('/service-requests/');
    return response.data;
  },

  getById: async (id: number): Promise<ServiceRequest> => {
    const response = await apiClient.get<ServiceRequest>(`/service-requests/${id}/`);
    return response.data;
  },

  confirmPayment: async (id: number): Promise<ServiceRequest> => {
    const response = await apiClient.post<ServiceRequest>(`/service-requests/${id}/confirm-payment/`);
    return response.data;
  },

  confirmCompletion: async (id: number): Promise<ServiceRequest> => {
    const response = await apiClient.post<ServiceRequest>(`/service-requests/${id}/confirm-completion/`);
    return response.data;
  },

  cancel: async (id: number): Promise<void> => {
    await apiClient.post(`/service-requests/${id}/cancel/`);
  },
};

// Contractors APIs
export const contractorsAPI = {
  getAll: async (): Promise<ContractorProfile[]> => {
    const response = await apiClient.get<ContractorProfile[]>('/contractors/');
    return response.data;
  },

  getById: async (id: number): Promise<ContractorProfile> => {
    const response = await apiClient.get<ContractorProfile>(`/contractors/${id}/`);
    return response.data;
  },

  getMe: async (): Promise<ContractorProfile> => {
    const response = await apiClient.get<ContractorProfile>('/contractors/me/');
    return response.data;
  },

  updateAvailability: async (is_available: boolean): Promise<void> => {
    await apiClient.patch('/contractors/update_availability/', { is_available });
  },

  getVerificationStatus: async (): Promise<any> => {
    const response = await apiClient.get('/contractors/verification_status/');
    return response.data;
  },
};

// Assignments APIs
export const assignmentsAPI = {
  getPending: async (): Promise<Assignment[]> => {
    const response = await apiClient.get<Assignment[]>('/assignments/pending/');
    return response.data;
  },

  accept: async (assignmentId: number): Promise<Assignment> => {
    const response = await apiClient.post<Assignment>('/assignments/accept/', { assignment_id: assignmentId });
    return response.data;
  },

  decline: async (assignmentId: number): Promise<void> => {
    await apiClient.post('/assignments/decline/', { assignment_id: assignmentId });
  },

  start: async (assignmentId: number): Promise<Assignment> => {
    const response = await apiClient.post<Assignment>(`/assignments/${assignmentId}/start/`);
    return response.data;
  },

  complete: async (assignmentId: number, notes: string): Promise<Assignment> => {
    const response = await apiClient.post<Assignment>('/assignments/complete/', {
      assignment_id: assignmentId,
      completion_notes: notes,
    });
    return response.data;
  },
};

// Wallet APIs
export const walletAPI = {
  getBalance: async (): Promise<WalletBalance> => {
    const response = await apiClient.get<WalletBalance>('/wallet/balance/');
    return response.data;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/wallet/transactions/');
    return response.data;
  },

  depositMpesa: async (amount: number, phone: string): Promise<any> => {
    const response = await apiClient.post('/wallet/deposit/mpesa/', { amount, phone_number: phone });
    return response.data;
  },

  withdrawMpesa: async (amount: number, phone: string): Promise<any> => {
    const response = await apiClient.post('/wallet/withdraw/mpesa/', { amount, phone_number: phone });
    return response.data;
  },

  payDeposit: async (serviceRequestId: number): Promise<any> => {
    const response = await apiClient.post('/wallet/pay-deposit/', { service_request_id: serviceRequestId });
    return response.data;
  },

  getEscrow: async (): Promise<Transaction[]> => {
    const response = await apiClient.get<Transaction[]>('/wallet/escrow/');
    return response.data;
  },
};

// Reviews APIs
export const reviewsAPI = {
  create: async (data: Partial<Review>): Promise<Review> => {
    const response = await apiClient.post<Review>('/reviews/', data);
    return response.data;
  },

  getAll: async (): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>('/reviews/');
    return response.data;
  },

  getContractorReviews: async (contractorId: number): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>(`/reviews/contractor/${contractorId}/`);
    return response.data;
  },
};

export default apiClient;
