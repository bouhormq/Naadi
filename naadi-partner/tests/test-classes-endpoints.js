// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import mock functions
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');
const API = require('./mock-api');

// Log the start of the test
console.log('🔍 Testing Partner App Classes API Endpoints...');

// Test list classes endpoint
async function testListClassesEndpoint() {
  console.log('\n📋 Testing GET /api/classes/list...');
  
  // Mock implementation of GET /api/classes/list endpoint
  async function handleListClasses(request) {
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
      
      // Get partner data
      const partner = await API.getBusinessByOwnerId(userId);
      
      // Get query params for filtering
      const url = new URL(request.url);
      const studioId = url.searchParams.get('studioId');
      const instructorId = url.searchParams.get('instructorId');
      const category = url.searchParams.get('category');
      
      // Build filter
      const filter = { businessId: partner.id };
      if (studioId) filter.studioId = studioId;
      if (instructorId) filter.instructorId = instructorId;
      if (category) filter.category = category;
      
      // Get classes
      const classes = await API.getDocuments('classes', filter);
      
      return {
        status: 200,
        body: classes
      };
    } catch (error) {
      console.error('Error in list classes endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to list classes' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully list all classes
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/list'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleListClasses(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const data1 = response1.body;
    
    if (!Array.isArray(data1)) {
      throw new Error('Response should be an array of classes');
    }
    
    console.log('✅ Successfully listed all classes');
    
    // Test case 2: Filter classes by studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/list', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleListClasses(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    const data2 = response2.body;
    
    if (!Array.isArray(data2)) {
      throw new Error('Response should be an array of classes');
    }
    
    // Check that all returned classes are for the specified studio
    if (data2.some(c => c.studioId !== 'studio-123')) {
      throw new Error('All classes should be for the specified studio');
    }
    
    console.log('✅ Successfully filtered classes by studio');
    
    // Test case 3: Filter classes by category
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/list', { category: 'yoga' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleListClasses(request3);
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    const data3 = response3.body;
    
    if (!Array.isArray(data3) || data3.some(c => c.category !== 'yoga')) {
      throw new Error('All classes should be of the specified category');
    }
    
    console.log('✅ Successfully filtered classes by category');
    
    // Test case 4: Unauthorized access
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/list'),
      method: 'GET'
    });
    
    const response4 = await handleListClasses(request4);
    
    if (response4.status !== 401) {
      throw new Error(`Expected status 401, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized access');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing list classes endpoint:', error);
    return false;
  }
}

// Test create class endpoint
async function testCreateClassEndpoint() {
  console.log('\n📋 Testing POST /api/classes/create...');
  
  // Mock implementation of POST /api/classes/create endpoint
  async function handleCreateClass(request) {
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
      
      // Get partner data
      const partner = await API.getBusinessByOwnerId(userId);
      
      // Get request body
      const body = await request.json();
      
      // Validate required fields
      if (!body.name || !body.studioId || !body.duration || !body.capacity) {
        return {
          status: 400,
          body: { error: 'Name, studioId, duration, and capacity are required' }
        };
      }
      
      // Verify the studio belongs to this partner
      try {
        const studio = await API.getDocument('studios', body.studioId);
        
        if (studio.businessId !== partner.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not own this studio.' }
          };
        }
        
        // Create the class
        const classData = {
          businessId: partner.id,
          studioId: body.studioId,
          name: body.name,
          description: body.description || '',
          duration: body.duration,
          capacity: body.capacity,
          instructorId: body.instructorId || null,
          category: body.category || 'general',
          level: body.level || 'all-levels',
          equipment: body.equipment || [],
          price: body.price || 0,
          schedule: body.schedule || {
            days: ['monday', 'wednesday', 'friday'],
            time: '10:00',
            timeZone: 'UTC'
          }
        };
        
        const newClass = await API.createDocument('classes', classData);
        
        return {
          status: 201,
          body: newClass
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
    } catch (error) {
      console.error('Error in create class endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to create class' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully create a class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'New Test Class',
        studioId: 'studio-123',
        description: 'A test class description',
        duration: 60,
        capacity: 20,
        instructorId: 'instructor-123',
        category: 'pilates',
        level: 'intermediate',
        equipment: ['mat', 'blocks'],
        price: 25.99,
        schedule: {
          days: ['tuesday', 'thursday'],
          time: '18:00',
          timeZone: 'UTC'
        }
      }
    });
    
    const response1 = await handleCreateClass(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    const newClass = response1.body;
    
    if (!newClass.id || newClass.name !== 'New Test Class') {
      throw new Error('Response should include the new class data');
    }
    
    console.log('✅ Successfully created a class');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Incomplete Class',
        studioId: 'studio-123'
        // Missing duration and capacity
      }
    });
    
    const response2 = await handleCreateClass(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    // Test case 3: Studio not owned by the partner
    // First, create a studio owned by another partner
    const otherStudio = {
      id: 'studio-other',
      businessId: 'partner-456',
      name: 'Other Studio',
      address: {
        street: '456 Other St',
        city: 'Other City',
        state: 'OS',
        zip: '54321',
        country: 'Other Country'
      }
    };
    
    // Add it to the mock data
    if (!API.mockData.studios) {
      API.mockData.studios = {};
    }
    API.mockData.studios[otherStudio.id] = otherStudio;
    
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Unauthorized Class',
        studioId: 'studio-other',
        duration: 45,
        capacity: 15
      }
    });
    
    const response3 = await handleCreateClass(request3);
    
    if (response3.status !== 403) {
      throw new Error(`Expected status 403, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized studio access');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing create class endpoint:', error);
    return false;
  }
}

