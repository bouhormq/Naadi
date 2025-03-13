// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Business App Class API Endpoints...');

// Test get all classes for a business or studio
async function testGetAllClassesEndpoint() {
  console.log('\n📋 Testing GET /api/classes...');
  
  // Mock implementation of GET /api/classes endpoint
  async function handleGetAllClasses(request) {
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
      
      // Get query parameters
      const url = new URL(request.url);
      const studioId = url.searchParams.get('studioId');
      
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
          
          // Filter for a specific studio if requested
          let filter = { businessId: business.id };
          if (studioId) {
            // Verify studio belongs to this business
            try {
              const studio = await API.getDocument('studios', studioId);
              if (studio.businessId !== business.id) {
                return {
                  status: 403,
                  body: { error: 'Access denied. Studio does not belong to this business.' }
                };
              }
              filter.studioId = studioId;
            } catch (error) {
              return {
                status: 404,
                body: { error: 'Studio not found' }
              };
            }
          }
          
          // Get classes for this business/studio
          const classes = await API.getDocuments('classes', filter);
          
          return {
            status: 200,
            body: { 
              classes,
              count: classes.length
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
      console.error('Error getting classes:', error);
      return {
        status: 500,
        body: { error: 'Failed to get classes' }
      };
    }
  }
  
  try {
    // Test case 1: Get all classes for business
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetAllClasses(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.classes || !Array.isArray(response1.body.classes)) {
      throw new Error('Response should include classes array');
    }
    
    console.log('✅ Successfully retrieved all classes for business');
    
    // Test case 2: Get classes for a specific studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetAllClasses(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    console.log('✅ Successfully retrieved classes for a specific studio');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes'),
      method: 'GET'
    });
    
    const response3 = await handleGetAllClasses(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get all classes endpoint:', error);
    return false;
  }
}

// Test get class by ID endpoint
async function testGetClassByIdEndpoint() {
  console.log('\n📋 Testing GET /api/classes/[id]...');
  
  // Mock implementation of GET /api/classes/[id] endpoint
  async function handleGetClassById(request) {
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
          
          // Get class data
          try {
            const classData = await API.getDocument('classes', classId);
            
            // Check if class belongs to this business
            if (classData.businessId !== business.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Class does not belong to this business.' }
              };
            }
            
            // Get instructor details if available
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
            
            // Get active bookings count
            const bookings = await API.getDocuments('bookings', { 
              classId: classId,
              status: 'confirmed'
            });
            
            return {
              status: 200,
              body: { 
                class: classData,
                instructor,
                studio,
                bookingsCount: bookings.length
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Class not found' }
            };
          }
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
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
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
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetClassById(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/class-123'),
      method: 'GET'
    });
    
    const response3 = await handleGetClassById(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get class by ID endpoint:', error);
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
          
          // Get request body
          const body = request.bodyJson || {};
          
          // Validate required fields
          if (!body.name || !body.studioId || !body.duration) {
            return {
              status: 400,
              body: { error: 'Class name, studio ID, and duration are required' }
            };
          }
          
          // Verify the studio exists and belongs to this business
          try {
            const studio = await API.getDocument('studios', body.studioId);
            if (studio.businessId !== business.id) {
              return {
                status: 403,
                body: { error: 'Studio does not belong to this business' }
              };
            }
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Studio not found' }
            };
          }
          
          // Check business plan limits (simplified for testing)
          const classes = await API.getDocuments('classes', { businessId: business.id });
          if (business.plan !== 'premium' && classes.length >= 50) {
            return {
              status: 403,
              body: { error: 'Free plan is limited to 50 classes. Please upgrade to Premium for unlimited classes.' }
            };
          }
          
          // Verify instructor if provided
          if (body.instructorId) {
            try {
              const instructor = await API.getDocument('instructors', body.instructorId);
              if (!instructor.businessId || instructor.businessId !== business.id) {
                return {
                  status: 403,
                  body: { error: 'Instructor does not belong to this business' }
                };
              }
            } catch (error) {
              return {
                status: 404,
                body: { error: 'Instructor not found' }
              };
            }
          }
          
          // Create class
          const classData = {
            businessId: business.id,
            studioId: body.studioId,
            name: body.name,
            description: body.description || '',
            duration: body.duration,
            capacity: body.capacity || 20,
            instructorId: body.instructorId || null,
            category: body.category || 'other',
            level: body.level || 'all',
            equipment: body.equipment || [],
            price: body.price || 0,
            schedule: body.schedule || [],
            createdAt: new Date().toISOString()
          };
          
          const newClass = await API.createDocument('classes', classData);
          
          return {
            status: 201,
            body: { 
              class: newClass,
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
      console.error('Error creating class:', error);
      return {
        status: 500,
        body: { error: 'Failed to create class' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully create class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        studioId: 'studio-123',
        name: 'New Yoga Class',
        description: 'A relaxing yoga class for all levels',
        duration: 60,
        capacity: 15,
        category: 'yoga',
        level: 'beginner',
        price: 20,
        schedule: [
          {
            day: 'monday',
            startTime: '18:00',
            endTime: '19:00'
          },
          {
            day: 'wednesday',
            startTime: '18:00',
            endTime: '19:00'
          }
        ]
      }
    });
    
    const response1 = await handleCreateClass(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    if (!response1.body.class || !response1.body.success) {
      throw new Error('Response should include class data and success flag');
    }
    
    console.log('✅ Successfully created new class');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Incomplete Class'
        // No studioId or duration provided
      }
    });
    
    const response2 = await handleCreateClass(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/create'),
      method: 'POST',
      body: {
        studioId: 'studio-123',
        name: 'Unauthorized Class',
        duration: 60
      }
    });
    
    const response3 = await handleCreateClass(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing create class endpoint:', error);
    return false;
  }
}

