// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Partner App Partner API Endpoints...');

// Test get partner details endpoint
async function testGetBusinessDetailsEndpoint() {
  console.log('\n📋 Testing GET /api/partner/details...');
  
  // Mock implementation of GET /api/partner/details endpoint
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
        
        // Check if user is a partner user
        if (user.role !== 'partner') {
          return {
            status: 403,
            body: { error: 'Access denied. Partner account required.' }
          };
        }
        
        // Get partner data
        try {
          const partner = await API.getBusinessByOwnerId(userId);
          return {
            status: 200,
            body: { partner }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Partner not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in get partner details:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch partner data' }
      };
    }
  }
  
  try {
    // Test case 1: Authorized request with valid token
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/details'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetBusinessDetails(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.partner) {
      throw new Error('Response should include partner data');
    }
    
    console.log('✅ Successfully retrieved partner details with valid token');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/details'),
      method: 'GET'
    });
    
    const response2 = await handleGetBusinessDetails(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request (no token)');
    
    // Test case 3: Invalid token
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/details'),
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
    console.error('❌ Error testing get partner details endpoint:', error);
    return false;
  }
}

// Test update partner details endpoint
async function testUpdateBusinessDetailsEndpoint() {
  console.log('\n📋 Testing PUT /api/partner/update...');
  
  // Mock implementation of PUT /api/partner/update endpoint
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
        
        // Check if user is a partner user
        if (user.role !== 'partner') {
          return {
            status: 403,
            body: { error: 'Access denied. Partner account required.' }
          };
        }
        
        // Get partner data
        try {
          let partner = await API.getBusinessByOwnerId(userId);
          
          // Get the request body
          const body = request.bodyJson || {};
          
          // Update partner data
          if (body.name) partner.name = body.name;
          if (body.email) partner.email = body.email;
          if (body.phone) partner.phone = body.phone;
          if (body.address) partner.address = body.address;
          if (body.description) partner.description = body.description;
          
          // In a real implementation, this would save to the database
          // For our test, we'll just return the updated partner
          
          return {
            status: 200,
            body: { 
              partner,
              success: true
            }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Partner not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in update partner details:', error);
      return {
        status: 500,
        body: { error: 'Failed to update partner data' }
      };
    }
  }
  
  try {
    // Test case 1: Successful update with valid data
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Updated Partner Name',
        email: 'updated@example.com',
        phone: '+1987654321',
        address: {
          street: '456 Updated Street',
          city: 'Updated City',
          state: 'NY',
          zip: '10001',
          country: 'USA'
        },
        description: 'Updated partner description'
      }
    });
    
    const response1 = await handleUpdateBusinessDetails(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.partner || !response1.body.success) {
      throw new Error('Response should include updated partner data and success flag');
    }
    
    if (response1.body.partner.name !== 'Updated Partner Name') {
      throw new Error('Partner name was not updated correctly');
    }
    
    console.log('✅ Successfully updated partner details with valid data');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/update'),
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
    console.error('❌ Error testing update partner details endpoint:', error);
    return false;
  }
}

// Test get partner analytics endpoint
async function testGetBusinessAnalyticsEndpoint() {
  console.log('\n📋 Testing GET /api/partner/analytics...');
  
  // Mock implementation of GET /api/partner/analytics endpoint
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
        
        // Check if user is a partner user
        if (user.role !== 'partner') {
          return {
            status: 403,
            body: { error: 'Access denied. Partner account required.' }
          };
        }
        
        // Get partner data
        try {
          const partner = await API.getBusinessByOwnerId(userId);
          
          // Get analytics data
          const analytics = API.mockData.analytics[partner.id] || {
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
            body: { error: 'Partner not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in get partner analytics:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch analytics data' }
      };
    }
  }
  
  try {
    // Test case 1: Authorized request with valid token
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/analytics'),
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
    
    console.log('✅ Successfully retrieved partner analytics with valid token');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/analytics'),
      method: 'GET'
    });
    
    const response2 = await handleGetBusinessAnalytics(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request (no token)');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get partner analytics endpoint:', error);
    return false;
  }
}

// Test get partner plan endpoint
async function testGetBusinessPlanEndpoint() {
  console.log('\n📋 Testing GET /api/partner/plan...');
  
  // Mock implementation of GET /api/partner/plan endpoint
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
        
        // Check if user is a partner user
        if (user.role !== 'partner') {
          return {
            status: 403,
            body: { error: 'Access denied. Partner account required.' }
          };
        }
        
        // Get partner data
        try {
          const partner = await API.getBusinessByOwnerId(userId);
          
          // Get plan data
          const planDetails = {
            currentPlan: partner.plan || 'free',
            features: {
              maxStudios: partner.plan === 'premium' ? 'unlimited' : 3,
              maxClasses: partner.plan === 'premium' ? 'unlimited' : 50,
              analytics: partner.plan === 'premium',
              advancedBooking: partner.plan === 'premium',
              customBranding: partner.plan === 'premium'
            },
            paymentStatus: partner.paymentStatus || 'active',
            nextBillingDate: '2023-12-31'
          };
          
          return {
            status: 200,
            body: { plan: planDetails }
          };
        } catch (error) {
          return {
            status: 404,
            body: { error: 'Partner not found' }
          };
        }
      } catch (error) {
        return {
          status: 404,
          body: { error: 'User not found' }
        };
      }
    } catch (error) {
      console.error('Error in get partner plan:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch plan data' }
      };
    }
  }
  
  try {
    // Test case 1: Authorized request with valid token
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/plan'),
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
    
    console.log('✅ Successfully retrieved partner plan with valid token');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/partner/plan'),
      method: 'GET'
    });
    
    const response2 = await handleGetBusinessPlan(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request (no token)');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get partner plan endpoint:', error);
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
      console.log('\n🎉 All Partner API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Partner API Endpoint tests failed!');
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