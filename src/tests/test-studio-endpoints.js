// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Partner App Studio API Endpoints...');

// Test get all studios endpoint
async function testGetAllStudiosEndpoint() {
  console.log('\n📋 Testing GET /api/studios...');
  
  // Mock implementation of GET /api/studios endpoint
  async function handleGetAllStudios(request) {
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
          
          // Get studios for this partner
          const studios = await API.getDocuments('studios', { businessId: partner.id });
          
          // Get class counts for each studio
          const studiosWithClasses = await Promise.all(studios.map(async (studio) => {
            const classes = await API.getDocuments('classes', { studioId: studio.id });
            return {
              ...studio,
              classCount: classes.length
            };
          }));
          
          return {
            status: 200,
            body: { studios: studiosWithClasses }
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
      console.error('Error getting studios:', error);
      return {
        status: 500,
        body: { error: 'Failed to get studios' }
      };
    }
  }
  
  try {
    // Test case 1: Get all studios for partner
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetAllStudios(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.studios || !Array.isArray(response1.body.studios)) {
      throw new Error('Response should include studios array');
    }
    
    // Check if each studio has a classCount property
    if (!response1.body.studios.every(studio => 'classCount' in studio)) {
      throw new Error('Each studio should have a classCount property');
    }
    
    console.log('✅ Successfully retrieved all studios for partner');
    
    // Test case 2: Unauthorized request (no token)
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'GET'
    });
    
    const response2 = await handleGetAllStudios(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    // Test case 3: Unauthorized user (non-partner user)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'GET',
      headers: createAuthHeader('valid-token-consumer-456')
    });
    
    const response3 = await handleGetAllStudios(request3);
    
    if (response3.status !== 403) {
      throw new Error(`Expected status 403, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled non-partner user');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get all studios endpoint:', error);
    return false;
  }
}

// Test get studio details endpoint
async function testGetStudioDetailsEndpoint() {
  console.log('\n📋 Testing GET /api/studios/[id]...');
  
  // Mock implementation of GET /api/studios/[id] endpoint
  async function handleGetStudioDetails(request) {
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
          
          // Get studio data
          try {
            const studio = await API.getDocument('studios', studioId);
            
            // Check if studio belongs to this partner
            if (studio.businessId !== partner.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Studio does not belong to this partner.' }
              };
            }
            
            // Get classes for this studio
            const classes = await API.getDocuments('classes', { studioId: studio.id });
            
            // Get feedback for this studio
            const feedback = await API.getDocuments('feedback', { studioId: studio.id });
            
            // Calculate average rating
            let averageRating = 0;
            if (feedback.length > 0) {
              const sum = feedback.reduce((acc, item) => acc + item.rating, 0);
              averageRating = sum / feedback.length;
            }
            
            // Get instructors who teach at this studio
            const instructorIds = [...new Set(classes.map(cls => cls.instructorId).filter(Boolean))];
            const instructors = await Promise.all(
              instructorIds.map(id => API.getDocument('instructors', id))
            );
            
            return {
              status: 200,
              body: { 
                studio,
                classes,
                classCount: classes.length,
                feedback: {
                  count: feedback.length,
                  averageRating
                },
                instructors
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Studio not found' }
            };
          }
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
      console.error('Error getting studio details:', error);
      return {
        status: 500,
        body: { error: 'Failed to get studio details' }
      };
    }
  }
  
  try {
    // Test case 1: Get existing studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetStudioDetails(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.studio || response1.body.studio.id !== 'studio-123') {
      throw new Error('Response should include studio data');
    }
    
    if (!Array.isArray(response1.body.classes)) {
      throw new Error('Response should include classes array');
    }
    
    if (!response1.body.feedback || typeof response1.body.feedback.averageRating !== 'number') {
      throw new Error('Response should include feedback statistics');
    }
    
    console.log('✅ Successfully retrieved studio details');
    
    // Test case 2: Get non-existent studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/non-existent'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetStudioDetails(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123'),
      method: 'GET'
    });
    
    const response3 = await handleGetStudioDetails(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get studio details endpoint:', error);
    return false;
  }
}

// Test create studio endpoint
async function testCreateStudioEndpoint() {
  console.log('\n📋 Testing POST /api/studios...');
  
  // Mock implementation of POST /api/studios endpoint
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
      
      // Get request body
      const body = request.bodyJson || {};
      
      // Validate required fields
      const requiredFields = ['name', 'address', 'city', 'state', 'zipCode', 'phone'];
      const missingFields = requiredFields.filter(field => !body[field]);
      
      if (missingFields.length > 0) {
        return {
          status: 400,
          body: { error: `Missing required fields: ${missingFields.join(', ')}` }
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
          
          // Get current studios count
          const existingStudios = await API.getDocuments('studios', { businessId: partner.id });
          
          // Check if partner subscription allows more studios
          const maxStudios = partner.subscription?.maxStudios || 1;
          if (existingStudios.length >= maxStudios) {
            return {
              status: 403,
              body: { 
                error: 'Studio limit reached for your subscription',
                currentCount: existingStudios.length,
                maxAllowed: maxStudios,
                needsUpgrade: true
              }
            };
          }
          
          // Prepare new studio data
          const newStudio = {
            id: `studio-${Date.now()}`, // In a real app, this would be a generated UUID
            businessId: partner.id,
            name: body.name,
            address: body.address,
            city: body.city,
            state: body.state,
            zipCode: body.zipCode,
            phone: body.phone,
            email: body.email || null,
            description: body.description || null,
            amenities: body.amenities || [],
            images: body.images || [],
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: userId
          };
          
          // In a real implementation, this would save to the database
          const createdStudio = await API.createDocument('studios', newStudio);
          
          return {
            status: 201,
            body: { 
              studio: createdStudio,
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
      console.error('Error creating studio:', error);
      return {
        status: 500,
        body: { error: 'Failed to create studio' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully create studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Yoga Retreat Studio',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '555-123-4567',
        email: 'yoga@example.com',
        description: 'A peaceful yoga studio in the heart of San Francisco',
        amenities: ['Showers', 'Lockers', 'Water stations']
      }
    });
    
    const response1 = await handleCreateStudio(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    if (!response1.body.studio || response1.body.studio.name !== 'Yoga Retreat Studio') {
      throw new Error('Response should include created studio data');
    }
    
    console.log('✅ Successfully created a studio');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Incomplete Studio',
        // Missing address, city, state, zipCode, phone
      }
    });
    
    const response2 = await handleCreateStudio(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    // Test case 3: Studio limit reached
    // Mock the API to return a partner with maxStudios=0 to simulate reaching the limit
    const originalGetBusinessByOwnerId = API.getBusinessByOwnerId;
    
    API.getBusinessByOwnerId = async (ownerId) => {
      const partner = await originalGetBusinessByOwnerId(ownerId);
      return {
        ...partner,
        subscription: {
          ...partner.subscription,
          maxStudios: 0 // Set to 0 to trigger the limit
        }
      };
    };
    
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'This Will Fail Studio',
        address: '456 Other St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '555-123-4567'
      }
    });
    
    const response3 = await handleCreateStudio(request3);
    
    if (response3.status !== 403) {
      throw new Error(`Expected status 403, got ${response3.status}`);
    }
    
    if (!response3.body.needsUpgrade) {
      throw new Error('Response should indicate subscription upgrade is needed');
    }
    
    // Restore the original function
    API.getBusinessByOwnerId = originalGetBusinessByOwnerId;
    
    console.log('✅ Correctly handled studio limit reached');
    
    // Test case 4: Unauthorized request (no token)
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/studios'),
      method: 'POST',
      body: {
        name: 'Unauthorized Studio',
        address: '789 Any St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        phone: '555-123-4567'
      }
    });
    
    const response4 = await handleCreateStudio(request4);
    
    if (response4.status !== 401) {
      throw new Error(`Expected status 401, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing create studio endpoint:', error);
    return false;
  }
}

