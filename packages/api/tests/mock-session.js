// Mock implementation of the session module for testing
let currentUser = null;

/**
 * Get the currently authenticated user
 * @returns User object or null if not authenticated
 */
function getCurrentUser() {
  return currentUser;
}

/**
 * Set the currently authenticated user
 * @param user User object from authentication
 */
function setCurrentUser(user) {
  currentUser = user;
}

/**
 * Get the Firebase Auth token for the current user
 * @returns Promise with the ID token string
 */
async function getAuthToken() {
  if (!currentUser) {
    return null;
  }
  return 'mock-token';
}

/**
 * Get user ID from Firebase Auth token
 * @param token Firebase Auth token
 * @returns User ID string
 */
async function getUserIdFromToken(token) {
  if (!token) {
    throw new Error('Invalid or expired token');
  }
  return 'test-user-id';
}

/**
 * Fetch fresh user data from Firestore
 * @param userId User ID to fetch
 * @returns Full user object
 */
async function refreshUserData(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  const userData = {
    id: userId,
    email: 'test-user@example.com',
    displayName: 'Test User'
  };
  
  setCurrentUser(userData);
  
  return userData;
}

/**
 * Clear the current user session
 */
function clearSession() {
  currentUser = null;
}

module.exports = {
  getCurrentUser,
  setCurrentUser,
  getAuthToken,
  getUserIdFromToken,
  refreshUserData,
  clearSession
}; 