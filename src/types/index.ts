// User Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  is_contractor: boolean;
  is_client: boolean;
  is_active: boolean;
  date_joined: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
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
  hourly_rate: number;
  is_verified: boolean;
  verification_status: 'pending' | 'approved' | 'rejected' | 'under_review';
  is_available: boolean;
  rating: number;
  total_jobs_completed: number;
  profile_image?: string;
  location: string;
  skills: Skill[];
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
  is_active: boolean;
}

export interface ServiceRequest {
  id: number;
  client: number;
  category: ServiceCategory;
  title: string;
  description: string;
  location: string;
  budget: number;
  estimated_duration: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending_deposit' | 'pending_assignment' | 'assigned' | 'in_progress' | 'pending_completion' | 'completed' | 'cancelled';
  deposit_amount: number;
  deposit_paid: boolean;
  created_at: string;
  updated_at: string;
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
  daily_withdrawal_limit: number;
  remaining_daily_limit: number;
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
  professionalism_rating: number;
  quality_rating: number;
  timeliness_rating: number;
  communication_rating: number;
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
  years_of_experience: number;
  hourly_rate: number;
  location: string;
  id_document: File;
  kra_pin_document: File;
  work_permit_document?: File;
}

export interface LoginData {
  email: string;
  password: string;
}
