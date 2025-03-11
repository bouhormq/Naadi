const admin = require('firebase-admin');
const path = require('path');
// Load .env.local from root project directory
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Initialize with service account from environment
try {
  if (!admin.apps.length) {
    // Try to use the full service account JSON if available
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin SDK initialized successfully with full JSON!");
      } catch (jsonError) {
        console.error("❌ Error parsing FIREBASE_SERVICE_ACCOUNT JSON:", jsonError.message);
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
          console.log("✅ Firebase Admin SDK initialized successfully with individual variables!");
        } else {
          console.error("❌ Individual Firebase credentials not found in environment.");
          console.error("Please provide either FIREBASE_SERVICE_ACCOUNT or all three: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
          process.exit(1);
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
      console.log("✅ Firebase Admin SDK initialized successfully with individual variables!");
    } else {
      console.error("❌ Firebase credentials not found in environment.");
      console.error("Please provide either FIREBASE_SERVICE_ACCOUNT or all three: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
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