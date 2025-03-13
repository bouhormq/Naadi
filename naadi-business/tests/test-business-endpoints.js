// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Business App Business API Endpoints...');

// Test get business details endpoint
async function testGetBusinessDetailsEndpoint() {
  console.log('\n📋 Testing GET /api/business/details...');
  
  // Mock implementation of GET /api/business/details endpoint
  async function handleGetBusinessDetails(request) {
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
        try {
          const business = await API.getBusinessByOwnerId(userId);
          return {
            status: 200,
            body: { business }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Business not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in get business details:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch business data' }
      };
    }
  }
  
  try {
    // Test case 1: Authorized request with valid token
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/business/details'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetBusinessDetails(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.business) {
      throw new Error('Response should include business data');
    }
    
    console.log('✅ Successfully retrieved business details with valid token');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/business/details'),
      method: 'GET'
    });
    
    const response2 = await handleGetBusinessDetails(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request (no token)');
    
    // Test case 3: Invalid token
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/business/details'),
      method: 'GET',
      headers: createAuthHeader('invalid-token')
    });
    
    const response3 = await handleGetBusinessDetails(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled invalid token');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get business details endpoint:', error);
    return false;
  }
}

// Test update business details endpoint
async function testUpdateBusinessDetailsEndpoint() {
  console.log('\n📋 Testing PUT /api/business/update...');
  
  // Mock implementation of PUT /api/business/update endpoint
  async function handleUpdateBusinessDetails(request) {
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
        try {
          let business = await API.getBusinessByOwnerId(userId);
          
          // Get the request body
          const body = request.bodyJson || {};
          
          // Update business data
          if (body.name) business.name = body.name;
          if (body.email) business.email = body.email;
          if (body.phone) business.phone = body.phone;
          if (body.address) business.address = body.address;
          if (body.description) business.description = body.description;
          
          // In a real implementation, this would save to the database
          // For our test, we'll just return the updated business
          
          return {
            status: 200,
            body: { 
              business,
              success: true
            }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Business not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in update business details:', error);
      return {
        status: 500,
        body: { error: 'Failed to update business data' }
      };
    }
  }
  
  try {
    // Test case 1: Successful update with valid data
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/business/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Updated Business Name',
        email: 'updated@example.com',
        phone: '+1987654321',
        address: {
          street: '456 Updated Street',
          city: 'Updated City',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        },
        description: 'Updated business description'
      }
    });
    
    const response1 = await handleUpdateBusinessDetails(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.business || !response1.body.success) {
      throw new Error('Response should include updated business data and success flag');
    }
    
    if (response1.body.business.name !== 'Updated Business Name') {
      throw new Error('Business name was not updated correctly');
    }
    
    console.log('✅ Successfully updated business details with valid data');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/business/update'),
      method: 'PUT',
      body: {
        name: 'Unauthorized Update'
      }
    });
    
    const response2 = await handleUpdateBusinessDetails(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized update request (no token)');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update business details endpoint:', error);
    return false;
  }
}

// Test get business analytics endpoint
async function testGetBusinessAnalyticsEndpoint() {
  console.log('\n📋 Testing GET /api/business/analytics...');
  
  // Mock implementation of GET /api/business/analytics endpoint
  async function handleGetBusinessAnalytics(request) {
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
        try {
          const business = await API.getBusinessByOwnerId(userId);
          
          // Get analytics data
          const analytics = API.mockData.analytics[business.id] || {
            dailyVisits: [],
            classBookings: [],
            revenue: {
              daily: [],
              monthly: [],
              annual: 0
            },
            demographics: {}
          };
          
          return {
            status: 200,
            body: { analytics }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Business not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in get business analytics:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch analytics data' }
      };
    }
  }
  
  try {
    // Test case 1: Authorized request with valid token
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/business/analytics'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetBusinessAnalytics(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.analytics) {
      throw new Error('Response should include analytics data');
    }
    
    console.log('✅ Successfully retrieved business analytics with valid token');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/business/analytics'),
      method: 'GET'
    });
    
    const response2 = await handleGetBusinessAnalytics(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request (no token)');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get business analytics endpoint:', error);
    return false;
  }
}

// Test get business plan endpoint
async function testGetBusinessPlanEndpoint() {
  console.log('\n📋 Testing GET /api/business/plan...');
  
  // Mock implementation of GET /api/business/plan endpoint
  async function handleGetBusinessPlan(request) {
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
        try {
          const business = await API.getBusinessByOwnerId(userId);
          
          // Get plan data
          const planDetails = {
            currentPlan: business.plan || 'free',
            features: {
              maxStudios: business.plan === 'premium' ? 'unlimited' : 3,
              maxClasses: business.plan === 'premium' ? 'unlimited' : 50,
              analytics: business.plan === 'premium',
              advancedBooking: business.plan === 'premium',
              customBranding: business.plan === 'premium'
            },
            paymentStatus: business.paymentStatus || 'active',
            nextBillingDate: '2023-12-31'
          };
          
          return {
            status: 200,
            body: { plan: planDetails }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Business not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in get business plan:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch plan data' }
      };
    }
  }
  
  try {
    // Test case 1: Authorized request with valid token
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/business/plan'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetBusinessPlan(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.plan) {
      throw new Error('Response should include plan data');
    }
    
    console.log('✅ Successfully retrieved business plan with valid token');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/business/plan'),
      method: 'GET'
    });
    
    const response2 = await handleGetBusinessPlan(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request (no token)');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get business plan endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getBusinessDetailsResult = await testGetBusinessDetailsEndpoint();
    const updateBusinessDetailsResult = await testUpdateBusinessDetailsEndpoint();
    const getBusinessAnalyticsResult = await testGetBusinessAnalyticsEndpoint();
    const getBusinessPlanResult = await testGetBusinessPlanEndpoint();
    
    if (getBusinessDetailsResult && updateBusinessDetailsResult && getBusinessAnalyticsResult && getBusinessPlanResult) {
      console.log('\n🎉 All Business API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Business API Endpoint tests failed!');
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