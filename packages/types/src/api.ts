/**
 * Authentication API Types
 */



export interface SignupRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface BusinessSignupRequest {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website: string;
  businessType: string;
  location: string;
  phone: string;
  consent: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    role: 'user' | 'business';
    displayName?: string;
    businessName?: string;
    phoneNumber?: string;
  };
  token: string;
}

export interface PhoneVerifyRequest {
  phoneNumber: string;
}

export interface PhoneConfirmRequest {
  verificationId: string;
  verificationCode: string;
}

/**
 * Booking API Types
 */
export interface CreateBookingRequest {
  userId: string;
  classId: string;
}

export interface CancelBookingRequest {
  bookingId: string;
}

export interface ConfirmPaymentRequest {
  bookingId: string;
  paymentMethod: string;
}

/**
 * Studio API Types
 */
export interface CreateStudioRequest {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  description: string;
  photos?: string[];
  healthSafetyInfo?: string;
}

export interface UpdateStudioRequest {
  studioId: string;
  name?: string;
  location?: {
    lat: number;
    lng: number;
  };
  address?: string;
  description?: string;
  photos?: string[];
  healthSafetyInfo?: string;
}

export interface StudioStatsResponse {
  bookingsCount: number;
  revenue: number;
  classesCount: number;
  popularClasses: Array<{
    id: string;
    name: string;
    bookings: number;
  }>;
}

/**
 * Class API Types
 */
export interface CreateClassRequest {
  studioId: string;
  name: string;
  description: string;
  instructor: string;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  tags?: string[];
}

export interface UpdateClassRequest {
  classId: string;
  name?: string;
  description?: string;
  instructor?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  price?: number;
  tags?: string[];
}

/**
 * User API Types
 */
export interface UpdateUserRequest {
  displayName?: string;
  profilePic?: string;
  businessName?: string;
  contactInfo?: {
    phone?: string;
    address?: string;
  };
}

/**
 * Feedback API Types
 */
export interface SubmitFeedbackRequest {
  content: string;
  rating: number;
}

/**
 * Analytics API Types
 */
export interface StudioStats {
  totalBookings: number;
  revenue: number;
  totalClasses: number;
  averageRating: number;
  popularClasses: Array<{
    id: string;
    name: string;
    bookings: number;
  }>;
  recentBookings: Array<{
    id: string;
    userId: string;
    classId: string;
    className: string;
    status: string;
    createdAt: string;
  }>;
} 