// Test update class endpoint
async function testUpdateClassEndpoint() {
  console.log('\n📋 Testing PUT /api/classes/update...');
  
  // Mock implementation of PUT /api/classes/update endpoint
  async function handleUpdateClass(request) {
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
      
      // Get request body
      const body = await request.json();
      
      // Validate required fields
      if (!body.id) {
        return {
          status: 400,
          body: { error: 'Class ID is required' }
        };
      }
      
      // Get the class to verify ownership
      try {
        const classObj = await API.getDocument('classes', body.id);
        
        // Get the partner to verify ownership
        const partner = await API.getBusinessByOwnerId(userId);
        
        if (classObj.businessId !== partner.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not own this class.' }
          };
        }
        
        // If studio ID is being changed, verify the new studio belongs to this partner
        if (body.studioId && body.studioId !== classObj.studioId) {
          try {
            const studio = await API.getDocument('studios', body.studioId);
            
            if (studio.businessId !== partner.id) {
              return {
                status: 403,
                body: { error: 'Access denied. You do not own the specified studio.' }
              };
            }
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Studio not found' }
            };
          }
        }
        
        // Update class data
        const updatedData = { ...body };
        delete updatedData.id; // Remove ID from update data
        
        const updatedClass = await API.updateDocument('classes', body.id, updatedData);
        
        return {
          status: 200,
          body: updatedClass
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Class not found' }
        };
      }
    } catch (error) {
      console.error('Error in update class endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to update class' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully update a class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        id: 'class-123',
        name: 'Updated Class Name',
        description: 'Updated description',
        duration: 75,
        price: 29.99
      }
    });
    
    const response1 = await handleUpdateClass(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const updatedClass = response1.body;
    
    if (updatedClass.name !== 'Updated Class Name' || updatedClass.duration !== 75) {
      throw new Error('Class should be updated with new values');
    }
    
    console.log('✅ Successfully updated a class');
    
    // Test case 2: Missing class ID
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'No ID Class',
        description: 'Missing ID'
      }
    });
    
    const response2 = await handleUpdateClass(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing class ID');
    
    // Test case 3: Non-existent class
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        id: 'non-existent',
        name: 'Non-existent Class'
      }
    });
    
    const response3 = await handleUpdateClass(request3);
    
    if (response3.status !== 404) {
      throw new Error(`Expected status 404, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update class endpoint:', error);
    return false;
  }
}

// Test delete class endpoint
async function testDeleteClassEndpoint() {
  console.log('\n📋 Testing DELETE /api/classes/delete...');
  
  // Mock implementation of DELETE /api/classes/delete endpoint
  async function handleDeleteClass(request) {
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
      
      // Get query params
      const url = new URL(request.url);
      const classId = url.searchParams.get('id');
      
      if (!classId) {
        return {
          status: 400,
          body: { error: 'Class ID is required' }
        };
      }
      
      // Get the class to verify ownership
      try {
        const classObj = await API.getDocument('classes', classId);
        
        // Get the partner to verify ownership
        const partner = await API.getBusinessByOwnerId(userId);
        
        if (classObj.businessId !== partner.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not own this class.' }
          };
        }
        
        // Check if there are any active bookings for this class
        const activeBookings = await API.getDocuments('bookings', {
          classId,
          status: 'confirmed'
        });
        
        if (activeBookings.length > 0) {
          return {
            status: 400,
            body: { 
              error: 'Cannot delete class with active bookings',
              bookingsCount: activeBookings.length
            }
          };
        }
        
        // Delete the class
        await API.deleteDocument('classes', classId);
        
        return {
          status: 200,
          body: { success: true, message: 'Class deleted successfully' }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Class not found' }
        };
      }
    } catch (error) {
      console.error('Error in delete class endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to delete class' }
      };
    }
  }
  
  try {
    // First, create a test class that we can delete
    const testClass = await API.createDocument('classes', {
      businessId: 'partner-123',
      studioId: 'studio-123',
      name: 'Test Class to Delete',
      description: 'This class will be deleted',
      duration: 60,
      capacity: 20,
      category: 'test'
    });
    
    // Test case 1: Successfully delete a class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/delete', { id: testClass.id }),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleDeleteClass(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.success) {
      throw new Error('Response should indicate success');
    }
    
    console.log('✅ Successfully deleted a class');
    
    // Test case 2: Missing class ID
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/delete'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleDeleteClass(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing class ID');
    
    // Test case 3: Non-existent class
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/delete', { id: 'non-existent' }),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleDeleteClass(request3);
    
    if (response3.status !== 404) {
      throw new Error(`Expected status 404, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    // Test case 4: Class with active bookings
    // First, create a test class
    const classWithBookings = {
      id: 'class-with-bookings',
      businessId: 'partner-123',
      studioId: 'studio-123',
      name: 'Class With Bookings',
      description: 'This class has active bookings',
      duration: 60,
      capacity: 20
    };
    
    // Add it to the mock data
    if (!API.mockData.classes) {
      API.mockData.classes = {};
    }
    API.mockData.classes[classWithBookings.id] = classWithBookings;
    
    // Then create a booking for this class
    const booking = {
      id: 'booking-123',
      userId: 'client-123',
      classId: 'class-with-bookings',
      studioId: 'studio-123',
      businessId: 'partner-123',
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString(),
      classDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
    };
    
    // Add it to the mock data
    if (!API.mockData.bookings) {
      API.mockData.bookings = {};
    }
    API.mockData.bookings[booking.id] = booking;
    
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/delete', { id: 'class-with-bookings' }),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response4 = await handleDeleteClass(request4);
    
    if (response4.status !== 400) {
      throw new Error(`Expected status 400, got ${response4.status}`);
    }
    
    if (!response4.body.error.includes('Cannot delete class with active bookings')) {
      throw new Error('Response should indicate active bookings issue');
    }
    
    console.log('✅ Correctly prevented deletion of class with active bookings');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing delete class endpoint:', error);
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
    
    const listResult = await testListClassesEndpoint();
    const createResult = await testCreateClassEndpoint();
    const updateResult = await testUpdateClassEndpoint();
    const deleteResult = await testDeleteClassEndpoint();
    
    if (listResult && createResult && updateResult && deleteResult) {
      console.log('\n🎉 All Classes API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Classes API Endpoint tests failed!');
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