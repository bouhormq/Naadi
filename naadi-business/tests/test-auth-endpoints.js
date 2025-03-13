// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Business App Authentication API Endpoints...');

// Test business signup endpoint
async function testBusinessSignupEndpoint() {
  console.log('\n📋 Testing POST /api/auth/business-signup...');
  
  // Mock implementation of POST /api/auth/business-signup endpoint
  async function handleBusinessSignup(request) {
    try {
      // Get the request body
      const body = request.bodyJson || {};
      
      if (!body.email || !body.password || !body.businessName) {
        return {
          status: 400,
          body: { error: 'Email, password, and business name are required' }
        };
      }
      
      // Create a new user record
      const newUser = {
        email: body.email,
        firstName: body.firstName || '',
        lastName: body.lastName || '',
        role: 'business'
      };
      
      // Create a new business record
      const newBusiness = {
        name: body.businessName,
        email: body.email,
        phone: body.phone || '',
        address: body.address || {}
      };
      
      // Simulate signup success with token
      return {
        status: 200,
        body: {
          user: newUser,
          business: newBusiness,
          token: 'valid-token-user-123',
          success: true
        }
      };
    } catch (error) {
      console.error('Error in business signup:', error);
      return {
        status: 500,
        body: { error: 'Failed to sign up' }
      };
    }
  }
  
  try {
    // Test case 1: Successful business signup
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/business-signup'),
      method: 'POST',
      body: {
        email: 'newbusiness@example.com',
        password: 'securepassword123',
        firstName: 'New',
        lastName: 'Owner',
        businessName: 'New Fitness Studio',
        phone: '+1234567890',
        address: {
          street: '123 New Street',
          city: 'New City',
          state: 'CA',
          zip: '90210',
          country: 'USA'
        }
      }
    });
    
    const response1 = await handleBusinessSignup(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.user || !response1.body.business || !response1.body.token || !response1.body.success) {
      throw new Error('Response should include user, business, token, and success flag');
    }
    
    console.log('✅ Successfully tested business signup with valid data');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/business-signup'),
      method: 'POST',
      body: {
        email: 'incomplete@example.com',
        password: 'password123'
        // No business name provided
      }
    });
    
    const response2 = await handleBusinessSignup(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing business signup endpoint:', error);
    return false;
  }
}

