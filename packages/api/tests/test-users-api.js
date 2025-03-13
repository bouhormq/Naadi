// Test suite for users API functions
const assert = require('assert');

// Import the users functions directly from our mock
const usersModule = require('./mock-users');

// Test data
const testUser = {
  id: 'test-user-id',
  email: 'test-user@example.com',
  displayName: 'Test User'
};

const updatedUserData = {
  displayName: 'Updated Test User',
  contactInfo: {
    phone: '555-123-4567',
    address: '789 Test Ave, Test City, TC 98765'
  },
  preferences: {
    notifications: {
      email: true,
      push: false
    },
    theme: 'dark'
  }
};

// Test cases
async function runTests() {
  console.log('Starting users API tests...');
  
  try {
    console.log('Note: Using mock implementations for users functions');
    
    // Test updating user profile
    console.log('Testing user profile update...');
    const updateResult = await usersModule.updateUser(testUser.id, updatedUserData);
    
    assert(updateResult, 'Update should return user data');
    assert.strictEqual(updateResult.displayName, updatedUserData.displayName, 'Display name should be updated');
    assert(updateResult.contactInfo, 'Contact info should be included');
    assert.strictEqual(updateResult.contactInfo.phone, updatedUserData.contactInfo.phone, 'Phone number should be updated');
    assert.strictEqual(updateResult.contactInfo.address, updatedUserData.contactInfo.address, 'Address should be updated');
    assert(updateResult.preferences, 'Preferences should be included');
    assert.strictEqual(updateResult.preferences.theme, updatedUserData.preferences.theme, 'Theme preference should be updated');
    console.log('User profile update test passed!');
    
    // Reset mock state
    usersModule.resetMock();
    
    // Test user deletion
    console.log('Testing user account deletion...');
    const deleteResult = await usersModule.deleteUserAccount(testUser.id);
    
    assert(deleteResult.success, 'Deletion should be successful');
    console.log('User account deletion test passed!');
    
    // Test getting user by ID
    console.log('Testing get user by ID...');
    usersModule.resetMock();
    const user = await usersModule.getUserById(testUser.id);
    
    assert(user, 'Should return a user object');
    assert.strictEqual(user.id, testUser.id, 'User ID should match');
    assert.strictEqual(user.email, testUser.email, 'User email should match');
    console.log('Get user by ID test passed!');
    
    // Test querying users
    console.log('Testing query users...');
    const users = await usersModule.queryUsers({ displayName: 'Test' });
    
    assert(Array.isArray(users), 'Should return an array of users');
    assert(users.length > 0, 'Should return at least one user');
    console.log('Query users test passed!');
    
    console.log('All users API tests passed!');
  } catch (error) {
    console.error('Users API test failed:', error);
    throw error;
  }
}

// Run the tests
runTests()
  .then(() => {
    console.log('Users API tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Users API tests failed:', error);
    process.exit(1);
  }); 