// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Business App Instructor API Endpoints...');

// Test get all instructors for a business
async function testGetAllInstructorsEndpoint() {
  console.log('\n📋 Testing GET /api/instructors...');
  
  // Mock implementation of GET /api/instructors endpoint
  async function handleGetAllInstructors(request) {
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
          let instructors = [];
          
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
              
              // Get instructors for this studio
              instructors = await API.getDocuments('instructors', { studioIds: studioId });
            } catch (error) {
              return {
                status: 404,
                body: { error: 'Studio not found' }
              };
            }
          } else {
            // Get all instructors for this business
            instructors = await API.getDocuments('instructors', { businessId: business.id });
          }
          
          return {
            status: 200,
            body: { 
              instructors,
              count: instructors.length
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
      console.error('Error getting instructors:', error);
      return {
        status: 500,
        body: { error: 'Failed to get instructors' }
      };
    }
  }
  
  try {
    // Test case 1: Get all instructors for business
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetAllInstructors(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.instructors || !Array.isArray(response1.body.instructors)) {
      throw new Error('Response should include instructors array');
    }
    
    console.log('✅ Successfully retrieved all instructors for business');
    
    // Test case 2: Get instructors for a specific studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetAllInstructors(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    console.log('✅ Successfully retrieved instructors for a specific studio');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors'),
      method: 'GET'
    });
    
    const response3 = await handleGetAllInstructors(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get all instructors endpoint:', error);
    return false;
  }
}

// Test get instructor by ID endpoint
async function testGetInstructorByIdEndpoint() {
  console.log('\n📋 Testing GET /api/instructors/[id]...');
  
  // Mock implementation of GET /api/instructors/[id] endpoint
  async function handleGetInstructorById(request) {
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
      
      // Extract instructor ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const instructorId = pathParts[pathParts.length - 1];
      
      if (!instructorId) {
        return {
          status: 400,
          body: { error: 'Instructor ID is required' }
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
          
          // Get instructor data
          try {
            const instructor = await API.getDocument('instructors', instructorId);
            
            // Check if instructor belongs to this business
            if (instructor.businessId !== business.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Instructor does not belong to this business.' }
              };
            }
            
            // Get instructor's classes
            const classes = await API.getDocuments('classes', { instructorId: instructorId });
            
            return {
              status: 200,
              body: { 
                instructor,
                classes
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Instructor not found' }
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
      console.error('Error getting instructor:', error);
      return {
        status: 500,
        body: { error: 'Failed to get instructor' }
      };
    }
  }
  
  try {
    // Test case 1: Get existing instructor
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/instructor-123'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetInstructorById(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.instructor || response1.body.instructor.id !== 'instructor-123') {
      throw new Error('Response should include instructor data');
    }
    
    console.log('✅ Successfully retrieved instructor by ID');
    
    // Test case 2: Get non-existent instructor
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/non-existent'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetInstructorById(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent instructor');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/instructor-123'),
      method: 'GET'
    });
    
    const response3 = await handleGetInstructorById(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get instructor by ID endpoint:', error);
    return false;
  }
}

// Test create instructor endpoint
async function testCreateInstructorEndpoint() {
  console.log('\n📋 Testing POST /api/instructors/create...');
  
  // Mock implementation of POST /api/instructors/create endpoint
  async function handleCreateInstructor(request) {
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
          if (!body.firstName || !body.lastName || !body.email) {
            return {
              status: 400,
              body: { error: 'First name, last name, and email are required' }
            };
          }
          
          // Verify studios if provided
          if (body.studioIds && Array.isArray(body.studioIds)) {
            for (const studioId of body.studioIds) {
              try {
                const studio = await API.getDocument('studios', studioId);
                if (studio.businessId !== business.id) {
                  return {
                    status: 403,
                    body: { error: `Studio ${studioId} does not belong to this business` }
                  };
                }
              } catch (error) {
                return {
                  status: 404,
                  body: { error: `Studio ${studioId} not found` }
                };
              }
            }
          }
          
          // Create instructor
          const instructorData = {
            businessId: business.id,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone || '',
            bio: body.bio || '',
            specialties: body.specialties || [],
            certifications: body.certifications || [],
            profileImage: body.profileImage || null,
            studioIds: body.studioIds || [],
            classes: [],
            rating: 0,
            createdAt: new Date().toISOString()
          };
          
          const newInstructor = await API.createDocument('instructors', instructorData);
          
          return {
            status: 201,
            body: { 
              instructor: newInstructor,
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
      console.error('Error creating instructor:', error);
      return {
        status: 500,
        body: { error: 'Failed to create instructor' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully create instructor
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '+1234567890',
        bio: 'Jane is a certified yoga instructor with 5 years of experience.',
        specialties: ['Yoga', 'Pilates', 'Meditation'],
        certifications: ['RYT-200', 'Pilates Level 2'],
        studioIds: ['studio-123']
      }
    });
    
    const response1 = await handleCreateInstructor(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    if (!response1.body.instructor || !response1.body.success) {
      throw new Error('Response should include instructor data and success flag');
    }
    
    console.log('✅ Successfully created new instructor');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        firstName: 'Incomplete'
        // No lastName or email provided
      }
    });
    
    const response2 = await handleCreateInstructor(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/create'),
      method: 'POST',
      body: {
        firstName: 'John',
        lastName: 'Unauthorized',
        email: 'john@example.com'
      }
    });
    
    const response3 = await handleCreateInstructor(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing create instructor endpoint:', error);
    return false;
  }
}

