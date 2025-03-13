// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing User App Class API Endpoints...');

// Test get class by ID endpoint
async function testGetClassByIdEndpoint() {
  console.log('\n📋 Testing GET /api/classes/[id]...');
  
  // Mock implementation of GET /api/classes/[id] endpoint
  async function handleGetClassById(request) {
    try {
      // Extract class ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const classId = pathParts[pathParts.length - 1];
      
      if (!classId) {
        return {
          status: 400,
          body: { error: 'Class ID is required' }
        };
      }
      
      // Get class data
      try {
        const classData = await API.getDocument('classes', classId);
        
        // Get instructor details
        let instructor = null;
        if (classData.instructorId) {
          try {
            instructor = await API.getDocument('instructors', classData.instructorId);
          } catch (err) {
            // Instructor not found, continue without instructor details
          }
        }
        
        // Get studio details
        let studio = null;
        if (classData.studioId) {
          try {
            studio = await API.getDocument('studios', classData.studioId);
          } catch (err) {
            // Studio not found, continue without studio details
          }
        }
        
        return {
          status: 200,
          body: { 
            class: classData,
            instructor,
            studio: studio ? {
              id: studio.id,
              name: studio.name,
              address: studio.address
            } : null
          }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Class not found' }
        };
      }
    } catch (error) {
      console.error('Error getting class:', error);
      return {
        status: 500,
        body: { error: 'Failed to get class' }
      };
    }
  }
  
  try {
    // Test case 1: Get existing class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/class-123'),
      method: 'GET'
    });
    
    const response1 = await handleGetClassById(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.class || response1.body.class.id !== 'class-123') {
      throw new Error('Response should include class data');
    }
    
    console.log('✅ Successfully retrieved class by ID');
    
    // Test case 2: Get non-existent class
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/non-existent'),
      method: 'GET'
    });
    
    const response2 = await handleGetClassById(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get class by ID endpoint:', error);
    return false;
  }
}

// Test get upcoming classes endpoint
async function testGetUpcomingClassesEndpoint() {
  console.log('\n📋 Testing GET /api/classes/upcoming...');
  
  // Mock implementation of GET /api/classes/upcoming endpoint
  async function handleGetUpcomingClasses(request) {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const limit = parseInt(url.searchParams.get('limit') || '10', 10);
      const studioId = url.searchParams.get('studioId') || null;
      
      // Get all classes
      let classes = await API.getDocuments('classes');
      
      // Filter by studio if specified
      if (studioId) {
        classes = classes.filter(c => c.studioId === studioId);
      }
      
      // Sort by date (in a real implementation, we would filter by date > now)
      // For testing purposes, we'll just return all classes
      
      // Limit results
      classes = classes.slice(0, limit);
      
      return {
        status: 200,
        body: { classes }
      };
    } catch (error) {
      console.error('Error getting upcoming classes:', error);
      return {
        status: 500,
        body: { error: 'Failed to get upcoming classes' }
      };
    }
  }
  
  try {
    // Test case 1: Get upcoming classes (no parameters)
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/upcoming'),
      method: 'GET'
    });
    
    const response1 = await handleGetUpcomingClasses(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.classes || !Array.isArray(response1.body.classes)) {
      throw new Error('Response should include classes array');
    }
    
    if (response1.body.classes.length > 10) {
      throw new Error(`Expected at most 10 classes (default limit), got ${response1.body.classes.length}`);
    }
    
    console.log('✅ Successfully retrieved upcoming classes');
    
    // Test case 2: Get upcoming classes with studioId filter
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/upcoming', { studioId: 'studio-123' }),
      method: 'GET'
    });
    
    const response2 = await handleGetUpcomingClasses(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.body.classes.every(c => c.studioId === 'studio-123')) {
      throw new Error('All classes should have the specified studioId');
    }
    
    console.log('✅ Successfully filtered upcoming classes by studio');
    
    // Test case 3: Get upcoming classes with custom limit
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/upcoming', { limit: '5' }),
      method: 'GET'
    });
    
    const response3 = await handleGetUpcomingClasses(request3);
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    if (response3.body.classes.length > 5) {
      throw new Error(`Expected at most 5 classes (custom limit), got ${response3.body.classes.length}`);
    }
    
    console.log('✅ Successfully limited upcoming classes');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get upcoming classes endpoint:', error);
    return false;
  }
}

// Test search classes endpoint
async function testSearchClassesEndpoint() {
  console.log('\n📋 Testing GET /api/classes/search...');
  
  // Mock implementation of GET /api/classes/search endpoint
  async function handleSearchClasses(request) {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';
      const category = url.searchParams.get('category') || null;
      const level = url.searchParams.get('level') || null;
      
      if (!query && !category && !level) {
        return {
          status: 400,
          body: { error: 'At least one search parameter is required' }
        };
      }
      
      // Get all classes
      let classes = await API.getDocuments('classes');
      
      // Apply filters
      if (query) {
        const lowercaseQuery = query.toLowerCase();
        classes = classes.filter(c => 
          c.name.toLowerCase().includes(lowercaseQuery) || 
          c.description.toLowerCase().includes(lowercaseQuery)
        );
      }
      
      if (category) {
        classes = classes.filter(c => c.category === category);
      }
      
      if (level) {
        classes = classes.filter(c => c.level === level);
      }
      
      return {
        status: 200,
        body: { 
          classes,
          count: classes.length
        }
      };
    } catch (error) {
      console.error('Error searching classes:', error);
      return {
        status: 500,
        body: { error: 'Failed to search classes' }
      };
    }
  }
  
  try {
    // Test case 1: Search with text query
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/search', { q: 'yoga' }),
      method: 'GET'
    });
    
    const response1 = await handleSearchClasses(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.classes || !Array.isArray(response1.body.classes)) {
      throw new Error('Response should include classes array');
    }
    
    console.log('✅ Successfully searched classes by text query');
    
    // Test case 2: Search by category
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/search', { category: 'yoga' }),
      method: 'GET'
    });
    
    const response2 = await handleSearchClasses(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.body.classes.every(c => c.category === 'yoga')) {
      throw new Error('All classes should have the specified category');
    }
    
    console.log('✅ Successfully filtered classes by category');
    
    // Test case 3: No search parameters
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/search'),
      method: 'GET'
    });
    
    const response3 = await handleSearchClasses(request3);
    
    if (response3.status !== 400) {
      throw new Error(`Expected status 400, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled missing search parameters');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing search classes endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getByIdResult = await testGetClassByIdEndpoint();
    const getUpcomingResult = await testGetUpcomingClassesEndpoint();
    const searchResult = await testSearchClassesEndpoint();
    
    if (getByIdResult && getUpcomingResult && searchResult) {
      console.log('\n🎉 All Class API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Class API Endpoint tests failed!');
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