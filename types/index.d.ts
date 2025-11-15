/**
 * Represents the phone number details.
 */
export interface PhoneInfo {
    code: string;
    name: string;
    number: string;
    dialCode: string;
}
/**
 * User document in Firestore
 */
export interface User {
    uid: string;
    email: string;
    role: 'user' | 'partner' | 'admin';
    profilePic?: string;
    photoURL?: string;
    phone: PhoneInfo;
    authMethod?: 'email' | 'google' | 'facebook' | 'apple';
    lastLoginAt?: Date;
    firstName: string;
    lastName: string;
    agreeToMarketing: boolean;
    createdAt: Date;
    favorites?: string[];
    gender?: 'male' | 'female';
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
    createdAt: Date;
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
    startTime: Date;
    endTime: Date;
    capacity: number;
    price: number;
    tags: string[];
    createdAt: Date;
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
    createdAt: Date;
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
    createdAt: Date;
}
/**
 * Signup code document in Firestore (If still used for partner registration)
 */
export interface SignupCode {
    id?: string;
    code: string;
    isUsed: boolean;
    usedBy?: string;
    createdAt: Date;
}
/**
 * Data structure for the Partner Contact Form submission.
 */
export interface BusinessContactFormData {
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    website?: string;
    businessType: string;
    location: string;
    phone: PhoneInfo;
    message: string;
    consent: boolean;
}
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
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    website?: string;
    businessType: string;
    location: string;
    phone: PhoneInfo;
    consent: boolean;
    approved?: boolean;
    createdAt?: Date;
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
        role: 'user' | 'partner' | 'admin';
        displayName?: string;
    };
    token: string;
}
/**
 * Request for sending a phone verification code.
 */
export interface PhoneVerifyRequest {
    phoneNumber: string;
}
/**
 * Request for confirming a phone verification code.
 */
export interface PhoneConfirmRequest {
    verificationId: string;
    verificationCode: string;
}
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
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Represents the Partner Account document in Firestore (PartnerAccounts collection).
 * This is created after an admin approves a PartnerSignupRequest.
 */
export interface PartnerAccount {
    id: string;
    uid?: string;
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    website?: string;
    businessType: string;
    location: string;
    phone: PhoneInfo;
    consent: boolean;
    status: 'enabled' | 'disabled';
    registrationCode?: string;
    approvedAt: Date;
    createdAt: Date;
    registeredAt?: Date;
    businessId?: string;
}
/**
 * Payload for the admin function to approve a partner request.
 */
export interface ApprovePartnerPayload {
    requestId: string;
}
/**
 * Payload for the admin function to toggle a partner's status.
 */
export interface TogglePartnerStatusPayload {
    accountId: string;
}
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
export interface UpdateUserRequest {
    displayName?: string;
    profilePic?: string;
}
export interface SubmitFeedbackRequest {
    content: string;
    rating: number;
}
export interface StudioAnalyticsData {
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
export interface Service {
    id: string;
    name: string;
    duration: string;
    price: string;
    category: string;
}
export interface ServiceCategory {
    name: string;
    items: Omit<Service, 'id' | 'category'>[];
}
export interface EstablishmentData {
    id: string;
    name: string;
    rating: number;
    numberReviews: number;
    reviews: any[];
    address: string;
    location: string;
    images: string[];
    coordinate: {
        latitude: number;
        longitude: number;
    };
    type: string;
    price: number;
    gender: string;
    services: ServiceCategory[];
    createdAt: string;
    updatedAt: string;
    cancellationPolicy?: string;
    about?: string;
    openingHours?: {
        monday?: string;
        tuesday?: string;
        wednesday?: string;
        thursday?: string;
        friday?: string;
        saturday?: string;
        sunday?: string;
    };
}
export interface PartnerContactFormData {
}
export interface Appointment {
    id: string;
    venue: string;
    date: string;
    time: string;
    duration: string;
    price: string;
    service: string;
    address: string;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    status?: 'Completed' | 'Cancelled' | 'Confirmed';
    bookingRef?: string;
}
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    image?: string;
    rating?: number;
    specialties: string[];
    bio?: string;
    experience?: string;
    venueId: string;
    serviceIds: string[];
    reviews: Review[];
    createdAt: string;
    updatedAt: string;
}
export interface Review {
    id: string;
    userId: string;
    userName: string;
    userInitials?: string;
    rating: number;
    comment: string;
    date: string;
    teamMemberId?: string;
    serviceId?: string;
}
//# sourceMappingURL=index.d.ts.map