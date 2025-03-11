const admin = require('firebase-admin');
const path = require('path');
// Load .env.local from root project directory
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Initialize with service account from environment
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Use the service account JSON from environment variable 
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log("✅ Firebase Admin SDK initialized successfully!");
    } else {
      console.error("❌ FIREBASE_SERVICE_ACCOUNT not found in environment");
      process.exit(1);
    }
  }
  
  // Test Firestore connection
  const db = admin.firestore();
  db.collection('test').doc('test').set({ test: true })
    .then(() => {
      console.log("✅ Successfully wrote to Firestore!");
      // Clean up
      return db.collection('test').doc('test').delete();
    })
    .then(() => {
      console.log("✅ Successfully cleaned up test document!");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Firestore error:", error);
      process.exit(1);
    });
} catch (error) {
  console.error("❌ Firebase initialization error:", error);
  process.exit(1);
}
