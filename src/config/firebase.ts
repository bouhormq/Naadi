import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage } from 'firebase/storage'; // Add if you use Storage

// Your web app's Firebase configuration
// IMPORTANT: Use environment variables for sensitive keys!
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized.");
} else {
  app = getApp(); // Use the existing app
  console.log("Firebase already initialized.");
}

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'europe-southwest1');
const storage = getStorage(app); // Add if you use Storage

// Optional: Connect to Functions emulator if running locally
// const isDevelopment = process.env.NODE_ENV === 'development'; // Example check
// if (isDevelopment) { 
//   console.log("Connecting to Firebase Functions emulator");
//   try {
//     connectFunctionsEmulator(functions, "localhost", 5001); 
//     // You might need to connect other emulators too (Auth, Firestore)
//     // connectAuthEmulator(auth, "http://localhost:9099");
//     // connectFirestoreEmulator(db, "localhost", 8080);
//   } catch (error) {
//     console.error("Error connecting to Firebase emulators:", error);
//   }
// }

export { app, auth, db, functions, storage }; // Export initialized services 