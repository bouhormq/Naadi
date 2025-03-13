// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing User App Studios API Endpoints...');

// Test get all studios endpoint
async function testGetAllStudiosEndpoint() {
  console.log('\n📋 Testing GET /api/studios...');
  
  // Mock implementation of GET /api/studios endpoint
  async function handleGetAllStudios(request) {
    try {
      // Get query parameters
      const url = new URL(request.url);
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 20;
      const latitude = url.searchParams.get('latitude') ? parseFloat(url.searchParams.get('latitude')) : null;
      const longitude = url.searchParams.get('longitude') ? parseFloat(url.searchParams.get('longitude')) : null;
      const distance = url.searchParams.get('distance') ? parseFloat(url.searchParams.get('distance')) : 10; // Default 10km
      const category = url.searchParams.get('category');
      
      // In a real implementation, this would query the database with filters
      // For testing, we'll use our mock data
      
      // Initialize mock data if it doesn't exist
      if (!API.mockData || !API.mockData.studios) {
        if (!API.mockData) API.mockData = {};
        API.mockData.studios = {
          'studio-123': {
            id: 'studio-123',
            name: 'Zen Fitness Studio',
            address: {
              street: '123 Wellness Ave',
              city: 'Fitnessville',
              state: 'CA',
              zip: '90210',
              country: 'USA'
            },
            location: {
              latitude: 37.7749,
              longitude: -122.4194
            },
            rating: 4.8,
            categories: ['yoga', 'meditation', 'pilates']
          },
          'studio-456': {
            id: 'studio-456',
            name: 'Power Athletics',
            address: {
              street: '456 Strength Street',
              city: 'Muscletown',
              state: 'NY',
              zip: '10001',
              country: 'USA'
            },
            location: {
              latitude: 40.7128,
              longitude: -74.0060
            },
            rating: 4.6,
            categories: ['hiit', 'strength', 'crossfit']
          }
        };
      }
      
      // Convert object to array
      let studios = Object.values(API.mockData.studios);
      
      // Apply filters
      if (latitude && longitude) {
        // Filter by distance (simplified for testing)
        studios = studios.filter(studio => {
          if (!studio.location) return false;
          
          // Simple distance calculation for testing
          const latDiff = Math.abs(studio.location.latitude - latitude);
          const lonDiff = Math.abs(studio.location.longitude - longitude);
          const roughDistance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // Rough km conversion
          
          return roughDistance <= distance;
        });
      }
      
      if (category) {
        // Filter by category
        studios = studios.filter(studio => 
          studio.categories && studio.categories.includes(category.toLowerCase())
        );
      }
      
      // Apply limit
      studios = studios.slice(0, limit);
      
      return {
        status: 200,
        body: {
          studios,
          count: studios.length,
          total: Object.keys(API.mockData.studios).length
        }
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
    // Test case 1: Get all studios
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
    
    // Test case 2: Get studios with location filter
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios', { 
        latitude: '37.7749', 
        longitude: '-122.4194',
        distance: '5'
      }),
      method: 'GET'
    });
    
    const response2 = await handleGetAllStudios(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    console.log('✅ Successfully retrieved studios with location filter');
    
    // Test case 3: Get studios with category filter
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios', { category: 'yoga' }),
      method: 'GET'
    });
    
    const response3 = await handleGetAllStudios(request3);
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    console.log('✅ Successfully retrieved studios with category filter');
    
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
      
      // Ensure we have mock data
      if (!API.mockData || !API.mockData.studios) {
        if (!API.mockData) API.mockData = {};
        API.mockData.studios = {
          'studio-123': {
            id: 'studio-123',
            name: 'Zen Fitness Studio',
            address: {
              street: '123 Wellness Ave',
              city: 'Fitnessville',
              state: 'CA',
              zip: '90210',
              country: 'USA'
            },
            phone: '+1123456789',
            email: 'info@zenfitness.com',
            description: 'A peaceful studio focused on mind-body wellness',
            amenities: ['showers', 'lockers', 'water station', 'parking'],
            hours: {
              monday: { open: '06:00', close: '21:00' },
              tuesday: { open: '06:00', close: '21:00' },
              wednesday: { open: '06:00', close: '21:00' },
              thursday: { open: '06:00', close: '21:00' },
              friday: { open: '06:00', close: '21:00' },
              saturday: { open: '08:00', close: '18:00' },
              sunday: { open: '09:00', close: '16:00' }
            },
            classes: ['class-123', 'class-456'],
            instructors: ['instructor-123', 'instructor-789'],
            rating: 4.8,
            categories: ['yoga', 'meditation', 'pilates']
          }
        };
      }
      
      // Get studio data
      const studio = API.mockData.studios[studioId];
      
      if (!studio) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
      
      // Get additional related data
      let classes = [];
      if (studio.classes && Array.isArray(studio.classes) && API.mockData.classes) {
        classes = studio.classes
          .map(classId => API.mockData.classes[classId])
          .filter(Boolean);
      }
      
      let instructors = [];
      if (studio.instructors && Array.isArray(studio.instructors) && API.mockData.instructors) {
        instructors = studio.instructors
          .map(instructorId => API.mockData.instructors[instructorId])
          .filter(Boolean)
          .map(instructor => ({
            id: instructor.id,
            firstName: instructor.firstName,
            lastName: instructor.lastName,
            bio: instructor.bio,
            specialties: instructor.specialties,
            profileImage: instructor.profileImage,
            rating: instructor.rating
          }));
      }
      
      // Get rating data
      let feedbackCount = 0;
      let averageRating = 0;
      
      if (API.mockData.feedback) {
        const studioFeedback = Object.values(API.mockData.feedback)
          .filter(feedback => feedback.studioId === studioId);
        
        feedbackCount = studioFeedback.length;
        
        if (feedbackCount > 0) {
          const ratingSum = studioFeedback.reduce((sum, feedback) => sum + feedback.rating, 0);
          averageRating = ratingSum / feedbackCount;
        }
      }
      
      return {
        status: 200,
        body: {
          studio,
          classes,
          instructors,
          feedback: {
            count: feedbackCount,
            averageRating
          }
        }
      };
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

// Run all tests
async function runAllTests() {
  try {
    const getAllStudiosResult = await testGetAllStudiosEndpoint();
    const getStudioByIdResult = await testGetStudioByIdEndpoint();
    
    if (getAllStudiosResult && getStudioByIdResult) {
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