// Test update instructor endpoint
async function testUpdateInstructorEndpoint() {
  console.log('\n📋 Testing PUT /api/instructors/[id]/update...');
  
  // Mock implementation of PUT /api/instructors/[id]/update endpoint
  async function handleUpdateInstructor(request) {
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
      
      // Extract instructor ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const instructorId = pathParts[pathParts.length - 2]; // Account for /update at the end
      
      if (!instructorId) {
        return {
          status: 400,
          body: { error: 'Instructor ID is required' }
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
          
          // Get instructor data
          try {
            let instructor = await API.getDocument('instructors', instructorId);
            
            // Check if instructor belongs to this business
            if (instructor.businessId !== business.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Instructor does not belong to this business.' }
              };
            }
            
            // Get request body
            const body = request.bodyJson || {};
            
            // Verify studios if changing
            if (body.studioIds && Array.isArray(body.studioIds)) {
              for (const studioId of body.studioIds) {
                try {
                  const studio = await API.getDocument('studios', studioId);
                  if (studio.businessId !== business.id) {
                    return {
                      status: 403,
                      body: { error: `Studio ${studioId} does not belong to this business` }
                    };
                  }
                } catch (error) {
                  return {
                    status: 404,
                    body: { error: `Studio ${studioId} not found` }
                  };
                }
              }
            }
            
            // Update instructor data
            if (body.firstName) instructor.firstName = body.firstName;
            if (body.lastName) instructor.lastName = body.lastName;
            if (body.email) instructor.email = body.email;
            if (body.phone !== undefined) instructor.phone = body.phone;
            if (body.bio !== undefined) instructor.bio = body.bio;
            if (body.specialties) instructor.specialties = body.specialties;
            if (body.certifications) instructor.certifications = body.certifications;
            if (body.profileImage !== undefined) instructor.profileImage = body.profileImage;
            if (body.studioIds) instructor.studioIds = body.studioIds;
            
            // In a real implementation, this would update the database
            // For testing, we'll just return the updated instructor
            const updatedInstructor = await API.updateDocument('instructors', instructorId, instructor);
            
            return {
              status: 200,
              body: { 
                instructor: updatedInstructor,
                success: true
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Instructor not found' }
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
      console.error('Error updating instructor:', error);
      return {
        status: 500,
        body: { error: 'Failed to update instructor' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully update instructor
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/instructor-123/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        firstName: 'Updated',
        lastName: 'Instructor',
        bio: 'Updated instructor bio'
      }
    });
    
    const response1 = await handleUpdateInstructor(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.instructor || !response1.body.success) {
      throw new Error('Response should include instructor data and success flag');
    }
    
    if (response1.body.instructor.firstName !== 'Updated') {
      throw new Error('Instructor first name was not updated correctly');
    }
    
    console.log('✅ Successfully updated instructor');
    
    // Test case 2: Non-existent instructor
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/non-existent/update'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        firstName: 'This Will Fail'
      }
    });
    
    const response2 = await handleUpdateInstructor(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent instructor');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/instructor-123/update'),
      method: 'PUT',
      body: {
        firstName: 'Unauthorized Update'
      }
    });
    
    const response3 = await handleUpdateInstructor(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update instructor endpoint:', error);
    return false;
  }
}

// Test delete instructor endpoint
async function testDeleteInstructorEndpoint() {
  console.log('\n📋 Testing DELETE /api/instructors/[id]...');
  
  // Mock implementation of DELETE /api/instructors/[id] endpoint
  async function handleDeleteInstructor(request) {
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
      
      // Extract instructor ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const instructorId = pathParts[pathParts.length - 1];
      
      if (!instructorId) {
        return {
          status: 400,
          body: { error: 'Instructor ID is required' }
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
          
          // Get instructor data
          try {
            const instructor = await API.getDocument('instructors', instructorId);
            
            // Check if instructor belongs to this business
            if (instructor.businessId !== business.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Instructor does not belong to this business.' }
              };
            }
            
            // Check if instructor is assigned to any active classes
            const classes = await API.getDocuments('classes', { instructorId: instructorId });
            
            if (classes.length > 0) {
              return {
                status: 400,
                body: { error: 'Cannot delete instructor with assigned classes' }
              };
            }
            
            // In a real implementation, this would delete from the database
            await API.deleteDocument('instructors', instructorId);
            
            return {
              status: 200,
              body: { success: true }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Instructor not found' }
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
      console.error('Error deleting instructor:', error);
      return {
        status: 500,
        body: { error: 'Failed to delete instructor' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully delete instructor
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/instructor-123'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleDeleteInstructor(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (response1.body.success !== true) {
      throw new Error('Response should indicate success');
    }
    
    console.log('✅ Successfully deleted instructor');
    
    // Test case 2: Non-existent instructor
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/non-existent'),
      method: 'DELETE',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleDeleteInstructor(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent instructor');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/instructors/instructor-123'),
      method: 'DELETE'
    });
    
    const response3 = await handleDeleteInstructor(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing delete instructor endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getAllInstructorsResult = await testGetAllInstructorsEndpoint();
    const getInstructorByIdResult = await testGetInstructorByIdEndpoint();
    const createInstructorResult = await testCreateInstructorEndpoint();
    const updateInstructorResult = await testUpdateInstructorEndpoint();
    const deleteInstructorResult = await testDeleteInstructorEndpoint();
    
    if (getAllInstructorsResult && getInstructorByIdResult && createInstructorResult && updateInstructorResult && deleteInstructorResult) {
      console.log('\n🎉 All Instructor API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Instructor API Endpoint tests failed!');
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