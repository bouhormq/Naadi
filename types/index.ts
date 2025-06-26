// import { PhoneInfo } from './firestoreTypes'; // Assuming PhoneInfo is here or imported differently 
// Remove Timestamp import
// import { Timestamp } from 'firebase/firestore'; 


// Combined Types

// --- Interfaces from firestore.ts ---

/**
 * Represents the phone number details.
 */
export interface PhoneInfo {
  code: string; // e.g., "MA"
  name: string; // e.g., "Morocco"
  number: string; // The raw phone number part (e.g., "612345678")
  dialCode: string; // e.g., "+212"
}

/**
 * User document in Firestore
 */
export interface User {
  uid: string;
  email: string;
  role: 'user' | 'partner';
  profilePic?: string;
  photoURL?: string;
  phone: PhoneInfo; 
  authMethod?: 'email' | 'google' | 'facebook' | 'apple';
  lastLoginAt?: Date; 
  firstName: string;
  lastName: string;
  agreeToMarketing: boolean;
  createdAt: Date; 
}

/**
 * Studio document in Firestore
 */
export interface Studio {
  id?: string;
  businessId: string; // Link to PartnerAccount or User?
  name: string;
  location: { // Consider using GeoPoint for Firestore geoqueries
    lat: number;
    lng: number;
  };
  address: string;
  description: string;
  photos: string[]; // URLs to images in storage
  healthSafetyInfo: string;
  createdAt: Date; // Use standard Date
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
  startTime: Date; // Use standard Date/Timestamp
  endTime: Date; // Use standard Date/Timestamp
  capacity: number;
  price: number;
  tags: string[];
  createdAt: Date; // Use standard Date
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
  createdAt: Date; // Use standard Date
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
  createdAt: Date; // Use standard Date
}

/**
 * Signup code document in Firestore (If still used for partner registration)
 */
export interface SignupCode {
  id?: string; // Document ID
  code: string; // The actual code
  isUsed: boolean;
  usedBy?: string; // UID of the user who used it
  createdAt: Date; // Use standard Date
}

/**
 * Data structure for the Partner Contact Form submission.
 */
export interface BusinessContactFormData {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website?: string; // Optional website
  businessType: string;
  location: string;
  phone: PhoneInfo; // Reusing PhoneInfo
  message: string; // Specific message from the contact form
  consent: boolean;
}

// --- Interfaces from api.ts ---

/**
 * Request body for user signup.
 */
export interface SignupRequest {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Data structure for Partner Signup Request (before approval).
 * Stored in PartnerRegistrationRequest collection.
 */
export interface PartnerSignupRequest {
  id?: string; // Document ID in PartnerRegistrationRequest
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website?: string; // Optional
  businessType: string;
  location: string;
  phone: PhoneInfo; // Reusing PhoneInfo
  consent: boolean;
  approved?: boolean; // Status of the request
  createdAt?: Date; // Firestore timestamp added by server
}

/**
 * Request body for user login.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Example structure for an authentication response.
 * Adjust based on actual auth flow needs.
 */
export interface AuthResponse {
  user: {
    uid: string;
    email: string;
    role: 'user' | 'partner' | 'admin'; // Include admin role
    displayName?: string;
    // Add other relevant user details needed after login
  };
  token: string; // Firebase ID token or custom token
}

/**
 * Request for sending a phone verification code.
 */
export interface PhoneVerifyRequest {
  phoneNumber: string; // E.164 format recommended
}

/**
 * Request for confirming a phone verification code.
 */
export interface PhoneConfirmRequest {
  verificationId: string; // ID received from the verification request
  verificationCode: string; // Code entered by the user
}


// --- Interfaces related to Partner/Admin Operations ---

/**
 * Represents the Business information associated with a Partner Account.
 * Stored in a separate 'businesses' collection.
 */
export interface Business {
  id?: string; 
  ownerUid: string; 
  name: string;
  address: { 
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phone: PhoneInfo; 
  website?: string; 
  description?: string;
  category: string; 
  createdAt?: Date; // Use standard Date
  updatedAt?: Date; // Use standard Date
}

/**
 * Represents the Partner Account document in Firestore (PartnerAccounts collection).
 * This is created after an admin approves a PartnerSignupRequest.
 */
export interface PartnerAccount {
  id: string; // Corresponds to the original requestId initially
  uid?: string; // Firebase Auth UID, added after registration completion
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website?: string;
  businessType: string;
  location: string;
  phone: PhoneInfo; // Reusing PhoneInfo
  consent: boolean;
  status: 'enabled' | 'disabled';
  registrationCode?: string; // Temporary code for initial signup, removed after use
  approvedAt: Date; // Timestamp when admin approved the request - Keep as Date?
  createdAt: Date; // Timestamp when the original request was created - Keep as Date?
  registeredAt?: Date; // Timestamp when the partner completed registration (set password) - Keep as Date?
  businessId?: string; // ID linking to the Business document in the 'businesses' collection
}

/**
 * Payload for the admin function to approve a partner request.
 */
export interface ApprovePartnerPayload {
  requestId: string; // ID of the document in PartnerRegistrationRequest
}

/**
 * Payload for the admin function to toggle a partner's status.
 */
export interface TogglePartnerStatusPayload {
  accountId: string; // ID of the document in PartnerAccounts
}


// --- Other potential API interfaces (Examples from api.ts, refine as needed) ---

export interface CreateBookingRequest {
  userId: string;
  classId: string;
}

export interface CancelBookingRequest {
  bookingId: string;
}

export interface ConfirmPaymentRequest {
  bookingId: string;
  paymentMethod: string; // Details might be more complex
}

export interface CreateStudioRequest {
  name: string;
  location: { lat: number; lng: number; };
  address: string;
  description: string;
  photos?: string[];
  healthSafetyInfo?: string;
}

export interface UpdateStudioRequest {
  studioId: string;
  // Include fields from CreateStudioRequest marked as optional
  name?: string;
  location?: { lat: number; lng: number; };
  address?: string;
  description?: string;
  photos?: string[];
  healthSafetyInfo?: string;
}

export interface StudioStatsResponse {
  bookingsCount: number;
  revenue: number; // Consider currency/formatting
  classesCount: number;
  popularClasses: Array<{ id: string; name: string; bookings: number; }>;
}

export interface CreateClassRequest {
  studioId: string;
  name: string;
  description: string;
  instructor: string;
  startTime: string; // Consider ISO string format or Date
  endTime: string; // Consider ISO string format or Date
  capacity: number;
  price: number; // Consider currency/cents
  tags?: string[];
}

export interface UpdateClassRequest {
  classId: string;
  // Include fields from CreateClassRequest marked as optional
  name?: string;
  description?: string;
  instructor?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  price?: number;
  tags?: string[];
}

export interface UpdateUserRequest {
  displayName?: string;
  profilePic?: string; // URL?
  // Add other editable fields
}

export interface SubmitFeedbackRequest {
  content: string;
  rating: number; // e.g., 1-5
  // Associate with booking/class/studio?
}

// Example, refine based on actual analytics needs
export interface StudioAnalyticsData {
  totalBookings: number;
  revenue: number;
  totalClasses: number;
  averageRating: number;
  popularClasses: Array<{ id: string; name: string; bookings: number; }>;
  recentBookings: Array<{
    id: string;
    userId: string;
    classId: string;
    className: string;
    status: string; // Consider Booking status enum
    createdAt: string; // Consider ISO string format or Date
  }>;
} 