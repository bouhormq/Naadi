import { getAuth, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@naadi/types/src/firestore';

// Storage keys
const BUSINESS_DATA_KEY = 'naadi_business_data';
const AUTH_TOKEN_KEY = 'naadi_auth_token';

/**
 * Signs out the current business user
 */
export async function signOutBusiness(): Promise<void> {
  try {
    const auth = getAuth(getApp());
    await signOut(auth);
    // Clear stored business data and token
    await AsyncStorage.multiRemove([BUSINESS_DATA_KEY, AUTH_TOKEN_KEY]);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

/**
 * Sets up an auth state change listener
 */
export function onAuthChanged(callback: (user: FirebaseUser | null) => void): () => void {
  const auth = getAuth(getApp());
  return onAuthStateChanged(auth, callback);
}

/**
 * Gets the current Firebase user
 */
export function getCurrentUser(): FirebaseUser | null {
  const auth = getAuth(getApp());
  return auth.currentUser;
}

/**
 * Gets the current user's ID token
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = getCurrentUser();
  if (!user) return null;
  
  try {
    return await user.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Get ID token error:', error);
    return null;
  }
}

/**
 * Stores business data in AsyncStorage
 */
export async function storeBusinessData(businessData: any): Promise<void> {
  // Make sure businessData has all required User fields
  const business = {
    ...businessData,
    createdAt: businessData.createdAt || new Date().toISOString()
  };
  
  await AsyncStorage.setItem(BUSINESS_DATA_KEY, JSON.stringify(business));
}

/**
 * Gets business data from AsyncStorage
 */
export async function getBusinessData(): Promise<User | null> {
  const businessData = await AsyncStorage.getItem(BUSINESS_DATA_KEY);
  return businessData ? JSON.parse(businessData) : null;
}

/**
 * Stores authentication token in AsyncStorage
 */
export async function storeAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Gets authentication token from AsyncStorage
 */
export async function getAuthToken(): Promise<string | null> {
  return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
} 