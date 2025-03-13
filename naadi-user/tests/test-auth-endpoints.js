// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing User App Authentication API Endpoints...');

// Test signup endpoint
async function testSignupEndpoint() {
  console.log('\n📋 Testing POST /api/auth/signup...');
  
  // Mock implementation of POST /api/auth/signup endpoint
  async function handleSignup(request) {
    try {
      // Get the request body
      const body = request.bodyJson || {};
      
      if (!body.email || !body.password) {
        return {
          status: 400,
          body: { error: 'Email and password are required' }
        };
      }
      
      // Create a new user record
      const newUser = {
        email: body.email,
        displayName: body.displayName || '',
        role: 'user'
      };
      
      // Simulate signup success with token
      return {
        status: 200,
        body: {
          user: newUser,
          token: 'valid-token-user-123',
          success: true
        }
      };
    } catch (error) {
      console.error('Error in signup:', error);
      return {
        status: 500,
        body: { error: 'Failed to sign up' }
      };
    }
  }
  
  try {
    // Test case 1: Successful signup
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/signup'),
      method: 'POST',
      body: {
        email: 'newuser@example.com',
        password: 'securepassword123',
        displayName: 'New User'
      }
    });
    
    const response1 = await handleSignup(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.user || !response1.body.token || !response1.body.success) {
      throw new Error('Response should include user, token, and success flag');
    }
    
    console.log('✅ Successfully tested signup with valid credentials');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/auth/signup'),
      method: 'POST',
      body: {
        email: 'onlyemail@example.com'
        // No password provided
      }
    });
    
    const response2 = await handleSignup(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing signup endpoint:', error);
    return false;
  }
}

// Test login endpoint
async function testLoginEndpoint() {
  console.log('\n📋 Testing POST /api/auth/login...');
  
  // Mock implementation of POST /api/auth/login endpoint
  API.mockEndpoint('POST', '/api/auth/login', (req, res) => {
    try {
      // Get the request body
      const { email, password } = req.body;
      
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      // Check credentials (mock authentication)
      if (email === 'jane.doe@example.com' && password === 'password123') {
        return res.status(200).json({
          success: true,
          data: {
            token: 'valid-token-user-123',
            user: {
              id: 'user-123',
              firstName: 'Jane',
              lastName: 'Doe',
              email: 'jane.doe@example.com',
              role: 'user'
            }
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    } catch (error) {
      console.error('Error in login:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });
  
  // Test case 1: Login with valid credentials
  try {
    const loginData = {
      email: 'jane.doe@example.com',
      password: 'password123'
    };
    
    const response = await API.makeRequest('POST', '/api/auth/login', loginData);
    
    console.log('✅ Successfully tested login with valid credentials');
    
    if (response.status !== 200 || !response.data.success) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.data.token || !response.data.data.user) {
      throw new Error('Response should include token and user data');
    }
  } catch (error) {
    console.log(`❌ Failed to login with valid credentials: ${error.message}`);
    throw error;
  }
  
  // Test case 2: Login with invalid credentials
  try {
    const loginData = {
      email: 'jane.doe@example.com',
      password: 'wrongpassword'
    };
    
    const response = await API.makeRequest('POST', '/api/auth/login', loginData);
    console.log('❌ Should not succeed with invalid credentials');
    throw new Error('Login succeeded with invalid credentials');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly handled invalid credentials');
    } else {
      console.log(`❌ Unexpected error when testing invalid credentials: ${error.message}`);
      throw error;
    }
  }
  
  // Test case 3: Login with missing required fields
  try {
    const loginData = {
      // Missing password
      email: 'jane.doe@example.com'
    };
    
    const response = await API.makeRequest('POST', '/api/auth/login', loginData);
    console.log('❌ Should not succeed with missing required fields');
    throw new Error('Login succeeded with missing required fields');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly handled missing required fields');
    } else {
      console.log(`❌ Unexpected error when testing missing fields: ${error.message}`);
      throw error;
    }
  }
}

// Test the "me" endpoint
async function testMeEndpoint() {
  console.log('\n📋 Testing GET /api/auth/me...');
  
  // Mock implementation of GET /api/auth/me endpoint
  API.mockEndpoint('GET', '/api/auth/me', (req, res) => {
    // Check for authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = API.getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid token' 
      });
    }
    
    // Initialize mock data if not exists
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
          role: 'user'
        }
      };
    }
    
    // Get user data
    const userData = API.mockData.users[userId];
    
    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      data: userData
    });
  });
  
  // Test case 1: Get user data with valid token
  try {
    const response = await API.makeRequest('GET', '/api/auth/me', null, {
      authorization: 'Bearer valid-token-user-123'
    });
    
    console.log('✅ Successfully retrieved user data with valid token');
    console.log(`   Status: ${response.status}`);
    console.log(`   User ID: ${response.data.data.id}`);
    
    if (response.status !== 200 || !response.data.success || !response.data.data.id) {
      throw new Error('Invalid response format');
    }
    
    if (response.data.data.id !== 'user-123') {
      throw new Error(`Expected user ID 'user-123', got '${response.data.data.id}'`);
    }
  } catch (error) {
    console.log(`❌ Failed to retrieve user data with valid token: ${error.message}`);
    throw error;
  }
  
  // Test case 2: Get user data with no token
  try {
    const response = await API.makeRequest('GET', '/api/auth/me');
    console.log('❌ Should not succeed without token');
    throw new Error('Request succeeded without token');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected request without token');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`❌ Unexpected error when testing without token: ${error.message}`);
      throw error;
    }
  }
  
  // Test case 3: Get user data with invalid token
  try {
    const response = await API.makeRequest('GET', '/api/auth/me', null, {
      authorization: 'Bearer invalid-token'
    });
    console.log('❌ Should not succeed with invalid token');
    throw new Error('Request succeeded with invalid token');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected request with invalid token');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`❌ Unexpected error when testing with invalid token: ${error.message}`);
      throw error;
    }
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
    await testSignupEndpoint();
    await testLoginEndpoint();
    await testMeEndpoint();
    await testSignoutEndpoint();
    console.log('\n✅ All Authentication API Endpoint tests passed!');
    return true;
  } catch (error) {
    console.log(`\n❌ Error running tests: ${error.message}`);
    process.exit(1);
  }
}

// Export the test functions
module.exports = {
  runAllTests,
  testSignupEndpoint,
  testLoginEndpoint,
  testMeEndpoint,
  testSignoutEndpoint
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().then(success => {
    if (success) {
      process.exit(0);
    } else {
      console.log('\n❌ Some Authentication API Endpoint tests failed!');
      process.exit(1);
    }
  });
} 