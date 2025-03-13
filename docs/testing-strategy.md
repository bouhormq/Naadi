# Naadi Testing Strategy

This document outlines the testing approach for the Naadi platform, focusing on API endpoint testing with a mock implementation.

## 1. Testing Philosophy

The Naadi testing strategy is built around these key principles:

1. **Isolation**: Tests should run without external dependencies
2. **Completeness**: All API endpoints should be tested
3. **Reliability**: Tests should be deterministic and repeatable
4. **Maintainability**: Tests should be easy to understand and update
5. **Speed**: Tests should execute quickly to support rapid development

## 2. Testing Architecture

### 2.1 Directory Structure

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

### 2.2 Mock API Implementation

The mock API simulates Firebase functionality without requiring actual Firebase connections:

```javascript
// Simplified example from mock-api.js
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
    // Extract user ID from token
    // Handles both dot-separated and custom formats
  },
  
  mockEndpoint: (handler) => {
    return async (path, options = {}) => {
      const req = {
        url: path,
        method: options.method || 'GET',
        headers: options.headers || {},
        body: options.body
      };
      
      const res = {
        status: null,
        body: null,
        setStatus: function(status) { this.status = status; return this; },
        json: function(data) { this.body = data; return this; }
      };
      
      await handler(req, res);
      return res;
    };
  },
  
  makeRequest: async (endpoint, path, options = {}) => {
    const response = await endpoint(path, options);
    return {
      status: response.status,
      body: response.body,
      ok: response.status >= 200 && response.status < 300
    };
  }
};
```

## 3. Test Implementation Pattern

Each test file follows a consistent pattern:

### 3.1 Mock Endpoint Implementation

```javascript
// Example mock endpoint
function mockGetStudiosEndpoint(req, res) {
  // Check authorization
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.setStatus(401).json({ error: 'Not authenticated' });
  }
  
  try {
    // Get user from token
    const userId = API.getUserIdFromToken(token);
    const user = API.getDocument('users', userId);
    
    if (!user || user.role !== 'business') {
      return res.setStatus(403).json({ error: 'Not authorized' });
    }
    
    // Get studios for this business
    const studios = Object.values(API.mockData.studios)
      .filter(studio => studio.businessId === userId);
    
    return res.setStatus(200).json({ studios });
  } catch (error) {
    return res.setStatus(500).json({ error: 'Server error' });
  }
}
```

### 3.2 Test Function

```javascript
// Example test function
async function testGetStudiosEndpoint() {
  console.log('  Testing GET /api/studios/list endpoint...');
  
  // Set up test data
  const businessUser = {
    id: 'user-123',
    email: 'business@example.com',
    role: 'business'
  };
  
  const studio1 = {
    id: 'studio-1',
    businessId: 'user-123',
    name: 'Test Studio 1'
  };
  
  const studio2 = {
    id: 'studio-2',
    businessId: 'user-123',
    name: 'Test Studio 2'
  };
  
  API.mockData.users['user-123'] = businessUser;
  API.mockData.studios['studio-1'] = studio1;
  API.mockData.studios['studio-2'] = studio2;
  
  // Create endpoint handler
  const getStudiosEndpoint = API.mockEndpoint(mockGetStudiosEndpoint);
  
  // Test successful request
  const token = `user-123.token123`;
  const response = await API.makeRequest(
    getStudiosEndpoint,
    '/api/studios/list',
    { 
      method: 'GET',
      headers: { authorization: `Bearer ${token}` }
    }
  );
  
  // Verify response
  if (response.status !== 200) {
    throw new Error(`Expected status 200, got ${response.status}`);
  }
  
  if (!response.body.studios || response.body.studios.length !== 2) {
    throw new Error('Expected 2 studios in response');
  }
  
  console.log('  ✓ GET /api/studios/list endpoint test passed');
}
```

### 3.3 Run All Tests Function

```javascript
// Example run all tests function
async function runAllTests() {
  console.log('Starting Studios API Endpoint tests...');
  
  try {
    // Initialize test data
    API.mockData = {
      users: {},
      studios: {},
      classes: {},
      bookings: {},
      feedback: {}
    };
    
    // Run all test functions
    await testGetStudiosEndpoint();
    await testCreateStudioEndpoint();
    await testGetStudioByIdEndpoint();
    await testUpdateStudioEndpoint();
    await testDeleteStudioEndpoint();
    
    console.log('All Studios API Endpoint tests passed!');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// Execute tests
runAllTests();
```

## 4. Test Coverage

The test suite provides comprehensive coverage of:

### 4.1 Authentication Endpoints
- Signup (new user registration)
- Login (authentication)
- Me (current user info)
- Signout (session termination)

### 4.2 User Management Endpoints
- Get staff (retrieve staff members)
- Create staff (add new staff)

### 4.3 Studio Management Endpoints
- List studios (get all studios for a business)
- Create studio (add new studio)
- Get studio by ID (retrieve specific studio)
- Update studio (modify studio details)
- Delete studio (remove studio)

### 4.4 Class Management Endpoints
- List classes (get all classes for a studio)
- Create class (add new class)
- Update class (modify class details)
- Delete class (remove class)

### 4.5 Booking Endpoints
- Get bookings by studio (retrieve bookings for a studio)
- Get booking by ID (retrieve specific booking)
- Update booking status (modify booking)

### 4.6 Feedback Endpoints
- Get feedback for studio (retrieve all feedback for a studio)
- Get feedback for class (retrieve feedback for a specific class)

### 4.7 Analytics Endpoints
- Get daily analytics
- Get weekly analytics
- Get financial analytics

## 5. Running Tests

Tests can be run individually or collectively:

### 5.1 Running All Tests

```bash
node tests/run-all-tests.js
```

### 5.2 Running Specific Test Files

```bash
node tests/test-auth-endpoints.js
node tests/test-studios-endpoints.js
# etc.
```

## 6. Error Scenarios Tested

The test suite covers various error scenarios:

1. **Authentication Errors**:
   - Missing authentication token
   - Invalid token format
   - Expired tokens

2. **Authorization Errors**:
   - Incorrect user role
   - Accessing resources not owned by the user

3. **Validation Errors**:
   - Missing required fields
   - Invalid data types
   - Malformed requests

4. **Resource Errors**:
   - Non-existent resources
   - Already existing resources
   - Resource conflicts

## 7. Benefits of This Approach

1. **Development Speed**: Fast, isolated tests that don't require deployment
2. **Confidence**: Comprehensive coverage ensures correctness
3. **Documentation**: Tests serve as documentation for expected behavior
4. **Regression Prevention**: Quickly catch breaking changes
5. **Isolation**: No need for real Firebase, databases, or networks
6. **Consistent Environment**: Same test behavior regardless of environment

## 8. Future Enhancements

1. **Integration Tests**: Add end-to-end tests with real Firebase
2. **Test Coverage Reporting**: Add tools to measure code coverage
3. **Performance Tests**: Add load and stress testing
4. **Continuous Integration**: Automate test runs in CI/CD pipeline
5. **Property-Based Testing**: Generate random inputs to find edge cases 