// Test update class endpoint
async function testUpdateClassEndpoint() {
  console.log('\n📋 Testing PUT /api/classes/[id]/update...');
  
  // Mock implementation of PUT /api/classes/[id]/update endpoint
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
      
      // Extract class ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const classId = pathParts[pathParts.length - 2]; // Account for /update at the end
      
      if (!classId) {
        return {
          status: 400,
          body: { error: 'Class ID is required' }
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
          
          // Get class data
          try {
            let classData = await API.getDocument('classes', classId);
            
            // Check if class belongs to this business
            if (classData.businessId !== business.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Class does not belong to this business.' }
              };
            }
            
            // Get request body
            const body = request.bodyJson || {};
            
            // Verify studio if changing
            if (body.studioId && body.studioId !== classData.studioId) {
              try {
                const studio = await API.getDocument('studios', body.studioId);
                if (studio.businessId !== business.id) {
                  return {
                    status: 403,
                    body: { error: 'Studio does not belong to this business' }
                  };
                }
              } catch (error) {
                return {
                  status: 404,
                  body: { error: 'Studio not found' }
                };
              }
            }
            
            // Verify instructor if changing
            if (body.instructorId && body.instructorId !== classData.instructorId) {
              try {
                const instructor = await API.getDocument('instructors', body.instructorId);
                if (!instructor.businessId || instructor.businessId !== business.id) {
                  return {
                    status: 403,
                    body: { error: 'Instructor does not belong to this business' }
                  };
                }
              } catch (error) {
                return {
                  status: 404,
                  body: { error: 'Instructor not found' }
                };
              }
            }
            
            // Update class data
            if (body.name) classData.name = body.name;
            if (body.description !== undefined) classData.description = body.description;
            if (body.duration) classData.duration = body.duration;
            if (body.capacity) classData.capacity = body.capacity;
            if (body.studioId) classData.studioId = body.studioId;
            if (body.instructorId !== undefined) classData.instructorId = body.instructorId;
            if (body.category) classData.category = body.category;
            if (body.level) classData.level = body.level;
            if (body.equipment) classData.equipment = body.equipment;
            if (body.price !== undefined) classData.price = body.price;
            if (body.schedule) classData.schedule = body.schedule;
            
            // In a real implementation, this would update the database
            // For testing, we'll just return the updated class
            const updatedClass = await API.updateDocument('classes', classId, classData);
            
            return {
              status: 200,
              body: { 
                class: updatedClass,
                success: true
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Class not found' }
            };
          }
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
      console.error('Error updating class:', error);
      return {
        status: 500,
        body: { error: 'Failed to update class' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully update class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/class-123/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'Updated Yoga Class',
        description: 'Updated description',
        duration: 75,
        capacity: 20
      }
    });
    
    const response1 = await handleUpdateClass(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.class || !response1.body.success) {
      throw new Error('Response should include class data and success flag');
    }
    
    if (response1.body.class.name !== 'Updated Yoga Class') {
      throw new Error('Class name was not updated correctly');
    }
    
    console.log('✅ Successfully updated class');
    
    // Test case 2: Non-existent class
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/non-existent/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        name: 'This Will Fail'
      }
    });
    
    const response2 = await handleUpdateClass(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/class-123/update'),
      method: 'PUT',
      body: {
        name: 'Unauthorized Update'
      }
    });
    
    const response3 = await handleUpdateClass(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update class endpoint:', error);
    return false;
  }
}

// Test delete class endpoint
async function testDeleteClassEndpoint() {
  console.log('\n📋 Testing DELETE /api/classes/[id]...');
  
  // Mock implementation of DELETE /api/classes/[id] endpoint
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
          
          // Get class data
          try {
            const classData = await API.getDocument('classes', classId);
            
            // Check if class belongs to this business
            if (classData.businessId !== business.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Class does not belong to this business.' }
              };
            }
            
            // Check if there are any active bookings
            const activeBookings = await API.getDocuments('bookings', { 
              classId: classId,
              status: 'confirmed'
            });
            
            if (activeBookings.length > 0) {
              return {
                status: 400,
                body: { error: 'Cannot delete class with active bookings' }
              };
            }
            
            // In a real implementation, this would delete from the database
            // and handle related data
            await API.deleteDocument('classes', classId);
            
            return {
              status: 200,
              body: { success: true }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Class not found' }
            };
          }
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
      console.error('Error deleting class:', error);
      return {
        status: 500,
        body: { error: 'Failed to delete class' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully delete class
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/class-123'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleDeleteClass(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (response1.body.success !== true) {
      throw new Error('Response should indicate success');
    }
    
    console.log('✅ Successfully deleted class');
    
    // Test case 2: Non-existent class
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/non-existent'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleDeleteClass(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent class');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/classes/class-123'),
      method: 'DELETE'
    });
    
    const response3 = await handleDeleteClass(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing delete class endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getAllClassesResult = await testGetAllClassesEndpoint();
    const getClassByIdResult = await testGetClassByIdEndpoint();
    const createClassResult = await testCreateClassEndpoint();
    const updateClassResult = await testUpdateClassEndpoint();
    const deleteClassResult = await testDeleteClassEndpoint();
    
    if (getAllClassesResult && getClassByIdResult && createClassResult && updateClassResult && deleteClassResult) {
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