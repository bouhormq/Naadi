/**
 * User document in Firestore
 */
export interface User {
  id?: string;
  uid: string;
  email: string;
  role: 'user' | 'partner';
  displayName?: string;
  profilePic?: string;
  photoURL?: string;
  phoneNumber?: string;
  businessName?: string;
  contactInfo?: {
    phone: string;
    address: string;
  };
  authMethod?: 'email' | 'phone' | 'google' | 'facebook' | 'apple';
  createdAt: string;
  lastLoginAt?: string;
}

/**
 * Studio document in Firestore
 */
export interface Studio {
  id?: string;
  businessId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  description: string;
  photos: string[];
  healthSafetyInfo: string;
  createdAt: string;
}

/**
 * Class document in Firestore
 */
export interface Class {
  id?: string;
  studioId: string;
  name: string;
  description: string;
  instructor: string;
  startTime: string;
  endTime: string;
  capacity: number;
  price: number;
  tags: string[];
  createdAt: string;
}

/**
 * Booking document in Firestore
 */
export interface Booking {
  id?: string;
  userId: string;
  classId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

/**
 * Feedback document in Firestore
 */
export interface Feedback {
  id?: string;
  userId: string;
  classId: string;
  studioId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/**
 * Signup code document in Firestore
 */
export interface SignupCode {
  id?: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  createdAt: string;
} 

export interface BusinessContactFormData {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website: string;
  businessType: string; // Assuming this might still be relevant for a partner contact
  location: string;
  phone: string;
  message: string; // Added message field
  consent: boolean;
}