// Test update studio endpoint
async function testUpdateStudioEndpoint() {
  console.log('\n📋 Testing PUT /api/studios/[id]...');
  
  // Mock implementation of PUT /api/studios/[id] endpoint
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
      
      // Get request body
      const body = request.bodyJson || {};
      
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
          
          // Get studio data
          try {
            const studio = await API.getDocument('studios', studioId);
            
            // Check if studio belongs to this partner
            if (studio.businessId !== partner.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Studio does not belong to this partner.' }
              };
            }
            
            // Update studio with new data
            const updatedStudio = {
              ...studio,
              name: body.name !== undefined ? body.name : studio.name,
              address: body.address !== undefined ? body.address : studio.address,
              city: body.city !== undefined ? body.city : studio.city,
              state: body.state !== undefined ? body.state : studio.state,
              zipCode: body.zipCode !== undefined ? body.zipCode : studio.zipCode,
              phone: body.phone !== undefined ? body.phone : studio.phone,
              email: body.email !== undefined ? body.email : studio.email,
              description: body.description !== undefined ? body.description : studio.description,
              amenities: body.amenities !== undefined ? body.amenities : studio.amenities,
              images: body.images !== undefined ? body.images : studio.images,
              active: body.active !== undefined ? body.active : studio.active,
              updatedAt: new Date().toISOString(),
              updatedBy: userId
            };
            
            // In a real implementation, this would update the database
            const savedStudio = await API.updateDocument('studios', studioId, updatedStudio);
            
            return {
              status: 200,
              body: { 
                studio: savedStudio,
                success: true
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Studio not found' }
            };
          }
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
      console.error('Error updating studio:', error);
      return {
        status: 500,
        body: { error: 'Failed to update studio' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully update studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Updated Studio Name',
        description: 'This is an updated description',
        amenities: ['Showers', 'Lockers', 'Meditation Room', 'Tea Station']
      }
    });
    
    const response1 = await handleUpdateStudio(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.studio || response1.body.studio.name !== 'Updated Studio Name') {
      throw new Error('Response should include updated studio data with new name');
    }
    
    console.log('✅ Successfully updated a studio');
    
    // Test case 2: Studio not found
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/non-existent'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'This Will Fail'
      }
    });
    
    const response2 = await handleUpdateStudio(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123'),
      method: 'PUT',
      body: {
        name: 'Unauthorized Update'
      }
    });
    
    const response3 = await handleUpdateStudio(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update studio endpoint:', error);
    return false;
  }
}

