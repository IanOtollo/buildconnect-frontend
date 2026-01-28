// User Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: 'client' | 'contractor' | 'admin';
  is_contractor?: boolean;
  is_client?: boolean;
  is_active?: boolean;
  date_joined?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface ClientProfile extends User {
  address?: string;
  city?: string;
  profile_image?: string;
}

export interface ContractorProfile extends User {
  business_name: string;
  bio: string;
  years_of_experience: number;
  hourly_rate?: number;
  is_verified?: boolean;
  verification_status?: 'pending' | 'approved' | 'rejected' | 'under_review';
  is_available: boolean;
  rating?: number;
  total_jobs_completed?: number;
  profile_image?: string;
  location: string;
  category: string;
  skills?: Skill[];
  status?: 'pending' | 'approved' | 'rejected';
  completed_jobs?: number;
  portfolio?: PortfolioItem[];
}

export interface PortfolioItem {
  id: number;
  contractor_id: number;
  title: string;
  description: string;
  image_path: string;
  created_at: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon?: string;
  is_active?: boolean;
  contractor_count?: number;
  created_at?: string;
}

export interface ServiceRequest {
  id: number;
  client_id: number;
  contractor_id?: number;
  category: string;
  title: string;
  description: string;
  location: string;
  budget?: number;
  estimated_duration?: string;
  urgency?: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  deposit_amount?: number;
  deposit_paid?: boolean;
  file_path?: string;
  created_at: string;
  updated_at: string;
  // Additional fields from PHP backend
  client_name?: string;
  client_phone?: string;
  client_email?: string;
  contractor_name?: string;
  contractor_phone?: string;
  contractor_email?: string;
  business_name?: string;
}

export interface Assignment {
  id: number;
  service_request: ServiceRequest;
  contractor: ContractorProfile;
  status: 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed';
  assigned_at: string;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  completion_notes?: string;
}

export interface WalletBalance {
  available_balance: number;
  locked_balance: number;
  total_balance: number;
  daily_withdrawal_limit?: number;
  remaining_daily_limit?: number;
}

export interface Transaction {
  id: number;
  transaction_type: 'deposit' | 'withdrawal' | 'escrow_lock' | 'escrow_release' | 'refund' | 'platform_fee' | 'commission';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
  reference_number?: string;
}

export interface Review {
  id: number;
  service_request: number;
  contractor: number;
  client: number;
  rating: number;
  professionalism_rating?: number;
  quality_rating?: number;
  timeliness_rating?: number;
  communication_rating?: number;
  comment: string;
  created_at: string;
}

export interface RegisterClientData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  address?: string;
  city?: string;
}

export interface RegisterContractorData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  business_name: string;
  bio: string;
  category: string;
  location: string;
  years_of_experience: number;
  hourly_rate?: number;
  id_document?: File;
  kra_pin_document?: File;
  work_permit_document?: File;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
