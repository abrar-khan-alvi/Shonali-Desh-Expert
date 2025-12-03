export interface Expert {
  id: string;
  name: string;
  email: string;
  role: 'expert';
  avatarUrl: string;
  specialization: string;
  isOnline: boolean;
}

export interface ConsultationRequest {
  id: string;
  farmerName: string;
  problem: string;
  location: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
}

export interface HistoryItem {
  id: string;
  date: string;
  farmerName: string;
  topic: string;
  earnings: number;
  rating: number;
}

export interface PerformanceMetrics {
  totalEarnings: number;
  completedConsultations: number;
  averageRating: number;
}

export type TabValue = 'profile' | 'payment' | 'security';

// Interface matching the user's Firebase structure
export interface ExpertData {
  id: string;
  name: string;
  email: string;
  password?: string;
  bio?: string;
  currentAffiliation?: string;
  educationalQualification?: string;
  paymentPerReport?: number;
  hasAvailable?: boolean;
  areasOfSpecialization?: any;
  consultRequests?: any;
  credentials?: any;
  locationInfo?: any;
  metadata?: any;
  profilePhotoUrl?: string;
}