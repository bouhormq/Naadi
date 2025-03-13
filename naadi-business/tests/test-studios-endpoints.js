// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import mock functions
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');
const API = require('./mock-api');

// Log the start of the test
console.log('🔍 Testing Business App Studios API Endpoints...');

// Test list studios endpoint
async function testListStudiosEndpoint() {
  console.log('\n📋 Testing GET /api/studios/list...');
  
  // Mock implementation of GET /api/studios/list endpoint
  async function handleListStudios(request) {
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
      
      // Get studios for this business
      const studios = await API.getDocuments('studios', { businessId: business.id });
      
      return {
        status: 200,
        body: studios
      };
    } catch (error) {
      console.error('Error in list studios endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to list studios' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully list studios
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/list'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleListStudios(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const data1 = response1.body;
    
    if (!Array.isArray(data1)) {
      throw new Error('Response should be an array of studios');
    }
    
    console.log('✅ Successfully listed studios');
    
    // Test case 2: Unauthorized access
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/list'),
      method: 'GET'
    });
    
    const response2 = await handleListStudios(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized access');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing list studios endpoint:', error);
    return false;
  }
}

// Test create studio endpoint
async function testCreateStudioEndpoint() {
  console.log('\n📋 Testing POST /api/studios/create...');
  
  // Mock implementation of POST /api/studios/create endpoint
  async function handleCreateStudio(request) {
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
      if (!body.name || !body.address) {
        return {
          status: 400,
          body: { error: 'Name and address are required' }
        };
      }
      
      // Create the studio
      const studioData = {
        businessId: business.id,
        name: body.name,
        address: body.address,
        phone: body.phone || '',
        email: body.email || '',
        description: body.description || '',
        amenities: body.amenities || [],
        hours: body.hours || {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      };
      
      const newStudio = await API.createDocument('studios', studioData);
      
      return {
        status: 201,
        body: newStudio
      };
    } catch (error) {
      console.error('Error in create studio endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to create studio' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully create a studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'New Test Studio',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zip: '12345',
          country: 'Test Country'
        },
        phone: '+1234567890',
        email: 'test@studio.com',
        description: 'A test studio'
      }
    });
    
    const response1 = await handleCreateStudio(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    const newStudio = response1.body;
    
    if (!newStudio.id || newStudio.name !== 'New Test Studio') {
      throw new Error('Response should include the new studio data');
    }
    
    console.log('✅ Successfully created a studio');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Incomplete Studio'
        // Missing address
      }
    });
    
    const response2 = await handleCreateStudio(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    // Test case 3: Unauthorized access
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/create'),
      method: 'POST',
      body: {
        name: 'Unauthorized Studio',
        address: {
          street: '123 Unauthorized St',
          city: 'Auth City',
          state: 'AU',
          zip: '54321',
          country: 'Auth Country'
        }
      }
    });
    
    const response3 = await handleCreateStudio(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized access');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing create studio endpoint:', error);
    return false;
  }
}

