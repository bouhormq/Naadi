// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Log the start of the test
console.log('🔍 Testing @naadi/api core functions...');

// Try importing core modules
try {
  // Import the firestore utilities first
  const { db } = require('../dist/utils/firestore');
  console.log('✅ Successfully imported firestore utilities');
  
  // Try importing from index (which should export everything)
  const apiIndex = require('../dist/src/index');
  console.log('✅ Successfully imported API index:', Object.keys(apiIndex));
  
  // Check if Firestore connection is established
  console.log('🔍 Testing Firestore connection via db object...');
  if (db) {
    console.log('✅ Firestore connection established');
    
    // Test a simple Firestore query to make sure it's working
    db.collection('test').get()
      .then(snapshot => {
        console.log(`✅ Firestore query successful - received ${snapshot.size} documents`);
        console.log('🎉 All core API functionality is available!');
      })
      .catch(error => {
        console.error('❌ Error querying Firestore:', error);
        process.exit(1);
      });
  } else {
    console.error('❌ Firestore connection not established');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error importing API modules:', error.message);
  
  // Give a helpful message about what might be wrong
  console.log('\n🔧 Troubleshooting tips:');
  console.log('1. Make sure you\'ve run "npm run build:api" to build the package');
  console.log('2. Check the module paths in your imports');
  console.log('3. Verify the package structure matches what\'s expected in dist/');
  
  process.exit(1);
} 