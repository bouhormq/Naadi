import { Platform } from 'react-native';
import { 
  getAuth, 
  RecaptchaVerifier,
  GoogleAuthProvider,
  FacebookAuthProvider,
  getRedirectResult,
  signInWithRedirect
} from 'firebase/auth';
import { getApp } from 'firebase/app';
import {
  signupWithEmail,
  loginWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  signOutUser,
  onAuthChanged,
  getCurrentUser,
  getIdToken,
  storeUserData,
  storeAuthToken
} from '../api/auth';

// Extend Window interface to include our global variables
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

// Initialize Firebase
export let recaptchaVerifier: any = null;

/**
 * Initializes reCAPTCHA for phone authentication on web
 */
export function initRecaptcha(containerOrId: string | HTMLElement) {
  if (Platform.OS === 'web') {
    const auth = getAuth(getApp());
    recaptchaVerifier = new RecaptchaVerifier(auth, containerOrId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow sign-in with phone
      }
    });
    
    // Add to window for global access
    if (typeof window !== 'undefined') {
      window.recaptchaVerifier = recaptchaVerifier;
    }
  }
  return recaptchaVerifier;
}

// Re-export all auth functions from our API layer
export {
  signupWithEmail,
  loginWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  signOutUser,
  onAuthChanged,
  getCurrentUser,
  getIdToken,
  storeUserData,
  storeAuthToken
};

/**
 * Gets Google redirect result for web platform
 */
export async function getGoogleRedirectResult() {
  if (Platform.OS === 'web') {
    const auth = getAuth(getApp());
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        // Handle the signed-in user
        const user = result.user;
        return user;
      }
    } catch (error) {
      console.error('Error getting redirect result:', error);
    }
  }
  return null;
}

/**
 * Initiates Google sign-in with redirect on web
 */
export async function initiateGoogleRedirect() {
  if (Platform.OS === 'web') {
    const auth = getAuth(getApp());
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }
}

/**
 * Initiates Facebook sign-in with redirect on web
 */
export async function initiateFacebookRedirect() {
  if (Platform.OS === 'web') {
    const auth = getAuth(getApp());
    const provider = new FacebookAuthProvider();
    await signInWithRedirect(auth, provider);
  }
} 