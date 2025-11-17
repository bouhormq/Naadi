import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK ONCE, **before** other imports that use it.
if (!admin.apps.length) {
  admin.initializeApp();
}

import { HttpsError } from 'firebase-functions/v1/https';
import { randomBytes } from 'crypto'; // For generating random code
import { PartnerSignupRequest } from "../../../types"; // Using relative path
import { PartnerAccount } from "../../../types"; // Using relative path
import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";

// Import functions from other files
import * as businessFunctions from './business';

const db = admin.firestore();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bouhormq@gmail.com"; // Use environment variable with fallback
const PARTNER_REGISTRATION_REQUEST_COLLECTION = "PartnerRegistrationRequest";
const PARTNER_CONTACT_REQUEST_COLLECTION = "PartnerContactRequest"; // Added constant
const PARTNER_ACCOUNTS_COLLECTION = "PartnerAccounts";
const TARGET_REGION = "europe-southwest1"; // Set to europe-southwest1


// Define the interface for the PhoneInfo structure as expected from the frontend
interface PhoneInfo {
  code: string; // e.g., "MA"
  name: string; // e.g., "Morocco"
  number: string; // The raw phone number part (e.g., "612345678")
  dialCode: string; // e.g., "+212"
}

// Define the interface for the partner registration request
interface RegistrationRequest {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website: string; // Assuming this is optional based on frontend, but required here
  businessType: string;
  location: string;
  phone: PhoneInfo; // PhoneInfo object
  consent: boolean;
}

// Define interface for the partner contact request
interface ContactRequest {
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  website: string;
  businessType: string;
  location: string;
  phone: PhoneInfo;
  message: string; // Added message field
  consent: boolean;
}

// --- Export Business Profile Functions ---
// Remove export for the old function
// export const getMyBusinessProfile = businessFunctions.getMyBusinessProfile;

// Keep export for setMyBusinessProfile
export const setMyBusinessProfile = businessFunctions.setMyBusinessProfile;

// Add export for the new getMyBusinesses function
export const getMyBusinesses = businessFunctions.getMyBusinesses;

// --- NEW Callable Function v2: Partner Register Request ---
export const partnerRegisterRequest = onCall({ 
  // Deprecated: this folder has been moved to `api/functions`.
  //
  // To avoid confusion we keep a small note here. The real functions live in:
  //   /Users/salim/Desktop/Naadi/api/functions/src
  //
  // Please use `api/functions` from now on. This file is intentionally empty.