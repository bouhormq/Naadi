import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
// Remove the v1 import if it's not used elsewhere, or keep if other v1 functions exist (unlikely based on errors)
// import * as functions from "firebase-functions"; 

// Assuming admin SDK is initialized elsewhere (e.g., in index.ts)
// if (!admin.apps.length) {
//   admin.initializeApp();
// }

// Define the target region consistently
const TARGET_REGION = "europe-southwest1";

// Define expected data structure for setMyBusinessProfile input
// Add optional businessId for updates
interface SetBusinessProfileData {
    businessId?: string; // <-- Add optional ID for updates
    name: string;
    category: string;
    phone: any; // Use the actual PhoneInfo type if shared
    description?: string;
    website?: string;
    address?: any; // Use the actual Address type if shared
}

// Define type for data being written to Firestore
// Includes all potential fields for create and update
interface BusinessWriteData {
  ownerUid?: string; // Set on create
  name: string;
  category: string;
  phone: any; // Ideally use shared PhoneInfo type
  description?: string;
  website?: string;
  address?: any; // Ideally use shared Address type
  createdAt?: admin.firestore.FieldValue; // serverTimestamp() on create
  updatedAt: admin.firestore.FieldValue; // serverTimestamp() always
}

const db = admin.firestore();
const businessesCollection = db.collection("businesses");

/**
 * Gets the business profile for a specific business ID.
 * THIS IS NO LONGER TIED TO USER ID DIRECTLY. Use getMyBusinesses to list, then this to fetch details if needed.
 * OR, maybe remove this if getMyBusinesses returns all data needed?
 * Keeping it for now, but requires businessId as input.
 */
export const getBusinessProfileById = onCall({ region: TARGET_REGION }, async (request) => {
  // Requires businessId in the request data
  const businessId = request.data?.businessId;
  if (!businessId || typeof businessId !== 'string') {
       throw new HttpsError("invalid-argument", "Missing or invalid businessId.");
  }

  // Authentication still recommended to ensure only valid users call it
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }
  // const uid = request.auth.uid; // Can use uid for logging if needed

  try {
    const businessDocRef = businessesCollection.doc(businessId);
    const businessSnap = await businessDocRef.get();

    if (!businessSnap.exists) {
      logger.info(`No business profile found for ID ${businessId}`);
      return null; 
    }

    const businessData = businessSnap.data();
    logger.info(`Returning business profile for ID ${businessId}`);
    
    // We should verify ownership here if this function remains
    // if (businessData?.ownerUid !== uid) {
    //     logger.warn(`User ${uid} attempted to access business ${businessId} owned by ${businessData?.ownerUid}`);
    //     throw new HttpsError("permission-denied", "You do not have permission to access this profile.");
    // }

    // Convert Firestore Timestamps to ISO strings for JSON compatibility
    const convertTimestamps = (data: any) => {
      const result = { ...data }; // Avoid modifying the original snapshot data
      if (result?.createdAt && result.createdAt.toDate) {
        result.createdAt = result.createdAt.toDate().toISOString();
      }
      if (result?.updatedAt && result.updatedAt.toDate) {
        result.updatedAt = result.updatedAt.toDate().toISOString();
      }
      return result;
    };

    return {
        id: businessSnap.id,
        ...convertTimestamps(businessData),
    };

  } catch (error) {
    // Handle potential permission denied error from ownership check
    if (error instanceof HttpsError && error.code === 'permission-denied') {
        throw error; // Re-throw permission error
    }
    logger.error(`Error getting business profile for ID ${businessId}:`, error);
    throw new HttpsError("internal", "Failed to retrieve business profile.", error);
  }
});

/**
 * Creates or updates a business profile for the authenticated partner.
 * Uses businessId from data to determine create vs update.
 */
