// Mock implementation of the users module for testing
let mockUserExists = true;

/**
 * Updates a user's profile
 * @param userId ID of the user to update
 * @param data UpdateUserRequest data from client
 * @returns Updated user object
 */
async function updateUser(userId, data) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!mockUserExists) {
    throw new Error('User not found');
  }
  
  // Return the updated user
  return {
    id: userId,
    email: 'test-user@example.com',
    displayName: data.displayName || 'Test User',
    contactInfo: data.contactInfo || {
      phone: '',
      address: ''
    },
    preferences: data.preferences || {}
  };
}

/**
 * Deletes a user account
 * @param userId ID of the user to delete
 * @returns Success message
 */
async function deleteUserAccount(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!mockUserExists) {
    throw new Error('User not found');
  }
  
  // Mark the user as deleted
  mockUserExists = false;
  
  return {
    success: true,
    message: 'User account deleted successfully'
  };
}

/**
 * Get a user by ID
 * @param userId ID of the user to retrieve
 * @returns User object
 */
async function getUserById(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!mockUserExists) {
    throw new Error('User not found');
  }
  
  return {
    id: userId,
    email: 'test-user@example.com',
    displayName: 'Test User'
  };
}

/**
 * Query users based on filters
 * @param queryParams Filter parameters
 * @returns Array of matching users
 */
async function queryUsers(queryParams) {
  return [
    {
      id: 'test-user-id',
      email: 'test-user@example.com',
      displayName: 'Test User'
    }
  ];
}

// Reset the mock state
function resetMock() {
  mockUserExists = true;
}

module.exports = {
  updateUser,
  deleteUserAccount,
  getUserById,
  queryUsers,
  resetMock
}; 