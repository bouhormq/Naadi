import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  // Check for different ways to initialize Firebase Admin
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      // Use the service account JSON from environment variable 
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("Firebase Admin SDK initialized with service account JSON");
    } catch (jsonError: unknown) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT JSON:", jsonError instanceof Error ? jsonError.message : 'Unknown error');
      console.log("Trying alternative method with individual variables...");
      
      // If JSON parsing fails, try using individual environment variables
      if (
        process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_CLIENT_EMAIL && 
        process.env.FIREBASE_PRIVATE_KEY
      ) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // The private key needs to be properly formatted
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
        console.log("Firebase Admin SDK initialized with individual credentials");
      } else {
        throw new Error("No valid Firebase credentials found in environment variables");
      }
    }
  } else if (
    process.env.FIREBASE_PROJECT_ID && 
    process.env.FIREBASE_CLIENT_EMAIL && 
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    // Use individual environment variables
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key needs to be properly formatted
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log("Firebase Admin SDK initialized with individual credentials");
  } else {
    // Default initialization for development (uses Application Default Credentials if available)
    admin.initializeApp();
    console.warn('Firebase Admin initialized without explicit credentials. Using Application Default Credentials.');
  }
}

// Export Firestore instance
export const db = getFirestore();

// Helper functions for Firestore operations
export async function getDocument<T>(collection: string, id: string): Promise<T | null> {
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as T;
  } catch (error) {
    console.error(`Error getting document from ${collection}:`, error);
    throw error;
  }
}

export async function createDocument<T>(collection: string, data: Omit<T, 'id'>): Promise<string> {
  try {
    // Create a timestamp if not provided
    const timestamp = new Date().toISOString();
    
    // Use type assertion to safely add createdAt if it doesn't exist
    const dataToSave = {
      ...data,
    } as any;
    
    // Only add createdAt if it doesn't exist in the data
    if (!dataToSave.createdAt) {
      dataToSave.createdAt = timestamp;
    }
    
    const docRef = await db.collection(collection).add(dataToSave);
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collection}:`, error);
    throw error;
  }
}

export async function updateDocument<T>(collection: string, id: string, data: Partial<T>): Promise<void> {
  try {
    await db.collection(collection).doc(id).update(data);
  } catch (error) {
    console.error(`Error updating document in ${collection}:`, error);
    throw error;
  }
}

export async function deleteDocument(collection: string, id: string): Promise<void> {
  try {
    await db.collection(collection).doc(id).delete();
  } catch (error) {
    console.error(`Error deleting document from ${collection}:`, error);
    throw error;
  }
} 