import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase app if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Get the Firebase app instance
export const app = getApp();

// Get the Auth instance
export const auth = getAuth(app);

// Connect to Auth Emulator for local development if needed
if (process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true' && Platform.OS === 'web') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export default auth; 