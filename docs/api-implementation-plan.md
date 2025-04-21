# Naadi API Implementation Plan

This guide outlines the steps to implement the API layers in the Naadi project, following the three-layer architecture:

1. **packages/api**: Core partner logic shared between apps
2. **naadi/app/api**: Server-side API endpoints using Expo's file routing
3. **naadi/api**: Client-side wrappers that call server endpoints

## Phase 1: Complete packages/api Implementation

### 1. Set Up Firebase Configuration (Completed)
- ✓ Configure Firebase Admin SDK
- ✓ Configure Firebase Client SDK
- ✓ Set up environment variables

### 2. Authentication Module
- Review and complete `src/auth/` endpoints:
  - Ensure `signup.ts`, `login.ts`, and `businessSignup.ts` are working properly
  - Test phone authentication and OAuth providers
  - Add session management functionality

### 3. User Management Module
- Implement CRUD operations in `src/users/`:
  - Complete profile update functionality
  - Add account deletion with proper cleanup

### 4. Studios Module
- Implement studio management in `src/studios/`:
  - Complete create, read, update, delete operations
  - Add location-based queries for map features
  - Implement search/filtering capabilities

### 5. Classes Module
- Implement class management in `src/classes/`:
  - Complete CRUD operations
  - Add scheduling functionality
  - Implement availability checking

### 6. Bookings Module
- Implement booking functionality in `src/bookings/`:
  - Add create, read, cancel operations
  - Implement payment handling
  - Add notification capabilities

### 7. Feedback Module
- Implement feedback functionality in `src/feedback/`:
  - Add submission and retrieval operations
  - Add rating aggregation

### 8. Testing
- Create test cases for each API functionality
- Test the entire API package as a standalone unit
- Build the package and ensure types are correctly exported

### 9. Documentation
- Update API reference documentation
- Document usage patterns

## Phase 2: Implement naadi-user/app/api and naadi-partner/app/api

### 1. Authentication Routes
- Implement server endpoints that use the packages/api functionality
- Create proper request/response handling
- Set up error management

### 2. User Routes
- Implement user management endpoints
- Add proper authorization checks

### 3. Studios Routes
- Implement studio-related endpoints
- Add partner-specific routes in naadi-partner
- Add user-specific routes in naadi-user

### 4. Classes Routes
- Implement class management endpoints
- Different access patterns for partner vs user apps

### 5. Bookings Routes
- Implement booking management endpoints
- Handle payment processing

### 6. Testing
- Test API endpoints with real requests
- Verify authentication and authorization
- Create comprehensive test suite for all API endpoints
- Implement mock API for isolated testing without Firebase dependencies
- Test authentication flows (signup, login, me, signout)
- Test user management including staff operations
- Test studio operations (list, create, get by ID, update, delete)
- Test class management (list, create, update, delete)
- Test booking operations (get by studio, get by ID, update status)
- Test feedback retrieval for studios and classes
- Implement central test runner to execute all tests
- Verify proper error handling for all endpoints
- Test authorization rules and access control

## Phase 3: Implement Client API Wrappers

### 1. Authentication Wrappers
- Create client-side authentication wrappers
- Implement token management
- Add session persistence

### 2. User Management Wrappers
- Create profile management wrappers
- Add UI integration

### 3. Studios Wrappers
- Implement studio browsing and management wrappers
- Create map integration helpers

### 4. Classes Wrappers
- Add class browsing and management functions
- Implement scheduling helpers

### 5. Bookings Wrappers
- Create booking and payment wrappers
- Add booking management functions

### 6. Testing
- Test complete flow from UI to API to database
- Verify proper error handling

## Implementation Tips

1. **Focus on One Module at a Time**:
   - Start with core authentication functionality
   - Then move to user management
   - Then implement studios and classes
   - Finally, add bookings and feedback

2. **Test as You Go**:
   - Create simple test scripts to validate each module
   - Use tools like Postman or write simple Node.js scripts
   - Implement mock API for endpoint testing without real database
   - Create automated tests for all API endpoints
   - Test authorization and access control
   - Run all tests before deploying changes

3. **Build Between Layers**:
   - Complete the first layer (packages/api) for a module
   - Then implement the server endpoints (app/api)
   - Finally create the client wrappers (api/)

4. **Security First**:
   - Always implement proper authentication and authorization
   - Validate inputs and sanitize outputs
   - Be careful with Firebase security rules

5. **Environment-Aware Code**:
   - Make your code work in both development and production
   - Use environment variables for configuration
   - Don't hardcode sensitive information 