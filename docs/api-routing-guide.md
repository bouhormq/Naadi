# Naadi API Routing System

This document explains how the Naadi platform implements API routes using Expo's file-based routing system.

## Architecture Overview

Naadi uses a three-layer architecture for APIs:

1. **Shared Logic Layer** (`packages/api`): Contains core business logic shared between apps
2. **Server API Layer** (`app/api`): Server-side API endpoints using Expo's file routing
3. **Client API Layer** (`api/`): Client-side wrappers that call server endpoints

## 1. Shared Logic Layer (`packages/api`)

This layer contains core business logic that can be used by both apps. It's structured as follows:

```
packages/api/
├── src/
│   ├── auth/
│   │   ├── signup.ts
│   │   ├── login.ts
│   │   └── ...
│   ├── bookings/
│   ├── studios/
│   └── ...
```

These modules export functions that implement the core business logic, e.g.:

```typescript
// packages/api/src/auth/signup.ts
import { SignupRequest, AuthResponse } from '@naadi/types';

export async function signup(data: SignupRequest): Promise<AuthResponse> {
  // Implementation of core signup logic
}
```

## 2. Server API Layer (`app/api`)

This layer uses Expo's file-based routing to create server-side API endpoints. Files placed in the `app/api` directory automatically become API routes.

### Structure

```
naadi-user/app/api/
├── auth/
│   ├── signup.ts
│   ├── login.ts
│   └── ...
├── bookings/
│   ├── create.ts
│   └── ...
└── ...

naadi-business/app/api/
├── auth/
│   ├── businessSignup.ts
│   └── ...
├── studios/
│   ├── create.ts
│   └── ...
└── ...
```

### Implementation Pattern

Each API route file exports HTTP method handlers (GET, POST, etc.):

```typescript
// naadi-user/app/api/auth/signup.ts
import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { signup } from '@naadi/api';

export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
  try {
    const body = await request.json();
    const response = await signup(body);
    return new ExpoResponse(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Error handling
  }
}
```

## 3. Client API Layer (`api/`)

This layer provides client-side wrappers that call the server API endpoints, handling request/response formatting and error management.

### Structure

```
naadi-user/api/
├── auth/
│   ├── email.ts
│   ├── phone.ts
│   └── ...
├── bookings/
└── ...

naadi-business/api/
├── auth/
│   ├── email.ts
│   ├── business.ts
│   └── ...
├── studios/
└── ...
```

### Implementation Pattern

Client API functions handle the fetch calls to the server endpoints:

```typescript
// naadi-user/api/auth/email.ts
import { SignupRequest, AuthResponse } from '@naadi/types';

export async function signupWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Signup failed');
    }
    
    return await response.json();
  } catch (error) {
    // Error handling
    throw error;
  }
}
```

## How It All Works Together

1. A user interaction triggers a client API call (e.g., `signupWithEmail()` from the client API layer)
2. The client API function sends a fetch request to the appropriate server endpoint (`/api/auth/signup`)
3. The server endpoint (in `app/api/auth/signup.ts`) processes the request
4. The server endpoint calls the shared logic (`signup()` from `packages/api`)
5. The shared logic performs the business operations
6. The result flows back through the layers to the user interface

## Benefits of This Approach

1. **Code Reuse**: Core logic is written once in `packages/api` and used by both apps
2. **Type Safety**: Consistent types across all layers
3. **Separation of Concerns**: 
   - Shared layer: Business logic
   - Server layer: HTTP handling, auth verification
   - Client layer: UI integration, error handling
4. **Development Efficiency**: Changes to core logic affect both apps automatically

## Environment Setup

For Firebase Admin SDK to work in the server endpoints, set these environment variables:

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
```

## Adding New API Routes

1. **Shared Logic**: Add core functionality to `packages/api`
2. **Server Endpoint**: Create file in `app/api` with HTTP method handlers
3. **Client Wrapper**: Add client API function that calls the server endpoint

Example:
```typescript
// 1. packages/api/src/studios/featured.ts
export async function getFeaturedStudios() {
  // Implementation
}

// 2. naadi-user/app/api/studios/featured.ts
export async function GET(request: ExpoRequest): Promise<ExpoResponse> {
  // Call getFeaturedStudios() and return response
}

// 3. naadi-user/api/studios/index.ts
export async function getFeaturedStudios() {
  // Call /api/studios/featured endpoint
}
```

## Testing API Endpoints

Naadi implements a comprehensive testing approach for API endpoints to ensure reliability and correctness.

### Testing Architecture

```
naadi-business/tests/
├── mock-api.js                 # Mock API implementation
├── run-all-tests.js            # Test runner
├── test-auth-endpoints.js      # Authentication tests
├── test-analytics-endpoints.js # Analytics tests
├── test-users-endpoints.js     # User management tests
├── test-studios-endpoints.js   # Studio management tests
├── test-classes-endpoints.js   # Class management tests
├── test-bookings-endpoints.js  # Booking tests
└── test-feedback-endpoints.js  # Feedback tests
```

### Mock API Approach

The testing system uses a mock API implementation that simulates Firebase functionality:

```javascript
// Example from mock-api.js
const API = {
  mockData: {
    users: {},
    studios: {},
    classes: {},
    bookings: {},
    feedback: {}
  },
  
  getDocument: (collection, id) => {
    return API.mockData[collection][id];
  },
  
  getUserIdFromToken: (token) => {
    // Parse token to extract user ID
  }
};
```

### Test Implementation Pattern

Each test file follows a consistent pattern:

1. Mock endpoint implementation
2. Test function for each endpoint
3. Run all tests function

```javascript
// Example test pattern
// Mock endpoint
function mockGetStudioByIdEndpoint(req, res) {
  // Authentication and authorization checks
  // Return appropriate response
}

// Test function
async function testGetStudioByIdEndpoint() {
  // Setup test data
  // Make request
  // Verify response
  // Log success
}

// Run all tests
async function runAllTests() {
  // Initialize test data
  // Run test functions
  // Log summary
}
```

### Running Tests

Tests can be run individually or all together using the run-all-tests.js script:

```
node tests/run-all-tests.js
```

### Test Coverage

The test suite covers:

1. Authentication flows (signup, login, me, signout)
2. User management including staff operations
3. Studio operations (list, create, get by ID, update, delete)
4. Class management (list, create, update, delete)
5. Booking operations (get by studio, get by ID, update status)
6. Feedback retrieval for studios and classes
7. Analytics endpoints
8. Error handling for various scenarios
9. Authorization rules and access control

### Benefits of This Approach

1. **Isolation**: Tests run without real Firebase dependencies
2. **Speed**: No network calls or database interactions required
3. **Comprehensive**: All endpoints and error scenarios are tested
4. **Reusable**: Mock API can be extended for new endpoints
5. **Maintainable**: Consistent pattern makes tests easy to understand and update 