export const setMyBusinessProfile = onCall({ region: TARGET_REGION }, async (request) => {
   // Check authentication
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }
  const uid = request.auth.uid;
  const data = request.data as SetBusinessProfileData;
  const { businessId, name, category, phone } = data;

  // Validate required fields for both create and update
  if (!name || !category || !phone) { 
      throw new HttpsError("invalid-argument", "Missing required fields: name, category, phone.");
  }

  const now = admin.firestore.FieldValue.serverTimestamp();
  let docRef: admin.firestore.DocumentReference;
  let responseMessage: string;
  let resultingBusinessId: string;

  // Prepare the core data for writing (excluding ownerUid and createdAt for now)
  const coreWriteData: Omit<BusinessWriteData, 'ownerUid' | 'createdAt'> = {
      name: data.name,
      category: data.category,
      phone: data.phone,
      description: data.description,
      website: data.website,
      address: data.address,
      updatedAt: now,
  };
  // Remove undefined fields dynamically
  Object.keys(coreWriteData).forEach((key) => {
    const k = key as keyof typeof coreWriteData;
    if (coreWriteData[k] === undefined) {
        delete coreWriteData[k];
    }
  });

  try {
      if (businessId && typeof businessId === 'string') {
          // UPDATE existing document
          docRef = businessesCollection.doc(businessId);
          logger.info(`Attempting to update business profile ${businessId} for user ${uid}`);
          
          // Verify ownership before updating
          const currentSnap = await docRef.get();
          if (!currentSnap.exists) {
              throw new HttpsError("not-found", `Business with ID ${businessId} not found.`);
          }
          if (currentSnap.data()?.ownerUid !== uid) {
              logger.warn(`User ${uid} attempted to update business ${businessId} owned by ${currentSnap.data()?.ownerUid}`);
              throw new HttpsError("permission-denied", "You do not have permission to update this profile.");
          }

          // Perform the update (merge is implicit with update)
          await docRef.update(coreWriteData);
          responseMessage = "Business profile updated.";
          resultingBusinessId = businessId;

      } else {
          // CREATE new document
          logger.info(`Creating new business profile for user ${uid}`);
          docRef = businessesCollection.doc(); // Firestore generates ID
          const fullWriteData: BusinessWriteData = {
              ...coreWriteData, // Includes updatedAt
              ownerUid: uid,
              createdAt: now, 
          };
          await docRef.set(fullWriteData);
          responseMessage = "Business profile created.";
          resultingBusinessId = docRef.id; 
      }
      
      return { success: true, message: responseMessage, businessId: resultingBusinessId };

  } catch (error) {
      // Handle specific errors like permission denied
      if (error instanceof HttpsError) {
           logger.error(`Error setting business profile for ${uid} (Business ID: ${businessId || 'New'}): ${error.code} - ${error.message}`);
           throw error; // Re-throw HttpsError
      } 
      // Handle generic errors
      logger.error(`Generic error setting business profile for ${uid} (Business ID: ${businessId || 'New'}):`, error);
      throw new HttpsError("internal", "Failed to save business profile.", error);
  }
});

/**
 * Helper function to safely convert Firestore Timestamps or Dates to ISO strings.
 * Handles potential null/undefined values and existing strings.
 */
const serializeDate = (date: any): string | null => {
  if (date instanceof Timestamp) {
    return date.toDate().toISOString();
  }
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    // Could potentially validate if it's an ISO string already
    return date;
  }
  return null; // Or handle as needed, maybe return undefined?
};

/**
 * Callable Cloud Function (V2) to fetch all business profiles associated with the logged-in partner.
 */
export const getMyBusinesses = onCall({ region: TARGET_REGION }, async (request) => { // Use V2 onCall and request object
    // V2 authentication check
    if (!request.auth) { 
        logger.error("getMyBusinesses: Authentication required.");
        // Use HttpsError from v2 import
        throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
    }

    // Access UID from request.auth
    const ownerUid = request.auth.uid; 
    logger.log(`getMyBusinesses: Fetching businesses for ownerUid: ${ownerUid}`);

    try {
        const businessSnap = await admin.firestore()
            .collection("businesses")
            .where("ownerUid", "==", ownerUid)
            .get();

        if (businessSnap.empty) {
            logger.log(`getMyBusinesses: No businesses found for ownerUid: ${ownerUid}`);
            return []; // Return empty array is fine
        }

        const businesses: any[] = [];
        businessSnap.forEach(doc => {
            const data = doc.data();
            const serializedData = {
                ...data,
                id: doc.id,
                createdAt: serializeDate(data.createdAt),
                updatedAt: serializeDate(data.updatedAt),
                // Add any other Timestamp fields that need serialization
            };
            businesses.push(serializedData);
        });

        logger.log(`getMyBusinesses: Found ${businesses.length} businesses for ownerUid: ${ownerUid}`);
        // Return the array directly in V2
        return businesses;

    } catch (error) {
        logger.error(`getMyBusinesses: Error fetching businesses for ownerUid ${ownerUid}:`, error);
        // Use HttpsError from v2 import
        throw new HttpsError("internal", "Failed to retrieve business profiles.", error);
    }
});

// Ensure this new function is exported from the main index file if needed
// Example in cloud-functions/functions/src/index.ts:
// export { getMyBusinesses } from './business';
// (This might already be handled by exporting *) 