// Test delete studio endpoint
async function testDeleteStudioEndpoint() {
  console.log('\n📋 Testing DELETE /api/studios/[id]...');
  
  // Mock implementation of DELETE /api/studios/[id] endpoint
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
          
          // Get studio data
          try {
            const studio = await API.getDocument('studios', studioId);
            
            // Check if studio belongs to this partner
            if (studio.businessId !== partner.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Studio does not belong to this partner.' }
              };
            }
            
            // Check if there are classes associated with this studio
            const classes = await API.getDocuments('classes', { studioId: studio.id });
            
            if (classes.length > 0) {
              return {
                status: 400,
                body: { 
                  error: 'Cannot delete studio with active classes',
                  classCount: classes.length,
                  resolution: 'Delete or move all classes from this studio before deleting'
                }
              };
            }
            
            // In a real implementation, this would delete from the database
            await API.deleteDocument('studios', studioId);
            
            return {
              status: 200,
              body: { 
                success: true,
                message: 'Studio successfully deleted'
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Studio not found' }
            };
          }
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
      console.error('Error deleting studio:', error);
      return {
        status: 500,
        body: { error: 'Failed to delete studio' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully delete studio
    // First, mock the API to return empty classes for the studio
    const originalGetDocuments = API.getDocuments;
    
    API.getDocuments = async (collection, filter) => {
      if (collection === 'classes' && filter.studioId === 'studio-to-delete') {
        return []; // No classes for this studio
      }
      return await originalGetDocuments(collection, filter);
    };
    
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-to-delete'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleDeleteStudio(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.success) {
      throw new Error('Response should indicate successful deletion');
    }
    
    console.log('✅ Successfully deleted a studio');
    
    // Test case 2: Studio with classes (cannot delete)
    API.getDocuments = async (collection, filter) => {
      if (collection === 'classes' && filter.studioId === 'studio-with-classes') {
        return [{ id: 'class-1' }, { id: 'class-2' }]; // Studio has classes
      }
      return await originalGetDocuments(collection, filter);
    };
    
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-with-classes'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleDeleteStudio(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    if (!response2.body.classCount || response2.body.classCount !== 2) {
      throw new Error('Response should indicate number of classes preventing deletion');
    }
    
    console.log('✅ Correctly prevented deletion of studio with classes');
    
    // Restore the original function
    API.getDocuments = originalGetDocuments;
    
    // Test case 3: Studio not found
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/non-existent'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleDeleteStudio(request3);
    
    if (response3.status !== 404) {
      throw new Error(`Expected status 404, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled non-existent studio');
    
    // Test case 4: Unauthorized request (no token)
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/studios/studio-123'),
      method: 'DELETE'
    });
    
    const response4 = await handleDeleteStudio(request4);
    
    if (response4.status !== 401) {
      throw new Error(`Expected status 401, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing delete studio endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getAllStudiosResult = await testGetAllStudiosEndpoint();
    const getStudioDetailsResult = await testGetStudioDetailsEndpoint();
    const createStudioResult = await testCreateStudioEndpoint();
    const updateStudioResult = await testUpdateStudioEndpoint();
    const deleteStudioResult = await testDeleteStudioEndpoint();
    
    if (getAllStudiosResult && getStudioDetailsResult && createStudioResult && updateStudioResult && deleteStudioResult) {
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