// Test get studio by ID endpoint
async function testGetStudioByIdEndpoint() {
  console.log('\n📋 Testing GET /api/studios/[id]...');
  
  // Mock implementation of GET /api/studios/[id] endpoint
  async function handleGetStudioById(request) {
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
      
      // Extract studio ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const studioId = pathParts[pathParts.length - 1];
      
      if (!studioId) {
        return {
          status: 400,
          body: { error: 'Studio ID is required' }
        };
      }
      
      // Get studio
      try {
        const studio = await API.getDocument('studios', studioId);
        
        // Get the business to verify ownership
        const business = await API.getBusinessByOwnerId(userId);
        
        if (studio.businessId !== business.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not own this studio.' }
          };
        }
        
        // Get related data
        const classes = await API.getDocuments('classes', { studioId: studio.id });
        
        return {
          status: 200,
          body: {
            ...studio,
            classes
          }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
    } catch (error) {
      console.error('Error in get studio by ID endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to get studio' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully get a studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetStudioById(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const studioData = response1.body;
    
    if (!studioData.id || !studioData.classes) {
      throw new Error('Response should include studio data with classes');
    }
    
    console.log('✅ Successfully retrieved a studio');
    
    // Test case 2: Non-existent studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/non-existent'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetStudioById(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get studio by ID endpoint:', error);
    return false;
  }
}

// Test update studio endpoint
async function testUpdateStudioEndpoint() {
  console.log('\n📋 Testing PUT /api/studios/update...');
  
  // Mock implementation of PUT /api/studios/update endpoint
  async function handleUpdateStudio(request) {
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
      
      // Get request body
      const body = await request.json();
      
      // Validate required fields
      if (!body.id) {
        return {
          status: 400,
          body: { error: 'Studio ID is required' }
        };
      }
      
      // Get the studio to verify ownership
      try {
        const studio = await API.getDocument('studios', body.id);
        
        // Get the business to verify ownership
        const business = await API.getBusinessByOwnerId(userId);
        
        if (studio.businessId !== business.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not own this studio.' }
          };
        }
        
        // Update studio data
        const updatedData = { ...body };
        delete updatedData.id; // Remove ID from update data
        
        const updatedStudio = await API.updateDocument('studios', body.id, updatedData);
        
        return {
          status: 200,
          body: updatedStudio
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
    } catch (error) {
      console.error('Error in update studio endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to update studio' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully update a studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        id: 'studio-123',
        name: 'Updated Studio Name',
        description: 'Updated description'
      }
    });
    
    const response1 = await handleUpdateStudio(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const updatedStudio = response1.body;
    
    if (updatedStudio.name !== 'Updated Studio Name') {
      throw new Error('Studio should be updated with new name');
    }
    
    console.log('✅ Successfully updated a studio');
    
    // Test case 2: Missing studio ID
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'No ID Studio',
        description: 'Missing ID'
      }
    });
    
    const response2 = await handleUpdateStudio(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing studio ID');
    
    // Test case 3: Non-existent studio
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        id: 'non-existent',
        name: 'Non-existent Studio'
      }
    });
    
    const response3 = await handleUpdateStudio(request3);
    
    if (response3.status !== 404) {
      throw new Error(`Expected status 404, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update studio endpoint:', error);
    return false;
  }
}

// Test delete studio endpoint
async function testDeleteStudioEndpoint() {
  console.log('\n📋 Testing DELETE /api/studios/delete...');
  
  // Mock implementation of DELETE /api/studios/delete endpoint
  async function handleDeleteStudio(request) {
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
      
      // Get query params
      const url = new URL(request.url);
      const studioId = url.searchParams.get('id');
      
      if (!studioId) {
        return {
          status: 400,
          body: { error: 'Studio ID is required' }
        };
      }
      
      // Get the studio to verify ownership
      try {
        const studio = await API.getDocument('studios', studioId);
        
        // Get the business to verify ownership
        const business = await API.getBusinessByOwnerId(userId);
        
        if (studio.businessId !== business.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not own this studio.' }
          };
        }
        
        // Delete the studio
        await API.deleteDocument('studios', studioId);
        
        return {
          status: 200,
          body: { success: true, message: 'Studio deleted successfully' }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
    } catch (error) {
      console.error('Error in delete studio endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to delete studio' }
      };
    }
  }
  
  try {
    // First, create a test studio that we can delete
    const testStudio = await API.createDocument('studios', {
      businessId: 'business-123',
      name: 'Test Studio to Delete',
      address: {
        street: '123 Delete St',
        city: 'Delete City',
        state: 'DS',
        zip: '12345',
        country: 'Delete Country'
      }
    });
    
    // Test case 1: Successfully delete a studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/delete', { id: testStudio.id }),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleDeleteStudio(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.success) {
      throw new Error('Response should indicate success');
    }
    
    console.log('✅ Successfully deleted a studio');
    
    // Test case 2: Missing studio ID
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/delete'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleDeleteStudio(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing studio ID');
    
    // Test case 3: Non-existent studio
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/delete', { id: 'non-existent' }),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleDeleteStudio(request3);
    
    if (response3.status !== 404) {
      throw new Error(`Expected status 404, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing delete studio endpoint:', error);
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
    
    const listResult = await testListStudiosEndpoint();
    const createResult = await testCreateStudioEndpoint();
    const getByIdResult = await testGetStudioByIdEndpoint();
    const updateResult = await testUpdateStudioEndpoint();
    const deleteResult = await testDeleteStudioEndpoint();
    
    if (listResult && createResult && getByIdResult && updateResult && deleteResult) {
      console.log('\n🎉 All Studios API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Studios API Endpoint tests failed!');
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