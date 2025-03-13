import { User } from '@naadi/types';
import { ApiError } from '../../utils/apiError';
import { getAuth, Auth, getIdToken as getFirebaseIdToken } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

// Local cache for current user
let currentUser: User | null = null;

/**
 * Get the currently authenticated user
 * @returns User object or null if not authenticated
 */
export function getCurrentUser(): User | null {
  // In a real app, we might want to verify this against token expiration
  return currentUser;
}

/**
 * Set the currently authenticated user
 * @param user User object from authentication
 */
export function setCurrentUser(user: User | null): void {
  currentUser = user;
}

/**
 * Get the Firebase Auth token for the current user
 * @returns Promise with the ID token string
 */
export async function getAuthToken(): Promise<string | null> {
  const auth = getAuth();
  const firebaseUser = auth.currentUser;
  
  if (!firebaseUser) {
    return null;
  }
  
  try {
    return await getFirebaseIdToken(firebaseUser);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Get user ID from Firebase Auth token
 * @param token Firebase Auth token
 * @returns User ID string
 */
export async function getUserIdFromToken(token: string): Promise<string> {
  try {
    const auth = getAuth();
    
    // In a real implementation, we would verify the token 
    // using Firebase Admin SDK on the server side
    // For this client-side implementation, we'll just get the current user ID
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser) {
      throw new ApiError('Invalid or expired token', 401);
    }
    
    return firebaseUser.uid;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new ApiError('Failed to verify authentication token', 401);
  }
}

/**
 * Fetch fresh user data from Firestore
 * @param userId User ID to fetch
 * @returns Full user object
 */
export async function refreshUserData(userId: string): Promise<User> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new ApiError('User not found', 404);
    }
    
    const userData = userDoc.data() as User;
    
    // Update the local cache
    setCurrentUser(userData);
    
    return userData;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    throw new ApiError('Failed to refresh user data', 500);
  }
}

/**
 * Clear the current user session
 */
export function clearSession(): void {
  setCurrentUser(null);
} 