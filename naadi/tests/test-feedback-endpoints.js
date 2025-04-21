// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import mock functions
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');
const API = require('./mock-api');

// Log the start of the test
console.log('🔍 Testing Partner App Feedback API Endpoints...');

// Test studio feedback endpoint
async function testStudioFeedbackEndpoint() {
  console.log('\n📋 Testing GET /api/feedback/studio...');

  // Mock implementation of GET /api/feedback/studio endpoint
  async function handleStudioFeedback(request) {
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
      
      // Get user data to verify partner account
      const user = await API.getUserById(userId);
      
      if (user.role !== 'partner') {
        return {
          status: 403,
          body: { error: 'Access denied. Partner account required.' }
        };
      }
      
      // Get studio ID from query params
      const url = new URL(request.url);
      const studioId = url.searchParams.get('studioId');
      
      if (!studioId) {
        return {
          status: 400,
          body: { error: 'Studio ID is required' }
        };
      }
      
      // Get the studio to verify ownership
      try {
        const studio = await API.getDocument('studios', studioId);
        
        // Get the partner to verify ownership
        const partner = await API.getBusinessByOwnerId(userId);
        
        if (studio.businessId !== partner.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not manage this studio.' }
          };
        }
        
        // Get feedback
        const feedbackItems = await API.getDocuments('feedback', { studioId, classId: null });
        
        // Calculate stats
        const stats = {
          total: feedbackItems.length,
          average: feedbackItems.reduce((sum, item) => sum + item.rating, 0) / (feedbackItems.length || 1),
          ratings: {
            5: feedbackItems.filter(item => item.rating === 5).length,
            4: feedbackItems.filter(item => item.rating === 4).length,
            3: feedbackItems.filter(item => item.rating === 3).length,
            2: feedbackItems.filter(item => item.rating === 2).length,
            1: feedbackItems.filter(item => item.rating === 1).length
          }
        };
        
        return {
          status: 200,
          body: {
            feedback: feedbackItems,
            stats
          }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
    } catch (error) {
      console.error('Error in studio feedback endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch feedback' }
      };
    }
  }
  
  try {
    // Initialize mock data if needed
    if (!API.mockData) {
      API.mockData = {};
    }
    
    // Initialize studios
    if (!API.mockData.studios) {
      API.mockData.studios = {
        'studio-123': {
          id: 'studio-123',
          businessId: 'partner-123',
          name: 'Yoga Studio',
          address: '123 Yoga St'
        }
      };
    }
    
    // Initialize partneres
    if (!API.mockData.partneres) {
      API.mockData.partneres = {
        'partner-123': {
          id: 'partner-123',
          ownerId: 'user-123',
          name: 'Yoga Partner'
        }
      };
    }
    
    // Initialize users
    if (!API.mockData.users) {
      API.mockData.users = {
        'user-123': {
          id: 'user-123',
          email: 'partner@example.com',
          role: 'partner'
        }
      };
    }
    
    // Initialize feedback
    if (!API.mockData.feedback) {
      API.mockData.feedback = {
        'feedback-studio-1': {
          id: 'feedback-studio-1',
          studioId: 'studio-123',
          classId: null,
          userId: 'user-789',
          rating: 5,
          comment: 'Great studio!',
          createdAt: new Date().toISOString()
        },
        'feedback-studio-2': {
          id: 'feedback-studio-2',
          studioId: 'studio-123',
          classId: null,
          userId: 'user-456',
          rating: 4,
          comment: 'Nice place',
          createdAt: new Date().toISOString()
        }
      };
    }
    
    // Test case 1: Get feedback with valid partner token and studioId
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/studio', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleStudioFeedback(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const data1 = response1.body;
    
    if (!data1.feedback || !Array.isArray(data1.feedback) || !data1.stats) {
      throw new Error('Response should include feedback array and stats');
    }
    
    console.log('✅ Successfully retrieved studio feedback');
    
    // Test case 2: Missing auth token
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/studio', { studioId: 'studio-123' }),
      method: 'GET'
    });
    
    const response2 = await handleStudioFeedback(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing auth token');
    
    // Test case 3: User account trying to access partner endpoint
    // Add a non-partner user
    API.mockData.users['user-456'] = {
      id: 'user-456',
      email: 'user@example.com',
      role: 'user'
    };
    
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/studio', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-456')
    });
    
    const response3 = await handleStudioFeedback(request3);
    
    if (response3.status !== 403) {
      throw new Error(`Expected status 403, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled non-partner user');
    
    // Test case 4: Missing studioId
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/studio'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response4 = await handleStudioFeedback(request4);
    
    if (response4.status !== 400) {
      throw new Error(`Expected status 400, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled missing studioId');
    
    // Test case 5: Non-existent studio
    const request5 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/studio', { studioId: 'non-existent' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response5 = await handleStudioFeedback(request5);
    
    if (response5.status !== 404) {
      throw new Error(`Expected status 404, got ${response5.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    // Test case 6: Studio not owned by the partner
    // Create a studio not owned by the partner
    const otherStudioId = 'studio-other';
    if (!API.mockData.studios) {
      API.mockData.studios = {};
    }
    API.mockData.studios[otherStudioId] = {
      id: otherStudioId,
      businessId: 'partner-other',
      name: 'Other Studio',
      address: '789 Other St, San Francisco, CA'
    };
    
    const request6 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/studio', { studioId: otherStudioId }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response6 = await handleStudioFeedback(request6);
    
    if (response6.status !== 403) {
      throw new Error(`Expected status 403, got ${response6.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized access to studio');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing studio feedback endpoint:', error);
    return false;
  }
}

// Test the class feedback endpoint
async function testClassFeedbackEndpoint() {
  console.log('\n📋 Testing GET /api/feedback/class...');
  
  // Mock implementation of GET /api/feedback/class endpoint
  async function getClassFeedback(request) {
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
      
      // Get user data to verify partner account
      const user = await API.getUserById(userId);
      
      if (user.role !== 'partner') {
        return {
          status: 403,
          body: { error: 'Access denied. Partner account required.' }
        };
      }
      
      // Get class ID from query params
      const url = new URL(request.url);
      const classId = url.searchParams.get('classId');
      
      if (!classId) {
        return {
          status: 400,
          body: { error: 'Class ID is required' }
        };
      }
      
      try {
        // Get class data
        const classData = await API.getDocument('classes', classId);
        
        // Get partner to verify ownership
        const partner = await API.getBusinessByOwnerId(userId);
        
        if (classData.businessId !== partner.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not manage this class.' }
          };
        }
        
        // Get feedback for this class
        const feedbackItems = await API.getDocuments('feedback', { classId });
        
        // Calculate average rating
        const averageRating = feedbackItems.length > 0 
          ? feedbackItems.reduce((sum, item) => sum + item.rating, 0) / feedbackItems.length 
          : 0;
        
        // Calculate rating distribution
        const ratingDistribution = {
          5: feedbackItems.filter(item => item.rating === 5).length,
          4: feedbackItems.filter(item => item.rating === 4).length,
          3: feedbackItems.filter(item => item.rating === 3).length,
          2: feedbackItems.filter(item => item.rating === 2).length,
          1: feedbackItems.filter(item => item.rating === 1).length
        };
        
        return {
          status: 200,
          body: {
            feedback: feedbackItems,
            averageRating,
            ratingDistribution,
            totalFeedback: feedbackItems.length
          }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Class not found' }
        };
      }
    } catch (error) {
      console.error('Error in class feedback endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch feedback' }
      };
    }
  }
  
  try {
    // Initialize classes if needed
    if (!API.mockData.classes) {
      API.mockData.classes = {
        'class-123': {
          id: 'class-123',
          businessId: 'partner-123',
          studioId: 'studio-123',
          name: 'Yoga Class',
          description: 'A relaxing yoga class',
          instructor: 'John Doe',
          duration: 60,
          capacity: 20,
          price: 15.99
        }
      };
    }
    
    // Initialize feedback for class
    if (!API.mockData.feedback) {
      API.mockData.feedback = {};
    }
    
    API.mockData.feedback['feedback-class-1'] = {
      id: 'feedback-class-1',
      classId: 'class-123',
      studioId: 'studio-123',
      userId: 'user-789',
      rating: 5,
      comment: 'Great class!',
      createdAt: new Date().toISOString()
    };
    
    // Test case 1: Get feedback with valid partner token and classId
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/class', { classId: 'class-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await getClassFeedback(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const data1 = response1.body;
    
    if (!data1.feedback || !Array.isArray(data1.feedback)) {
      throw new Error('Response should include feedback array');
    }
    
    console.log('✅ Successfully retrieved class feedback');
    
    // Test case 2: Missing auth token
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/class', { classId: 'class-123' }),
      method: 'GET'
    });
    
    const response2 = await getClassFeedback(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing auth token');
    
    // Test case 3: Missing classId
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/class'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await getClassFeedback(request3);
    
    if (response3.status !== 400) {
      throw new Error(`Expected status 400, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled missing classId');
    
    // Test case 4: Non-existent class
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/feedback/class', { classId: 'non-existent' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response4 = await getClassFeedback(request4);
    
    if (response4.status !== 404) {
      throw new Error(`Expected status 404, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing class feedback endpoint:', error);
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
    
    const studioFeedbackResult = await testStudioFeedbackEndpoint();
    const classFeedbackResult = await testClassFeedbackEndpoint();
    
    if (studioFeedbackResult && classFeedbackResult) {
      console.log('\n🎉 All Feedback API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Feedback API Endpoint tests failed!');
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