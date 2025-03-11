import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  // In production, use environment variables or service account
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
    : undefined;

  admin.initializeApp({
    credential: serviceAccount 
      ? admin.credential.cert(serviceAccount) 
      : undefined,
  });
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