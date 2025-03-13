// Test suite for session management API functions
const assert = require('assert');

// Import the session management functions directly from our mock
const sessionModule = require('./mock-session');

// Test data
const testUser = {
  id: 'test-user-id',
  email: 'test-user@example.com',
  displayName: 'Test User'
};

// Test cases
async function runTests() {
  console.log('Starting session API tests...');
  
  try {
    // Test session management
    console.log('Testing session management...');
    
    // Initially, there should be no current user
    assert.strictEqual(sessionModule.getCurrentUser(), null, 'Initial current user should be null');
    
    // Set the current user
    sessionModule.setCurrentUser(testUser);
    
    // Check that the current user is set correctly
    const currentUser = sessionModule.getCurrentUser();
    assert(currentUser, 'Current user should be set after signup');
    assert.strictEqual(currentUser.email, testUser.email, 'Current user email should match');
    
    // Test clearing the session
    sessionModule.clearSession();
    assert.strictEqual(sessionModule.getCurrentUser(), null, 'Current user should be null after clearing session');
    
    console.log('Session management tests passed!');
  } catch (error) {
    console.error('Session API test failed:', error);
    throw error;
  }
}

// Run the tests
runTests()
  .then(() => {
    console.log('Session API tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Session API tests failed:', error);
    process.exit(1);
  }); 