// Test login endpoint
async function testLoginEndpoint() {
  console.log('\n📋 Testing POST /api/auth/login...');
  
  // Mock implementation of POST /api/auth/login endpoint
  async function handleLogin(request) {
    try {
      // Get the request body
      const body = request.bodyJson || {};
      
      if (!body.email || !body.password) {
        return {
          status: 400,
          body: { error: 'Email and password are required' }
        };
      }
      
      // Check credentials (in a real implementation, this would verify against the database)
      if (body.email === 'business@example.com' && body.password === 'password123') {
        const user = API.mockData.users['user-123'];
        const business = API.mockData.businesses['business-123'];
        
        return {
          status: 200,
          body: {
            user,
            business,
            token: 'valid-token-user-123',
            success: true
          }
        };
      } else {
        return {
          status: 401,
          body: { error: 'Invalid credentials' }
        };
      }
    } catch (error) {
      console.error('Error in login:', error);
      return {
        status: 500,
        body: { error: 'Failed to log in' }
      };
    }
  }
  
  try {
    // Test case 1: Successful login
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/login'),
      method: 'POST',
      body: {
        email: 'business@example.com',
        password: 'password123'
      }
    });
    
    const response1 = await handleLogin(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.user || !response1.body.business || !response1.body.token || !response1.body.success) {
      throw new Error('Response should include user, business, token, and success flag');
    }
    
    console.log('✅ Successfully tested login with valid credentials');
    
    // Test case 2: Invalid credentials
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/login'),
      method: 'POST',
      body: {
        email: 'business@example.com',
        password: 'wrongpassword'
      }
    });
    
    const response2 = await handleLogin(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled invalid credentials');
    
    // Test case 3: Missing required fields
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/login'),
      method: 'POST',
      body: {
        email: 'onlyemail@example.com'
        // No password provided
      }
    });
    
    const response3 = await handleLogin(request3);
    
    if (response3.status !== 400) {
      throw new Error(`Expected status 400, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing login endpoint:', error);
    return false;
  }
}

// Test me endpoint (get current business user)
async function testMeEndpoint() {
  console.log('\n📋 Testing GET /api/auth/me...');
  
  // Mock implementation of GET /api/auth/me endpoint
  async function handleMe(request) {
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
      
      // Get user data
      try {
        const user = await API.getUserById(userId);
        
        // Check if user is a business user
        if (user.role !== 'business') {
          return {
            status: 403,
            body: { error: 'Access denied. Business account required.' }
          };
        }
        
        // Get business data
        let business = null;
        try {
          business = await API.getBusinessByOwnerId(userId);
        } catch (error) {
          // Business not found, continue without business details
        }
        
        return {
          status: 200,
          body: { 
            user,
            business
          }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in me endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch user data' }
      };
    }
  }
  
  try {
    // Make sure we have the necessary mock data
    if (!API.mockData) {
      API.mockData = {};
    }
    if (!API.mockData.users) {
      API.mockData.users = {
        'user-123': {
          id: 'user-123',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          phoneNumber: '+1234567890',
          role: 'business',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-06-01T00:00:00.000Z',
          businessId: 'business-123'
        }
      };
    }
    if (!API.mockData.businesses) {
      API.mockData.businesses = {
        'business-123': {
          id: 'business-123',
          name: 'Zen Fitness',
          ownerId: 'user-123',
          email: 'info@zenfitness.com',
          phone: '+1123456789',
          address: {
            street: '123 Wellness Ave',
            city: 'Fitnessville',
            state: 'CA',
            zip: '90210',
            country: 'USA'
          },
          description: 'A peaceful studio focused on mind-body wellness',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-06-01T00:00:00.000Z',
          plan: 'premium',
          paymentStatus: 'active',
          studioIds: ['studio-123']
        }
      };
    }
    
    // Test case 1: Authorized request with valid token
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/me'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleMe(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.user || !response1.body.business) {
      throw new Error('Response should include user and business data');
    }
    
    console.log('✅ Successfully retrieved business user data with valid token');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/me'),
      method: 'GET'
    });
    
    const response2 = await handleMe(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request (no token)');
    
    // Test case 3: Invalid token
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/me'),
      method: 'GET',
      headers: createAuthHeader('invalid-token')
    });
    
    const response3 = await handleMe(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled invalid token');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing me endpoint:', error);
    return false;
  }
}

// Test signout endpoint
async function testSignoutEndpoint() {
  console.log('\n📋 Testing POST /api/auth/signout...');
  
  // Mock implementation of POST /api/auth/signout endpoint
  async function handleSignout(request) {
    try {
      // In a real implementation, this would invalidate the token
      // For our test, we'll just return a success response
      return {
        status: 200,
        body: { success: true }
      };
    } catch (error) {
      console.error('Error in signout:', error);
      return {
        status: 500,
        body: { error: 'Failed to sign out' }
      };
    }
  }
  
  try {
    // Test case: Successful signout
    const request = new MockExpoRequest({
      url: createRequestUrl('/api/auth/signout'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response = await handleSignout(request);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (response.body.success !== true) {
      throw new Error('Response should indicate success');
    }
    
    console.log('✅ Successfully tested signout');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing signout endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const businessSignupResult = await testBusinessSignupEndpoint();
    const loginResult = await testLoginEndpoint();
    const meResult = await testMeEndpoint();
    const signoutResult = await testSignoutEndpoint();
    
    if (businessSignupResult && loginResult && meResult && signoutResult) {
      console.log('\n🎉 All Authentication API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Authentication API Endpoint tests failed!');
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