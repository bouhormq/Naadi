# Authentication and User Management Modules

This document provides detailed information about the Authentication and User Management modules in the Naadi API. It covers implementation details, usage patterns, testing strategies, and integration guidelines.

## Table of Contents

1. [Authentication Module](#authentication-module)
   - [Session Management](#session-management)
   - [Standard Authentication](#standard-authentication)
   - [OAuth Providers](#oauth-providers)
   - [Phone Authentication](#phone-authentication)
   - [Testing](#authentication-testing)

2. [User Management Module](#user-management-module)
   - [User Profile Management](#user-profile-management)
   - [Account Management](#account-management)
   - [User Queries](#user-queries)
   - [Testing](#user-management-testing)

3. [Integration Guidelines](#integration-guidelines)
   - [Client-Side Integration](#client-side-integration)
   - [Server-Side Integration](#server-side-integration)

## Authentication Module

The Authentication module (`packages/api/src/auth`) provides functionality for user authentication, session management, and user identity verification across the Naadi platform.

### Session Management

The session management component (`packages/api/src/auth/session.ts`) maintains the current user's authentication state and provides utilities for token management.

#### Key Functions

- `getCurrentUser()`: Retrieves the currently authenticated user object or null if no user is authenticated.
- `setCurrentUser(user)`: Sets the current user object in the session.
- `getAuthToken()`: Retrieves the Firebase Auth token for the current user.
- `getUserIdFromToken(token)`: Extracts and verifies a user ID from a Firebase Auth token.
- `refreshUserData(userId)`: Fetches the latest user data from Firestore.
- `clearSession()`: Clears the current user session.

#### Usage Example

```typescript
import { getCurrentUser, setCurrentUser, clearSession } from '@naadi/api';

// Check if user is logged in
const currentUser = getCurrentUser();
if (currentUser) {
  console.log(`User ${currentUser.displayName} is logged in`);
} else {
  console.log('No user is logged in');
}

// Log out the current user
clearSession();
```

### Standard Authentication

The module supports standard email/password authentication methods:

- `signup`: Creates a new user account with email and password
- `login`: Authenticates an existing user with email and password
- `businessSignup`: Creates a new business account with additional business details

### OAuth Providers

Support for third-party authentication providers:

- `signInWithGoogle`: Authenticates a user with Google OAuth
- `signInWithFacebook`: Authenticates a user with Facebook OAuth

### Phone Authentication

Phone number-based authentication:

- `sendPhoneVerification`: Sends a verification code to a user's phone
- `verifyPhone`: Verifies the code sent to the user's phone

### Authentication Testing

The authentication module includes comprehensive tests in `packages/api/tests/test-auth-api.js` and `packages/api/tests/test-session-api.js`. 

For testing purposes, a mock implementation is provided in `packages/api/tests/mock-session.js` that simulates the behavior of the actual session management module without requiring Firebase initialization.

#### Mock Implementation

The mock implementation provides the same interface as the real session management module, making it easy to test without Firebase credentials:

```javascript
// Example usage in tests
const sessionModule = require('./mock-session');

// Test session management
sessionModule.setCurrentUser({
  id: 'test-user-id',
  email: 'test-user@example.com',
  displayName: 'Test User'
});

const currentUser = sessionModule.getCurrentUser();
// Assert that current user is set correctly
```

## User Management Module

The User Management module (`packages/api/src/users`) provides functionality for managing user profiles, accounts, and searching for users.

### User Profile Management

Functions for updating and retrieving user profile information:

- `updateUser(userId, data)`: Updates a user's profile information
- `getUserById(userId)`: Retrieves a user's profile by their ID

#### Usage Example

```typescript
import { updateUser, getUserById } from '@naadi/api';

// Update user profile
const updatedUser = await updateUser('user123', {
  displayName: 'New Name',
  contactInfo: {
    phone: '555-123-4567',
    address: '123 Main St'
  },
  preferences: {
    notifications: {
      email: true,
      push: false
    }
  }
});

// Get user profile
const user = await getUserById('user123');
```

### Account Management

Functions for managing user accounts:

- `deleteUserAccount(userId)`: Deletes a user account and performs cleanup

### User Queries

Functions for searching and filtering users:

- `queryUsers(queryParams)`: Searches for users based on filter criteria

#### Query Parameters

- `displayName`: Filter by display name (prefix search)
- `email`: Filter by exact email match
- `isBusiness`: Filter by business account status
- `limit`: Maximum number of results to return (default: 20)

#### Usage Example

```typescript
import { queryUsers } from '@naadi/api';

// Find all business users
const businessUsers = await queryUsers({ isBusiness: true });

// Find users by name prefix
const usersNamedJohn = await queryUsers({ displayName: 'John' });

// Find a specific user by email
const specificUser = await queryUsers({ email: 'user@example.com' });
```

### User Management Testing

The user management module includes comprehensive tests in `packages/api/tests/test-users-api.js`.

For testing purposes, a mock implementation is provided in `packages/api/tests/mock-users.js` that simulates the behavior of the actual user management module without requiring Firebase.

#### Mock Implementation

The mock user management implementation provides test-friendly versions of all user management functions:

```javascript
// Example usage in tests
const usersModule = require('./mock-users');

// Test updating a user
const updateResult = await usersModule.updateUser('user123', {
  displayName: 'New Name'
});

// Test deleting a user
const deleteResult = await usersModule.deleteUserAccount('user123');

// Test querying users
const users = await usersModule.queryUsers({ displayName: 'Test' });
```

## Integration Guidelines

### Client-Side Integration

When integrating the authentication and user management modules in client applications:

1. Initialize the session at app startup:
   ```typescript
   import { getCurrentUser, refreshUserData } from '@naadi/api';
   
   // Check for existing session
   const currentUser = getCurrentUser();
   if (currentUser) {
     // Refresh the user data
     await refreshUserData(currentUser.id);
   }
   ```

2. Handle login/signup flows:
   ```typescript
   import { login, signup, setCurrentUser } from '@naadi/api';
   
   // Login
   try {
     const user = await login(email, password);
     setCurrentUser(user);
     // Navigate to home screen
   } catch (error) {
     // Handle login error
   }
   
   // Signup
   try {
     const user = await signup(email, password, displayName);
     setCurrentUser(user);
     // Navigate to home screen
   } catch (error) {
     // Handle signup error
   }
   ```

3. Manage user profiles:
   ```typescript
   import { updateUser } from '@naadi/api';
   
   // Update profile
   try {
     const updatedUser = await updateUser(userId, {
       displayName: 'New Name',
       // ... other fields
     });
     // Update UI with new user info
   } catch (error) {
     // Handle update error
   }
   ```

### Server-Side Integration

When using the authentication and user management modules in server-side code:

1. Verify tokens in API routes:
   ```typescript
   import { getUserIdFromToken } from '@naadi/api';
   
   export default async function handler(req, res) {
     try {
       const token = req.headers.authorization?.split(' ')[1];
       if (!token) {
         return res.status(401).json({ error: 'Unauthorized' });
       }
       
       const userId = await getUserIdFromToken(token);
       // Process the authenticated request
     } catch (error) {
       return res.status(401).json({ error: 'Invalid token' });
     }
   }
   ```

2. Handle user management operations:
   ```typescript
   import { getUserById, updateUser } from '@naadi/api';
   
   export default async function handler(req, res) {
     try {
       // Get the user
       const user = await getUserById(req.query.userId);
       
       // Update the user if needed
       if (req.method === 'PUT') {
         const updatedUser = await updateUser(req.query.userId, req.body);
         return res.status(200).json(updatedUser);
       }
       
       return res.status(200).json(user);
     } catch (error) {
       return res.status(error.statusCode || 500).json({ error: error.message });
     }
   }
   ```
