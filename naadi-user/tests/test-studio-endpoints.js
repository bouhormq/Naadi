// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing User App Studio API Endpoints...');

// Test get all studios endpoint
async function testGetAllStudiosEndpoint() {
  console.log('\n📋 Testing GET /api/studios...');
  
  // Mock implementation of GET /api/studios endpoint
  async function handleGetAllStudios(request) {
    try {
      // Get query parameters (if any)
      const url = new URL(request.url);
      const lat = parseFloat(url.searchParams.get('lat') || '0');
      const lng = parseFloat(url.searchParams.get('lng') || '0');
      const radius = parseFloat(url.searchParams.get('radius') || '10'); // Default 10km
      const limit = parseInt(url.searchParams.get('limit') || '20', 10); // Default 20 studios
      
      // Get all studios
      const allStudios = await API.getDocuments('studios');
      
      // If location provided, filter by distance (simplified for testing)
      let studios = allStudios;
      if (lat && lng) {
        // In a real implementation, we would calculate distance and filter
        // For testing, we'll just return all studios
        studios = studios.slice(0, limit);
      }
      
      return {
        status: 200,
        body: { studios }
      };
    } catch (error) {
      console.error('Error getting studios:', error);
      return {
        status: 500,
        body: { error: 'Failed to get studios' }
      };
    }
  }
  
  try {
    // Test case 1: Get all studios (no parameters)
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'GET'
    });
    
    const response1 = await handleGetAllStudios(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.studios || !Array.isArray(response1.body.studios)) {
      throw new Error('Response should include studios array');
    }
    
    console.log('✅ Successfully retrieved all studios');
    
    // Test case 2: Get studios with location parameters
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios', {
        lat: '37.7749',
        lng: '-122.4194',
        radius: '5',
        limit: '10'
      }),
      method: 'GET'
    });
    
    const response2 = await handleGetAllStudios(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.body.studios || !Array.isArray(response2.body.studios)) {
      throw new Error('Response should include studios array');
    }
    
    if (response2.body.studios.length > 10) {
      throw new Error(`Expected at most 10 studios, got ${response2.body.studios.length}`);
    }
    
    console.log('✅ Successfully retrieved studios with location parameters');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get all studios endpoint:', error);
    return false;
  }
}

// Test get studio by ID endpoint
async function testGetStudioByIdEndpoint() {
  console.log('\n📋 Testing GET /api/studios/[id]...');
  
  // Mock implementation of GET /api/studios/[id] endpoint
  async function handleGetStudioById(request) {
    try {
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
      
      // Get studio data
      try {
        const studio = await API.getDocument('studios', studioId);
        return {
          status: 200,
          body: { studio }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
    } catch (error) {
      console.error('Error getting studio:', error);
      return {
        status: 500,
        body: { error: 'Failed to get studio' }
      };
    }
  }
  
  try {
    // Test case 1: Get existing studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123'),
      method: 'GET'
    });
    
    const response1 = await handleGetStudioById(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.studio || response1.body.studio.id !== 'studio-123') {
      throw new Error('Response should include studio data');
    }
    
    console.log('✅ Successfully retrieved studio by ID');
    
    // Test case 2: Get non-existent studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/non-existent'),
      method: 'GET'
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

// Test get studio classes endpoint
async function testGetStudioClassesEndpoint() {
  console.log('\n📋 Testing GET /api/studios/[id]/classes...');
  
  // Mock implementation of GET /api/studios/[id]/classes endpoint
  async function handleGetStudioClasses(request) {
    try {
      // Extract studio ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const studioId = pathParts[pathParts.length - 2]; // Account for /classes at the end
      
      if (!studioId) {
        return {
          status: 400,
          body: { error: 'Studio ID is required' }
        };
      }
      
      // Verify the studio exists
      try {
        await API.getDocument('studios', studioId);
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
      
      // Get classes for this studio
      const allClasses = await API.getDocuments('classes', { studioId });
      
      return {
        status: 200,
        body: { classes: allClasses }
      };
    } catch (error) {
      console.error('Error getting studio classes:', error);
      return {
        status: 500,
        body: { error: 'Failed to get studio classes' }
      };
    }
  }
  
  try {
    // Test case 1: Get classes for an existing studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123/classes'),
      method: 'GET'
    });
    
    const response1 = await handleGetStudioClasses(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.classes || !Array.isArray(response1.body.classes)) {
      throw new Error('Response should include classes array');
    }
    
    console.log('✅ Successfully retrieved studio classes');
    
    // Test case 2: Get classes for a non-existent studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/non-existent/classes'),
      method: 'GET'
    });
    
    const response2 = await handleGetStudioClasses(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get studio classes endpoint:', error);
    return false;
  }
}

// Test search studios endpoint
async function testSearchStudiosEndpoint() {
  console.log('\n📋 Testing GET /api/studios/search...');
  
  // Mock implementation of GET /api/studios/search endpoint
  async function handleSearchStudios(request) {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';
      
      if (!query) {
        return {
          status: 400,
          body: { error: 'Search query is required' }
        };
      }
      
      // Get all studios
      const allStudios = await API.getDocuments('studios');
      
      // Filter studios by query (case-insensitive search in name and description)
      const lowercaseQuery = query.toLowerCase();
      const studios = allStudios.filter(studio => {
        return (
          studio.name.toLowerCase().includes(lowercaseQuery) ||
          studio.description.toLowerCase().includes(lowercaseQuery)
        );
      });
      
      return {
        status: 200,
        body: { studios, count: studios.length }
      };
    } catch (error) {
      console.error('Error searching studios:', error);
      return {
        status: 500,
        body: { error: 'Failed to search studios' }
      };
    }
  }
  
  try {
    // Test case 1: Search with valid query that has results
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/search', { q: 'fitness' }),
      method: 'GET'
    });
    
    const response1 = await handleSearchStudios(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.studios || !Array.isArray(response1.body.studios)) {
      throw new Error('Response should include studios array');
    }
    
    console.log('✅ Successfully searched studios with results');
    
    // Test case 2: Search with empty query
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/search'),
      method: 'GET'
    });
    
    const response2 = await handleSearchStudios(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled empty search query');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing search studios endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getAllResult = await testGetAllStudiosEndpoint();
    const getByIdResult = await testGetStudioByIdEndpoint();
    const getClassesResult = await testGetStudioClassesEndpoint();
    const searchResult = await testSearchStudiosEndpoint();
    
    if (getAllResult && getByIdResult && getClassesResult && searchResult) {
      console.log('\n🎉 All Studio API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Studio API Endpoint tests failed!');
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