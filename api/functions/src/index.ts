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

// --- Callable Function v2: Get Google Places Autocomplete Suggestions ---
export const getPlacesSuggestions = onCall({ 
  region: TARGET_REGION,
  cors: true // Allow all origins
}, async (request) => {
  const data = request.data;
  
  if (!data || typeof data.input !== "string") {
    throw new HttpsError("invalid-argument", "Input string is required.");
  }

  const { input } = data;

  if (!input.trim() || input.length < 2) {
    throw new HttpsError("invalid-argument", "Input must be at least 2 characters.");
  }

  if (!GOOGLE_PLACES_API_KEY) {
    logger.error("Google Places API key is not configured.");
    throw new HttpsError("internal", "Places API is not configured.");
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${GOOGLE_PLACES_API_KEY}`
    );

    const data = await response.json();

    if (data.predictions) {
      logger.info(`Google Places API call successful for input: ${input}`);
      return { 
        success: true, 
        predictions: data.predictions 
      };
    } else {
      logger.warn(`No predictions returned from Google Places API for input: ${input}`);
      return { 
        success: true, 
        predictions: [] 
      };
    }
  } catch (error: any) {
    logger.error(`Error calling Google Places API:`, error);
    throw new HttpsError("internal", "Failed to fetch place suggestions.", error.message);
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
          id: requestId,
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

        // --- Create Users Document in Firestore ---
        try {
            const usersRef = db.collection("Users").doc(newUserUid);
            await usersRef.set({
                uid: newUserUid,
                email: normalizedEmail,
                role: 'partner',
                firstName: accountData.firstName,
                lastName: accountData.lastName,
                phone: accountData.phone, // PhoneInfo object
                authMethod: 'email',
                agreeToMarketing: accountData.consent,
                onboardingCompleted: false, // Partners see onboarding on first login
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            logger.info(`Created Users document for partner ${newUserUid}`);
        } catch (firestoreError: any) {
            logger.error(`Error creating Users document for ${newUserUid}:`, firestoreError);
            // Critical issue: Auth user exists but Firestore document failed
            // Try to clean up by deleting the just-created Auth user
            try {
                await admin.auth().deleteUser(newUserUid);
                logger.warn(`Cleaned up orphaned Auth user ${newUserUid} due to Firestore error.`);
            } catch (deleteError) {
                logger.error(`CRITICAL: Failed to delete orphaned Auth user ${newUserUid}. Manual cleanup required.`, deleteError);
            }
            throw new HttpsError("internal", "Failed to create user profile.", firestoreError.message);
        }

        // --- Update PartnerAccounts Document ---
        try {
             await accountDoc.ref.update({
                uid: newUserUid, // Link the Auth UID
                registrationCode: admin.firestore.FieldValue.delete(), // Remove the code after use
                registeredAt: admin.firestore.FieldValue.serverTimestamp() // Set registration timestamp
            });
             logger.info(`Updated PartnerAccount ${accountDoc.id} with UID ${newUserUid} and removed code.`);
        } catch (updateError: any) {
             logger.error(`Failed to update PartnerAccount ${accountDoc.id} after Auth creation:`, updateError);
            // Critical issue: Auth user and Users doc exist but PartnerAccount update failed
            // Try to clean up by deleting the just-created Auth user
            try {
                await admin.auth().deleteUser(newUserUid);
                logger.warn(`Cleaned up orphaned Auth user ${newUserUid} due to PartnerAccount update failure.`);
            } catch (deleteError) {
                logger.error(`CRITICAL: Failed to delete orphaned Auth user ${newUserUid} after PartnerAccount update failure. Manual cleanup required.`, deleteError);
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