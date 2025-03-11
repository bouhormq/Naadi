// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Log the start of the test
console.log('🔍 Testing @naadi/api package imports and functionality...');

// Import the Firestore utilities - this will test if Firebase is initialized correctly
const { db, getDocument, createDocument, updateDocument, deleteDocument } = require('../dist/utils/firestore');

// A function to test our Firebase connection with actual API operations
async function testApiOperations() {
  try {
    console.log('✅ Successfully imported Firestore utilities from @naadi/api');
    
    // Create a test document
    const testData = {
      name: 'Test Studio',
      description: 'A test studio for API testing',
      createdAt: new Date().toISOString()
    };
    
    console.log('📝 Creating a test document...');
    const docId = await createDocument('test-studios', testData);
    console.log(`✅ Test document created with ID: ${docId}`);
    
    // Read the document
    console.log('🔍 Reading the test document...');
    const doc = await getDocument('test-studios', docId);
    console.log('✅ Test document read successfully:', JSON.stringify(doc, null, 2));
    
    // Update the document
    console.log('✏️ Updating the test document...');
    await updateDocument('test-studios', docId, { 
      description: 'Updated description',
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Test document updated successfully');
    
    // Read the updated document
    console.log('🔍 Reading the updated document...');
    const updatedDoc = await getDocument('test-studios', docId);
    console.log('✅ Updated document read successfully:', JSON.stringify(updatedDoc, null, 2));
    
    // Delete the document
    console.log('🗑️ Deleting the test document...');
    await deleteDocument('test-studios', docId);
    console.log('✅ Test document deleted successfully');
    
    console.log('🎉 All API operations tested successfully!');
  } catch (error) {
    console.error('❌ Error testing API operations:', error);
    process.exit(1);
  }
}

// Run the test
testApiOperations()
  .then(() => {
    console.log('✅ @naadi/api package is working correctly!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error testing @naadi/api package:', error);
    process.exit(1);
  }); 