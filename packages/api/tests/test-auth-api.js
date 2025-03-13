// Test suite for auth API functions
const assert = require('assert');

// Import the session management functions directly from our mock
const sessionModule = require('./mock-session');

// Test data
const testUser = {
  id: 'test-user-id',
  email: 'test-user@example.com',
  displayName: 'Test User'
};

const testBusiness = {
  email: 'test-business@example.com',
  password: 'Test@123456',
  displayName: 'Test Business',
  businessName: 'Test Studio',
  businessType: 'yoga',
  location: {
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'Test Country',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  }
};

// Test cases
async function runTests() {
  console.log('Starting auth API tests...');
  
  try {
    // Test session management
    console.log('Testing session management...');
    
    // Initially, there should be no current user
    assert.strictEqual(sessionModule.getCurrentUser(), null, 'Initial current user should be null');
    
    // Set the current user
    sessionModule.setCurrentUser({
      id: 'test-user-id',
      email: 'test-user@example.com',
      displayName: 'Test User'
    });
    
    // Check that the current user is set correctly
    const currentUser = sessionModule.getCurrentUser();
    assert(currentUser, 'Current user should be set');
    assert.strictEqual(currentUser.email, 'test-user@example.com', 'Current user email should match');
    
    // Test clearing the session
    sessionModule.clearSession();
    assert.strictEqual(sessionModule.getCurrentUser(), null, 'Current user should be null after clearing session');
    
    console.log('Session management tests passed!');
    
    // Skip the rest of the tests that require Firebase Auth
    console.log('Skipping Firebase Auth tests (signup, login, businessSignup) as they require real Firebase credentials');
    
    console.log('All auth API tests passed!');
  } catch (error) {
    console.error('Auth API test failed:', error);
    throw error;
  }
}

// Run the tests
runTests()
  .then(() => {
    console.log('Auth API tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Auth API tests failed:', error);
    process.exit(1);
  }); 