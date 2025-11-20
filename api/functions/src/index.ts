import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK ONCE, **before** other imports that use it.
if (!admin.apps.length) {
  admin.initializeApp();
}

import { HttpsError } from 'firebase-functions/v1/https';
import { randomBytes } from 'crypto'; // For generating random code
import { PartnerSignupRequest, PartnerAccount, OnboardingData } from "../../../types"; // Using relative path
import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";

// Import functions from other files
import * as businessFunctions from './business';

const db = admin.firestore();
const fetch = require('node-fetch');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "bouhormq@gmail.com"; // Use environment variable with fallback
const PARTNER_REGISTRATION_REQUEST_COLLECTION = "PartnerRegistrationRequest";
const PARTNER_CONTACT_REQUEST_COLLECTION = "PartnerContactRequest"; // Added constant
const PARTNER_ACCOUNTS_COLLECTION = "PartnerAccounts";
const TARGET_REGION = "europe-southwest1"; // Set to europe-southwest1
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";


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

// Export Client Sources functions
export const getClientSources = businessFunctions.getClientSources;
export const createClientSource = businessFunctions.createClientSource;
export const updateClientSource = businessFunctions.updateClientSource;
export const deleteClientSource = businessFunctions.deleteClientSource;

// Export Location functions
export const getLocations = businessFunctions.getLocations;
export const createLocation = businessFunctions.createLocation;
export const updateLocation = businessFunctions.updateLocation;
export const deleteLocation = businessFunctions.deleteLocation;

// --- Callable Function v2: Get Google Places Autocomplete Suggestions ---
export const getPlacesSuggestions = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  const payload = request.data || {};
  const input = typeof payload.input === 'string' ? payload.input.trim() : '';
  const sessionToken = typeof payload.sessionToken === 'string' ? payload.sessionToken : undefined;

  if (!input || input.length < 2) {
    logger.warn('getPlacesSuggestions called with invalid input', { input });
    throw new HttpsError('invalid-argument', 'Input must be at least 2 characters.');
  }

  if (!GOOGLE_PLACES_API_KEY) {
    logger.error('Google Places API key is not configured in environment variables.');
    throw new HttpsError('internal', 'Places API is not configured.');
  }

  try {
    // Call the new Places API (Autocomplete (New))
    const newEndpoint = 'https://places.googleapis.com/v1/places:autocomplete';

    // Build request body for the new API
    const body: any = { input };
    if (sessionToken) body.sessionToken = sessionToken;

    logger.info('Calling Places API (New) autocomplete endpoint', { url: newEndpoint, body: { input, sessionToken: Boolean(sessionToken) } });

    const response = await fetch(newEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // New API expects API key via header X-Goog-Api-Key
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    // Autocomplete (New) returns `suggestions` array (placePrediction or queryPrediction)
    const suggestions = Array.isArray(json.suggestions) ? json.suggestions : [];

    // Convert new suggestions shape to a legacy-like `predictions` array so frontend code stays compatible.
    const predictions = suggestions.map((s: any) => {
      if (s.placePrediction) {
        const p = s.placePrediction;
        const mainText = p.structuredFormat?.mainText?.text || p.text?.text || null;
        const secondaryText = p.structuredFormat?.secondaryText?.text || null;
        // derive place_id from place or placeId
        const placeId = p.placeId || (typeof p.place === 'string' ? p.place.split('/').pop() : null);
        return {
          description: p.text?.text || [mainText, secondaryText].filter(Boolean).join(', '),
          place_id: placeId,
          structured_formatting: {
            main_text: mainText,
            secondary_text: secondaryText,
          },
          terms: p.terms || [],
          types: p.types || [],
          // keep the raw placePrediction for potential future use
          _raw_placePrediction: p,
        };
      }
      if (s.queryPrediction) {
        const q = s.queryPrediction;
        return {
          description: q.text?.text || '',
          place_id: null,
          structured_formatting: {
            main_text: q.text?.text || '',
            secondary_text: null,
          },
          terms: q.terms || [],
          types: [],
          _raw_queryPrediction: q,
        };
      }
      return { description: JSON.stringify(s), place_id: null, structured_formatting: { main_text: null, secondary_text: null }, terms: [], types: [] };
    });

    // Log high-level response info for debugging
    logger.info('Places (New) response', { suggestionsCount: suggestions.length, httpStatus: response.status });

    // Return structured payload so client can inspect status and raw data
    return {
      success: true,
      status: response.ok ? 'OK' : `HTTP_${response.status}`,
      error_message: json.error?.message || json.error_message || null,
      predictions,
      raw: json,
    };
  } catch (error: any) {
    logger.error('Error calling Google Places API', error);
    throw new HttpsError('internal', 'Failed to fetch place suggestions.', String(error?.message || error));
  }
});

