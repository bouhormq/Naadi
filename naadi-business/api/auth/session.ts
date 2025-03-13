import { getAuth, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getApp } from 'firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@naadi/types';

// Storage keys
const USER_DATA_KEY = 'naadi_business_user_data';
const AUTH_TOKEN_KEY = 'naadi_business_auth_token';

/**
 * Signs out the current user
 */
export async function signOutUser(): Promise<void> {
  try {
    const auth = getAuth(getApp());
    await signOut(auth);
    // Clear stored user data and token
    await AsyncStorage.multiRemove([USER_DATA_KEY, AUTH_TOKEN_KEY]);
    
    // Call the server API to clear session
    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
    const token = await user.getIdToken(forceRefresh);
    // Store the token for future use
    await storeAuthToken(token);
    return token;
  } catch (error) {
    console.error('Get ID token error:', error);
    return null;
  }
}

/**
 * Stores user data in AsyncStorage
 */
export async function storeUserData(userData: any): Promise<void> {
  // Make sure userData has all required User fields
  const user = {
    ...userData,
    createdAt: userData.createdAt || new Date().toISOString()
  };
  
  await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

/**
 * Gets user data from AsyncStorage
 */
export async function getUserData(): Promise<User | null> {
  const userData = await AsyncStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
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

/**
 * Refreshes the current user data from the server
 */
export async function refreshUserData(): Promise<User | null> {
  try {
    const token = await getIdToken(true);
    if (!token) return null;
    
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh user data');
    }
    
    const userData = await response.json();
    await storeUserData(userData);
    return userData;
  } catch (error) {
    console.error('Refresh user data error:', error);
    return null;
  }
}

/**
 * Initializes the auth session
 * Call this on app startup to restore the user session
 */
export async function initializeAuthSession(): Promise<User | null> {
  try {
    // Check if we have stored user data
    const userData = await getUserData();
    
    // If we have a current Firebase user, refresh their data
    const firebaseUser = getCurrentUser();
    if (firebaseUser) {
      return await refreshUserData();
    }
    
    // If we have stored user data but no Firebase user,
    // we might have a session cookie but Firebase auth in memory is gone
    if (userData) {
      // Try to validate the session with the server
      const token = await getAuthToken();
      if (token) {
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          return userData;
        }
        
        // If validation fails, clear session data
        await AsyncStorage.multiRemove([USER_DATA_KEY, AUTH_TOKEN_KEY]);
      }
    }
    
    return null;
  } catch (error) {
    console.error('Initialize auth session error:', error);
    return null;
  }
} 