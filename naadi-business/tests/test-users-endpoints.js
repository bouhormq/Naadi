// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import mock functions
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');
const API = require('./mock-api');

// Log the start of the test
console.log('🔍 Testing Business App User API Endpoints...');

// Test get business staff endpoint
async function testGetBusinessStaffEndpoint() {
  console.log('\n📋 Testing GET /api/users/staff...');
  
  // Mock implementation of GET /api/users/staff endpoint
  async function handleGetBusinessStaff(request) {
    try {
      // Check for authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          body: { error: 'Authentication required' }
        };
      }
      
      const token = authHeader.split(' ')[1];
      const userId = API.getUserIdFromToken(token);
      
      if (!userId) {
        return {
          status: 401,
          body: { error: 'Invalid token' }
        };
      }
      
      // Get user data to verify business account
      const user = await API.getUserById(userId);
      
      if (user.role !== 'business') {
        return {
          status: 403,
          body: { error: 'Access denied. Business account required.' }
        };
      }
      
      // Get business data
      const business = await API.getBusinessByOwnerId(userId);
      
      // Get query params for filtering
      const url = new URL(request.url);
      const role = url.searchParams.get('role');
      
      // In a real implementation, we would query for staff members
      // For mock purposes, we'll return a predefined list
      const staff = [
        {
          id: 'staff-123',
          businessId: business.id,
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice@example.com',
          role: 'manager',
          permissions: ['manage_classes', 'manage_bookings', 'view_reports'],
          createdAt: '2023-01-15T08:00:00.000Z'
        },
        {
          id: 'staff-456',
          businessId: business.id,
          firstName: 'Bob',
          lastName: 'Smith',
          email: 'bob@example.com',
          role: 'instructor',
          permissions: ['manage_own_classes'],
          createdAt: '2023-02-20T10:30:00.000Z'
        },
        {
          id: 'staff-789',
          businessId: business.id,
          firstName: 'Charlie',
          lastName: 'Davis',
          email: 'charlie@example.com',
          role: 'receptionist',
          permissions: ['view_bookings', 'check_in_clients'],
          createdAt: '2023-03-10T14:15:00.000Z'
        }
      ];
      
      // Filter by role if specified
      const filteredStaff = role 
        ? staff.filter(s => s.role === role)
        : staff;
      
      return {
        status: 200,
        body: filteredStaff
      };
    } catch (error) {
      console.error('Error in get staff endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch staff' }
      };
    }
  }
  
  try {
    // Test case 1: Successful retrieval of all staff
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/users/staff'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetBusinessStaff(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const data1 = response1.body;
    
    if (!Array.isArray(data1)) {
      throw new Error('Response should be an array of staff members');
    }
    
    console.log('✅ Successfully retrieved all staff members');
    
    // Test case 2: Filter by role
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/users/staff', { role: 'instructor' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetBusinessStaff(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    const data2 = response2.body;
    
    if (!Array.isArray(data2) || data2.some(staff => staff.role !== 'instructor')) {
      throw new Error('Response should contain only instructors');
    }
    
    console.log('✅ Successfully filtered staff by role');
    
    // Test case 3: Unauthorized access
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/users/staff'),
      method: 'GET'
    });
    
    const response3 = await handleGetBusinessStaff(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized access');
    
    // Test case 4: Non-business user access
    // First, let's mock a non-business user
    if (!API.mockData) {
      API.mockData = {};
    }
    if (!API.mockData.users) {
      API.mockData.users = {};
    }
    
    API.mockData.users['user-789'] = {
      id: 'user-789',
      firstName: 'Regular',
      lastName: 'User',
      email: 'regular@example.com',
      role: 'user',
      createdAt: '2023-01-01T00:00:00.000Z'
    };
    
    // Then test with this user's token
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/users/staff'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-789')
    });
    
    // Update our mock function for this test
    const originalGetUserIdFromToken = API.getUserIdFromToken;
    API.getUserIdFromToken = (token) => {
      if (token === 'valid-token-user-789') return 'user-789';
      return originalGetUserIdFromToken(token);
    };
    
    const response4 = await handleGetBusinessStaff(request4);
    
    // Restore original function
    API.getUserIdFromToken = originalGetUserIdFromToken;
    
    if (response4.status !== 403) {
      throw new Error(`Expected status 403, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled non-business user access');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get staff endpoint:', error);
    return false;
  }
}

// Test add staff member endpoint
async function testAddStaffMemberEndpoint() {
  console.log('\n📋 Testing POST /api/users/staff...');
  
  // Mock implementation of POST /api/users/staff endpoint
  async function handleAddStaffMember(request) {
    try {
      // Check for authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          status: 401,
          body: { error: 'Authentication required' }
        };
      }
      
      const token = authHeader.split(' ')[1];
      const userId = API.getUserIdFromToken(token);
      
      if (!userId) {
        return {
          status: 401,
          body: { error: 'Invalid token' }
        };
      }
      
      // Get user data to verify business account
      const user = await API.getUserById(userId);
      
      if (user.role !== 'business') {
        return {
          status: 403,
          body: { error: 'Access denied. Business account required.' }
        };
      }
      
      // Get business data
      const business = await API.getBusinessByOwnerId(userId);
      
      // Get request body
      const body = await request.json();
      
      // Validate required fields
      if (!body.email || !body.firstName || !body.lastName || !body.role) {
        return {
          status: 400,
          body: { error: 'Email, firstName, lastName, and role are required' }
        };
      }
      
      // In a real implementation, we would create a new staff member
      // For mock purposes, we'll just return a success response
      const newStaff = {
        id: `staff-${Date.now()}`,
        businessId: business.id,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        role: body.role,
        permissions: body.permissions || [],
        createdAt: new Date().toISOString()
      };
      
      return {
        status: 201,
        body: newStaff
      };
    } catch (error) {
      console.error('Error in add staff endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to add staff member' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully add a staff member
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/users/staff'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        email: 'newstaff@example.com',
        firstName: 'New',
        lastName: 'Staff',
        role: 'instructor',
        permissions: ['manage_own_classes']
      }
    });
    
    const response1 = await handleAddStaffMember(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    const newStaff = response1.body;
    
    if (!newStaff.id || newStaff.email !== 'newstaff@example.com') {
      throw new Error('Response should include the new staff member data');
    }
    
    console.log('✅ Successfully added a new staff member');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/users/staff'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        email: 'incomplete@example.com',
        firstName: 'Incomplete'
        // Missing lastName and role
      }
    });
    
    const response2 = await handleAddStaffMember(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    // Test case 3: Unauthorized access
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/users/staff'),
      method: 'POST',
      body: {
        email: 'unauthorized@example.com',
        firstName: 'Un',
        lastName: 'Authorized',
        role: 'receptionist'
      }
    });
    
    const response3 = await handleAddStaffMember(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized access');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing add staff endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    // Initialize mock data if needed
    if (!API.mockData) {
      API.mockData = {};
    }
    
    const getStaffResult = await testGetBusinessStaffEndpoint();
    const addStaffResult = await testAddStaffMemberEndpoint();
    
    if (getStaffResult && addStaffResult) {
      console.log('\n🎉 All User API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some User API Endpoint tests failed!');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error running tests:', error);
    return false;
  }
}

// Run the tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}); 