// --- Callable Function v2: Get Place Details (by placeId or address) ---
export const getPlaceDetails = onCall({
  region: TARGET_REGION,
  cors: true,
}, async (request) => {
  const payload = request.data || {};
  const placeId = typeof payload.placeId === 'string' ? payload.placeId : undefined;
  const address = typeof payload.address === 'string' ? payload.address.trim() : undefined;

  if (!placeId && !address) {
    throw new HttpsError('invalid-argument', 'placeId or address must be provided');
  }

  if (!GOOGLE_PLACES_API_KEY) {
    logger.error('Google Places API key is not configured in environment variables.');
    throw new HttpsError('internal', 'Places API is not configured.');
  }

  try {
    // Try to use Places (New) details by resource name if placeId looks like a resource (places/..)
    if (placeId) {
      // Accept either a full resource (places/...) or short place id (ChI...)
      const resource = placeId.startsWith('places/') ? placeId : `places/${placeId}`;
      // Use the Places (New) retrieve RPC endpoint: POST https://places.googleapis.com/v1/places:retrieve
      const retrieveUrl = 'https://places.googleapis.com/v1/places:retrieve';

      logger.info('Calling Places (New) retrieve RPC', { resource, retrieveUrl: retrieveUrl.replace(GOOGLE_PLACES_API_KEY, 'REDACTED') });
      const res = await fetch(retrieveUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          // Request only the fields we need
          'X-Goog-FieldMask': 'formatted_address,geometry',
        },
        body: JSON.stringify({ name: resource }),
      });

      const text = await res.text();
      let json: any = null;
      if (text && text.length > 0) {
        try {
          json = JSON.parse(text);
        } catch (parseErr) {
          logger.warn('Failed to parse JSON from Places retrieve RPC response', { parseErr: String(parseErr), snippet: text.slice(0, 200) });
          json = null;
        }
      } else {
        logger.info('Places retrieve RPC returned empty body', { httpStatus: res.status });
      }

      logger.info('Places retrieve RPC response', { httpStatus: res.status, hasJson: !!json });

      if (res.ok && json) {
        // New API may return fields in different shapes. Try common keys.
        const formatted_address = json.formatted_address || json.result?.formatted_address || json.address || null;
        const location = json.geometry?.location || json.result?.geometry?.location || null;
        return { success: true, address: formatted_address, location, raw: json };
      }
      // If not successful, fallthrough to geocode below
    }

    // Fallback: use Geocoding API by address
    if (address) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}`;
      logger.info('Calling Geocoding API', { url: geocodeUrl.replace(GOOGLE_PLACES_API_KEY, 'REDACTED') });
      const gres = await fetch(geocodeUrl);
      const gjson = await gres.json();
      logger.info('Geocoding response', { status: gjson.status, results: Array.isArray(gjson.results) ? gjson.results.length : 0 });

      if (gjson.status === 'OK' && gjson.results && gjson.results.length > 0) {
        const first = gjson.results[0];
        return {
          success: true,
          address: first.formatted_address || address,
          location: first.geometry && first.geometry.location ? first.geometry.location : null,
          raw: gjson,
        };
      }
      return { success: false, status: gjson.status, error_message: gjson.error_message || null, raw: gjson };
    }

    return { success: false, error_message: 'Could not retrieve place details' };
  } catch (error: any) {
    logger.error('Error in getPlaceDetails callable function', error);
    throw new HttpsError('internal', 'Failed to fetch place details.', String(error?.message || error));
  }
});

// --- NEW Callable Function v2: Partner Register Request ---
export const partnerRegisterRequest = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  const {
    email, firstName, lastName, businessName, website,
    businessType, location, phone, consent
  }: RegistrationRequest = request.data;

  // Validation
  if (
    !email || typeof email !== 'string' || email.trim() === '' ||
    !firstName || typeof firstName !== 'string' || firstName.trim() === '' ||
    !lastName || typeof lastName !== 'string' || lastName.trim() === '' ||
    !businessName || typeof businessName !== 'string' || businessName.trim() === '' ||
    !businessType || typeof businessType !== 'string' || businessType.trim() === '' ||
    !location || typeof location !== 'string' || location.trim() === '' ||
    typeof consent !== 'boolean' ||
    !phone || typeof phone !== 'object' ||
    !phone.number || typeof phone.number !== 'string' || phone.number.trim() === ''
  ) {
    logger.error("Validation failed: Missing or invalid fields in partnerRegisterRequest.", request.data);
    throw new HttpsError("invalid-argument", "Missing or invalid required fields.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.error("Validation failed: Invalid email format in partnerRegisterRequest.", email);
    throw new HttpsError("invalid-argument", "Invalid email format.");
  }

  try {
    const requestRef = db.collection(PARTNER_REGISTRATION_REQUEST_COLLECTION).doc();
    await requestRef.set({
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      businessName: businessName.trim(),
      website: website ? website.trim() : '',
      businessType: businessType.trim(),
      location: location.trim(),
      phone: {
        code: phone.code ? phone.code.trim() : '',
        name: phone.name ? phone.name.trim() : '',
        number: phone.number.trim(),
        dialCode: phone.dialCode ? phone.dialCode.trim() : '',
      },
      consent,
      approved: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info("Registration request submitted successfully via callable function for:", email);
    return { success: true, message: "Registration request submitted successfully" };

  } catch (error: any) {
    logger.error("Error in partnerRegisterRequest callable function:", error);
    throw new HttpsError("internal", "Failed to submit registration request.", error.message);
  }
});

// --- NEW Callable Function v2: Partner Contact Request ---
export const partnerContactRequest = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  const {
    email, firstName, lastName, businessName, website,
    businessType, location, phone, message, consent
  }: ContactRequest = request.data;

  // Validation
  if (
    !email || typeof email !== 'string' || email.trim() === '' ||
    !firstName || typeof firstName !== 'string' || firstName.trim() === '' ||
    !lastName || typeof lastName !== 'string' || lastName.trim() === '' ||
    !businessName || typeof businessName !== 'string' || businessName.trim() === '' ||
    !businessType || typeof businessType !== 'string' || businessType.trim() === '' ||
    !location || typeof location !== 'string' || location.trim() === '' ||
    !message || typeof message !== 'string' || message.trim() === '' ||
    typeof consent !== 'boolean' ||
    !phone || typeof phone !== 'object' ||
    !phone.number || typeof phone.number !== 'string' || phone.number.trim() === ''
  ) {
    logger.error("Validation failed: Missing or invalid fields in partnerContactRequest.", request.data);
    throw new HttpsError("invalid-argument", "Missing or invalid required fields.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.error("Validation failed: Invalid email format in partnerContactRequest.", email);
    throw new HttpsError("invalid-argument", "Invalid email format.");
  }

  try {
    const contactRef = db.collection(PARTNER_CONTACT_REQUEST_COLLECTION).doc();
    await contactRef.set({
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      businessName: businessName.trim(),
      website: website ? website.trim() : '',
      businessType: businessType.trim(),
      location: location.trim(),
      phone: {
        code: phone.code ? phone.code.trim() : '',
        name: phone.name ? phone.name.trim() : '',
        number: phone.number.trim(),
        dialCode: phone.dialCode ? phone.dialCode.trim() : '',
      },
      message: message.trim(),
      consent,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logger.info("Contact request submitted successfully via callable function for:", email);
    return { success: true, message: "Contact request submitted successfully" };

  } catch (error: any) {
    logger.error("Error in partnerContactRequest callable function:", error);
    throw new HttpsError("internal", "Failed to submit contact request.", error.message);
  }
});

// --- Helper Function ---
function generateRegistrationCode(length = 8): string {
  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
}

// --- Existing Callable Functions (Approve, Toggle Status, Get Data, Register Code) ---
export const approvePartnerRequest = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  // 1. Check Authentication and Admin Role (using request.auth)
  if (!request.auth || request.auth.token.email !== ADMIN_EMAIL) {
    logger.warn("Permission denied for approvePartnerRequest", {
      auth: request.auth ? { uid: request.auth.uid, email: request.auth.token.email } : null
    });
    throw new HttpsError("permission-denied", "User must be an admin.");
  }

  // v2 passes data directly in request.data
  const data = request.data;
  if (!data || typeof data.requestId !== "string") {
    throw new HttpsError("invalid-argument", "Request ID must be provided in data object.");
  }
  const { requestId } = data;

  const requestRef = db.collection(PARTNER_REGISTRATION_REQUEST_COLLECTION).doc(requestId);
  const accountRef = db.collection(PARTNER_ACCOUNTS_COLLECTION).doc(requestId);

  try {
    await db.runTransaction(async (transaction) => {
      const requestDoc = await transaction.get(requestRef);
      if (!requestDoc.exists) {
        throw new HttpsError("not-found", `Request ${requestId} not found.`);
      }
      const requestData = requestDoc.data() as PartnerSignupRequest | undefined;
      if (!requestData) {
        throw new HttpsError("internal", `Request data is missing for ${requestId}.`);
      }

      const registrationCode = generateRegistrationCode();

      let createdAtDate: Date = new Date();
      const docCreateTime = (requestDoc as any).createTime;
      if (docCreateTime instanceof admin.firestore.Timestamp) {
        createdAtDate = docCreateTime.toDate();
      } else {
        logger.warn(`Could not determine accurate creation time for request ${requestId}. Using current time.`);
      }

      const newAccountData: PartnerAccount = {
        // id: requestId, // Removed
        email: requestData.email,
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        businessName: requestData.businessName,
        website: requestData.website,
        businessType: requestData.businessType,
        location: requestData.location,
        phone: requestData.phone,
        consent: requestData.consent,
        status: "enabled",
        registrationCode: registrationCode,
        approvedAt: new Date(),
        createdAt: createdAtDate,
      };

      transaction.set(accountRef, newAccountData);
      transaction.delete(requestRef);

      // TODO: Trigger Email Sending
      logger.info(`TODO: Send email to ${requestData.email} with code ${registrationCode}`);
    });

    logger.info(`Partner request ${requestId} approved successfully by ${request.auth.token.email}.`);
    return { success: true, message: "Partner approved and email triggered." };

  } catch (error: any) {
    logger.error(`Error approving partner request ${requestId}:`, error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to approve partner request.", error.message);
  }
});

// --- Callable Function v2: Toggle Partner Account Status ---
export const togglePartnerAccountStatus = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  // 1. Check Authentication and Admin Role (using request.auth)
  if (!request.auth || request.auth.token.email !== ADMIN_EMAIL) {
    logger.warn("Permission denied for togglePartnerAccountStatus", {
      auth: request.auth ? { uid: request.auth.uid, email: request.auth.token.email } : null
    });
    throw new HttpsError("permission-denied", "User must be an admin.");
  }

  // v2 passes data directly in request.data
  const data = request.data;
  if (!data || typeof data.accountId !== "string") {
    throw new HttpsError("invalid-argument", "Account ID must be provided in data object.");
  }
  const { accountId } = data;

  const accountRef = db.collection(PARTNER_ACCOUNTS_COLLECTION).doc(accountId);

  try {
    const newStatus = await db.runTransaction(async (transaction) => {
      const accountDoc = await transaction.get(accountRef);
      if (!accountDoc.exists) {
        throw new HttpsError("not-found", `Account ${accountId} not found.`);
      }
      const currentStatus = accountDoc.data()?.status;
      const updatedStatus = currentStatus === "enabled" ? "disabled" : "enabled";

      transaction.update(accountRef, { status: updatedStatus });
      return updatedStatus;
    });

    logger.info(`Toggled status for account ${accountId} to ${newStatus} by ${request.auth.token.email}.`);
    return { success: true, message: `Account status set to ${newStatus}.`, newStatus };

  } catch (error: any) {
    logger.error(`Error toggling status for account ${accountId}:`, error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to toggle account status.", error.message);
  }
});

// --- Callable Function v2: Get Admin Dashboard Data ---
export const getAdminDashboardData = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  // 1. Check Authentication and Admin Role
  if (!request.auth || request.auth.token.email !== ADMIN_EMAIL) {
    logger.warn("Permission denied for getAdminDashboardData", {
      auth: request.auth ? { uid: request.auth.uid, email: request.auth.token.email } : null
    });
    throw new HttpsError("permission-denied", "User must be an admin.");
  }

  try {
    // 2. Fetch Pending Requests
    const requestsSnapshot = await db.collection(PARTNER_REGISTRATION_REQUEST_COLLECTION).orderBy("createdAt", "desc").get();
    const pendingRequests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // 3. Fetch Partner Accounts
    const accountsSnapshot = await db.collection(PARTNER_ACCOUNTS_COLLECTION).orderBy("createdAt", "desc").get();
    const partnerAccounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    logger.info(`Admin data fetched successfully by ${request.auth.token.email}.`);
    return { pendingRequests, partnerAccounts };

  } catch (error: any) {
    logger.error(`Error fetching admin dashboard data:`, error);
    throw new HttpsError("internal", "Failed to fetch admin data.", error.message);
  }
});

// --- Callable Function v2: Verify Partner Registration Code ---
// Renamed from registerPartnerWithCode
export const verifyPartnerRegistrationCode = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  // This function checks if the email and code are valid for an UNREGISTERED partner.
  const data = request.data;
  if (!data || typeof data.email !== "string" || typeof data.code !== "string") {
    throw new HttpsError("invalid-argument", "Email and code must be provided.");
  }
  const { email, code } = data;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedEmail || !normalizedCode) {
    throw new HttpsError("invalid-argument", "Email and code cannot be empty.");
  }

  try {
    // Find the partner account matching the email and code
    const accountQuery = db.collection(PARTNER_ACCOUNTS_COLLECTION)
      .where("email", "==", normalizedEmail)
      .where("registrationCode", "==", normalizedCode)
      .where("status", "==", "enabled")
      .limit(1);

    const accountSnapshot = await accountQuery.get();

    if (accountSnapshot.empty) {
      logger.warn(`Invalid registration code verification attempt for email ${normalizedEmail} with code ${normalizedCode}. No matching enabled account found.`);
      throw new HttpsError("not-found", "Invalid email or registration code, or account not enabled.");
    }

    const accountDoc = accountSnapshot.docs[0];
    const accountData = accountDoc.data() as PartnerAccount;

    // IMPORTANT: Check if account already has a Firebase Auth UID (meaning already registered)
    if (accountData.uid) {
      logger.warn(`Verification attempt for already registered email ${normalizedEmail} (Account ID: ${accountDoc.id})`);
      throw new HttpsError("already-exists", "This account seems to be already registered. Please use the login tab.");
    }

    // If we reached here, the code is valid for an unregistered, enabled account.
    logger.info(`Registration code verified successfully for email ${normalizedEmail}`);
    return {
      success: true,
      message: "Code verified successfully. Proceed to set your password."
    };

  } catch (error: any) {
    // Log errors that aren't HttpsError specifically
    if (!(error instanceof HttpsError)) {
      logger.error(`Unexpected error during partner code verification for ${normalizedEmail}:`, error);
    }
    // Rethrow HttpsErrors or wrap others
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to verify partner registration code.", error.message);
  }
});

// --- Callable Function v2: Complete Partner Registration (Set Password) ---
interface CompleteRegistrationPayload {
  email: string;
  code: string;
  password?: string; // Optional for now, mandatory for email/pass flow
}

export const completePartnerRegistration = onCall({
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  const data = request.data as CompleteRegistrationPayload;
  if (!data ||
    typeof data.email !== "string" ||
    typeof data.code !== "string" ||
    typeof data.password !== "string" // Password is now required for this function
  ) {
    logger.error("Invalid payload for completePartnerRegistration", { data });
    throw new HttpsError("invalid-argument", "Email, code, and password must be provided.");
  }
  const { email, code, password } = data;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedCode = code.trim().toUpperCase();
  const trimmedPassword = password.trim(); // Assuming password validation happens client-side

  if (!normalizedEmail || !normalizedCode || !trimmedPassword) {
    throw new HttpsError("invalid-argument", "Email, code, and password cannot be empty.");
  }

  // Basic password validation (length) - client should do more
  if (trimmedPassword.length < 6) {
    throw new HttpsError("invalid-argument", "Password must be at least 6 characters long.");
  }

  try {
    // Find the partner account matching the email and code AGAIN (security check)
    const accountQuery = db.collection(PARTNER_ACCOUNTS_COLLECTION)
      .where("email", "==", normalizedEmail)
      .where("registrationCode", "==", normalizedCode)
      .where("status", "==", "enabled")
      .limit(1);

    const accountSnapshot = await accountQuery.get();

    if (accountSnapshot.empty) {
      logger.warn(`Completion attempt failed for email ${normalizedEmail} with code ${normalizedCode}. Account not found or invalid.`);
      throw new HttpsError("not-found", "Invalid email or registration code, or account not enabled. Please start over.");
    }

    const accountDoc = accountSnapshot.docs[0];
    const accountData = accountDoc.data() as PartnerAccount;

    // Check if account already has a Firebase Auth UID
    if (accountData.uid) {
      logger.warn(`Completion attempt for already registered email ${normalizedEmail} (Account ID: ${accountDoc.id})`);
      throw new HttpsError("already-exists", "This account seems to be already registered. Please use the login tab.");
    }

    // --- Create Firebase Auth User ---
    let newUserUid: string;
    try {
      const userRecord = await admin.auth().createUser({
        email: normalizedEmail,
        emailVerified: false, // Consider verification flow later
        password: trimmedPassword, // Create user with the password
        displayName: `${accountData.firstName} ${accountData.lastName}`,
      });
      newUserUid = userRecord.uid;
      logger.info(`Created Firebase Auth user ${newUserUid} for partner email ${normalizedEmail}`);

      // Set custom claim for partner role
      await admin.auth().setCustomUserClaims(newUserUid, { role: 'partner' });
      logger.info(`Set 'partner' role claim for user ${newUserUid}`);

    } catch (authError: any) {
      logger.error(`Error creating Firebase Auth user for ${normalizedEmail} during completion:`, authError);
      if (authError.code === 'auth/email-already-exists') {
        throw new HttpsError("already-exists", "An account with this email already exists in the authentication system. Please contact support.");
      }
      if (authError.code === 'auth/invalid-password' || authError.code === 'auth/password-does-not-meet-requirements') {
        throw new HttpsError("invalid-argument", "Password is not strong enough or invalid.");
      }
      throw new HttpsError("internal", "Failed to create authentication account.", authError.message);
    }

    // --- Update PartnerAccounts Document ---
    // Note: We do not create a separate 'Users' document for partners. 
    // The PartnerAccount document serves as the user profile.
    // MIGRATION: Move the document from requestId to uid as the document ID.
    try {
      const oldAccountData = accountDoc.data();
      const newAccountRef = db.collection(PARTNER_ACCOUNTS_COLLECTION).doc(newUserUid);
      
      // Prepare new data
      const newAccountData = {
        ...oldAccountData,
        uid: newUserUid, // Link the Auth UID
        registeredAt: admin.firestore.FieldValue.serverTimestamp(), // Set registration timestamp
        onboardingCompleted: false // Initialize onboarding status
      };
      
      // Remove registrationCode and id if it exists in data
      delete (newAccountData as any).registrationCode;
      delete (newAccountData as any).id; 

      await db.runTransaction(async (t) => {
        t.set(newAccountRef, newAccountData);
        t.delete(accountDoc.ref);
      });

      logger.info(`Migrated PartnerAccount from ${accountDoc.id} to ${newUserUid} and removed code.`);
    } catch (updateError: any) {
      logger.error(`Failed to migrate PartnerAccount from ${accountDoc.id} to ${newUserUid}:`, updateError);
      // Critical issue: Auth user created but PartnerAccount migration failed
      // Try to clean up by deleting the just-created Auth user
      try {
        await admin.auth().deleteUser(newUserUid);
        logger.warn(`Cleaned up orphaned Auth user ${newUserUid} due to PartnerAccount migration failure.`);
      } catch (deleteError) {
        logger.error(`CRITICAL: Failed to delete orphaned Auth user ${newUserUid} after PartnerAccount migration failure. Manual cleanup required.`, deleteError);
      }
      throw new HttpsError("internal", "Account created but failed to finalize registration. Please try again or contact support.");
    }

    // No need to generate password reset link anymore

    // Return success message
    return {
      success: true,
      message: "Account created successfully! You can now log in with your new password."
    };

  } catch (error: any) {
    // Log errors that aren't HttpsError specifically
    if (!(error instanceof HttpsError)) {
      logger.error(`Unexpected error during partner registration completion for ${normalizedEmail}:`, error);
    }
    // Rethrow HttpsErrors or wrap others
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to complete partner registration.", error.message);
  }
});

// --- Callable Function v2: Finalize Onboarding ---

interface FinalizeOnboardingPayload {
  userId: string;
  data: OnboardingData;
  email?: string;
}

export const finalizeOnboarding = onCall({
  region: TARGET_REGION,
  cors: true
}, async (request) => {
  // 1. Check Authentication
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const payload = request.data as FinalizeOnboardingPayload;
  const { userId, data, email } = payload;

  if (!userId || !data) {
    throw new HttpsError("invalid-argument", "userId and data are required.");
  }

  // Verify the caller is the user they claim to be (or admin)
  if (request.auth.uid !== userId && request.auth.token.email !== ADMIN_EMAIL) {
    throw new HttpsError("permission-denied", "You can only finalize your own onboarding.");
  }

  try {
    // 1. Update PartnerAccounts collection
    let partnerDocRef: admin.firestore.DocumentReference | null = null;

    if (email) {
      const partnerQuery = db.collection(PARTNER_ACCOUNTS_COLLECTION)
        .where('email', '==', email.toLowerCase())
        .limit(1);
      const querySnapshot = await partnerQuery.get();

      if (!querySnapshot.empty) {
        partnerDocRef = querySnapshot.docs[0].ref;
      }
    }

    // If not found by email, fallback to trying UID field
    if (!partnerDocRef) {
      // Direct lookup by UID (since we migrated to UID as doc ID)
      const docByUid = db.collection(PARTNER_ACCOUNTS_COLLECTION).doc(userId);
      const docSnap = await docByUid.get();
      if (docSnap.exists) {
        partnerDocRef = docByUid;
      } else {
        // Fallback: Check if a doc exists with userId as doc ID (legacy or specific cases)
        // Actually, if we migrated, userId IS the doc ID.
        // But maybe we are looking for a doc that hasn't been migrated yet?
        // Unlikely for finalizeOnboarding which happens after login (and thus after registration/migration).
        
        // Check if there is a doc where uid field == userId (legacy check just in case)
        const partnerQueryByUid = db.collection(PARTNER_ACCOUNTS_COLLECTION).where('uid', '==', userId).limit(1);
        const uidSnap = await partnerQueryByUid.get();
        if (!uidSnap.empty) {
           partnerDocRef = uidSnap.docs[0].ref;
        } else {
           logger.warn(`Partner account not found for userId: ${userId}`);
           // If we still can't find it, we might need to create it or error out.
           // For now, let's assume we create/update at userId if not found.
           partnerDocRef = docByUid;
        }
      }
    }

    // Update PartnerAccounts
    await partnerDocRef.set({
      ...data,
      onboardingCompleted: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Create default location if it doesn't exist
    const locationsSnap = await partnerDocRef.collection('locations').limit(1).get();
    if (locationsSnap.empty) {
      const partnerData = (await partnerDocRef.get()).data();
      await partnerDocRef.collection('locations').add({
        name: partnerData?.businessName || "Main Location",
        address: partnerData?.address || partnerData?.location || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isDefault: true
      });
      logger.info('Default location created for user:', userId);
    }

    logger.info('PartnerAccounts updated for user:', userId);

    // 2. Delete from OnboardingData collection (cleanup)
    // Note: The collection name in functions might need to match what client used.
    // Client used 'OnboardingData'.
    const ONBOARDING_DATA_COLLECTION = 'OnboardingData';
    await db.collection(ONBOARDING_DATA_COLLECTION).doc(userId).delete();
    logger.info('OnboardingData document deleted for user:', userId);

    return { success: true, message: "Onboarding finalized successfully." };

  } catch (error: any) {
    logger.error('Error finalizing onboarding:', error);
    throw new HttpsError('internal', 'Failed to finalize onboarding.', error.message);
  }
});

// --- Callable Function v2: Get Partner Onboarding Status ---
export const getPartnerOnboardingStatus = onCall({
  region: TARGET_REGION,
  cors: true
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const uid = request.auth.uid;

  try {
    let partnerDocRef = db.collection(PARTNER_ACCOUNTS_COLLECTION).doc(uid);
    let partnerDoc = await partnerDocRef.get();

    if (!partnerDoc.exists) {
      // Fallback: Check if there is a doc where uid field == uid
      const partnerQueryByUid = db.collection(PARTNER_ACCOUNTS_COLLECTION).where('uid', '==', uid).limit(1);
      const uidSnap = await partnerQueryByUid.get();

      if (!uidSnap.empty) {
        partnerDoc = uidSnap.docs[0];
        partnerDocRef = partnerDoc.ref;
      } else {
        logger.warn(`Partner account not found for uid: ${uid}`);
        return {
          address: false,
          website: false,
          services: false,
          team: false,
          hours: false,
        };
      }
    }

    const data = partnerDoc.data();
    
    // Check subcollections
    const servicesSnap = await partnerDocRef.collection("services").limit(1).get();
    const teamSnap = await partnerDocRef.collection("teamMembers").limit(1).get();

    return {
      address: !!data?.location || !!data?.address || !!data?.businessLocation,
      website: !!data?.website,
      services: !servicesSnap.empty,
      team: !teamSnap.empty,
      hours: !!data?.workingHours || !!data?.openingHours,
    };

  } catch (error: any) {
    logger.error('Error getting partner onboarding status:', error);
    throw new HttpsError('internal', 'Failed to get onboarding status.', error.message);
  }
});