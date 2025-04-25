// No need to import admin here if we use Date
import { PhoneInfo } from './firestore'; // Correct: PhoneInfo is exported from firestore.ts

// Export all types
export * from './firestore';
export * from './api';

export interface PartnerAccount {
  id: string; // Corresponds to the original requestId initially
  uid?: string; // Firebase Auth UID, added after registration code is used
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website?: string;
  businessType: string;
  location: string;
  phone: PhoneInfo; // Now correctly references imported type
  consent: boolean;
  status: 'enabled' | 'disabled';
  registrationCode?: string; // Generated code for initial signup
  approvedAt: Date; // Use standard Date type for shared interface
  createdAt: Date; // Use standard Date type for shared interface
  registeredAt?: Date; // Added: Timestamp for when the partner completes registration
}

// Optional: Type for the data sent to approve function
export interface ApprovePartnerPayload {
  requestId: string;
}

// Optional: Type for the data sent to toggle status function
export interface TogglePartnerStatusPayload {
  accountId: string; // ID of the document in PartnerAccounts
} 