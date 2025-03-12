// This script cleans up any leftover test data in the Firestore database
// It removes any documents with test-* IDs that might not have been properly cleaned up

// Import required modules and load environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Import firebase admin and initialize
const admin = require('firebase-admin');

// Check if already initialized
if (!admin.apps.length) {
  // Parse service account from env
  let serviceAccount;
  
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    // If JSON parsing fails, try individual credentials
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    };
  }
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Get Firestore instance
const db = admin.firestore();

// Colors for console output
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

async function cleanupCollection(collectionName) {
  console.log(`${YELLOW}Cleaning up '${collectionName}' collection...${RESET}`);
  
  try {
    // Get all documents where ID starts with 'test-'
    const snapshot = await db.collection(collectionName)
      .where('__name__', '>=', 'test-')
      .where('__name__', '<=', 'test-\uf8ff')
      .get();
    
    if (snapshot.empty) {
      console.log(`${GREEN}No test documents found in '${collectionName}'.${RESET}`);
      return 0;
    }
    
    // Delete documents in batches of 500
    const batchSize = 500;
    let batch = db.batch();
    let count = 0;
    let totalDeleted = 0;
    
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
      count++;
      totalDeleted++;
      
      // If batch is full, commit and start a new one
      if (count >= batchSize) {
        console.log(`${YELLOW}Committing batch of ${count} documents...${RESET}`);
        batch.commit();
        batch = db.batch();
        count = 0;
      }
    });
    
    // Commit any remaining documents
    if (count > 0) {
      console.log(`${YELLOW}Committing batch of ${count} documents...${RESET}`);
      await batch.commit();
    }
    
    console.log(`${GREEN}Successfully deleted ${totalDeleted} test documents from '${collectionName}'.${RESET}`);
    return totalDeleted;
  } catch (error) {
    console.error(`${RED}Error cleaning up '${collectionName}': ${error.message}${RESET}`);
    return 0;
  }
}

async function main() {
  console.log(`${YELLOW}Starting cleanup of test data...${RESET}`);
  
  // Collections to clean up
  const collections = [
    'bookings',  // Clean bookings first due to foreign key relationships
    'feedback',
    'classes',
    'studios',
    'users'
  ];
  
  let totalDeleted = 0;
  
  // Clean up each collection
  for (const collection of collections) {
    const deleted = await cleanupCollection(collection);
    totalDeleted += deleted;
  }
  
  console.log(`${GREEN}Cleanup complete. Deleted ${totalDeleted} test documents.${RESET}`);
  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error(`${RED}Fatal error: ${error.message}${RESET}`);
  process.exit(1);
}); 