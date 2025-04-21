// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing Partner App Booking API Endpoints...');

// Test get all bookings endpoint
async function testGetAllBookingsEndpoint() {
  console.log('\n📋 Testing GET /api/bookings...');
  
  // Mock implementation of GET /api/bookings endpoint
  async function handleGetAllBookings(request) {
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
      const classId = url.searchParams.get('classId');
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      const status = url.searchParams.get('status');
      const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit'), 10) : 50;
      
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
          
          // Build filter
          let filter = { businessId: partner.id };
          
          if (studioId) {
            // Verify studio belongs to this partner
            try {
              const studio = await API.getDocument('studios', studioId);
              if (studio.businessId !== partner.id) {
                return {
                  status: 403,
                  body: { error: 'Access denied. Studio does not belong to this partner.' }
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
          
          if (classId) {
            // Verify class belongs to this partner
            try {
              const classData = await API.getDocument('classes', classId);
              if (classData.businessId !== partner.id) {
                return {
                  status: 403,
                  body: { error: 'Access denied. Class does not belong to this partner.' }
                };
              }
              filter.classId = classId;
            } catch (error) {
              return {
                status: 404,
                body: { error: 'Class not found' }
              };
            }
          }
          
          // Get bookings matching the filter
          let bookings = await API.getDocuments('bookings', filter);
          
          // Filter by date range if provided
          if (startDate) {
            const startDateTime = new Date(startDate).getTime();
            if (!isNaN(startDateTime)) {
              bookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.classDate).getTime();
                return bookingDate >= startDateTime;
              });
            }
          }
          
          if (endDate) {
            const endDateTime = new Date(endDate).getTime();
            if (!isNaN(endDateTime)) {
              bookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.classDate).getTime();
                return bookingDate <= endDateTime;
              });
            }
          }
          
          // Filter by status if provided
          if (status) {
            bookings = bookings.filter(booking => booking.status === status);
          }
          
          // Sort by date (newest first)
          bookings.sort((a, b) => new Date(b.classDate) - new Date(a.classDate));
          
          // Apply limit
          bookings = bookings.slice(0, limit);
          
          // Augment booking data with user names
          const augmentedBookings = await Promise.all(bookings.map(async (booking) => {
            try {
              const user = await API.getUserById(booking.userId);
              return {
                ...booking,
                userName: `${user.firstName} ${user.lastName}`,
                userEmail: user.email
              };
            } catch (error) {
              return {
                ...booking,
                userName: 'Unknown User',
                userEmail: 'unknown@example.com'
              };
            }
          }));
          
          // Calculate statistics
          const totalBookings = bookings.length;
          const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
          const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length;
          const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
          
          return {
            status: 200,
            body: { 
              bookings: augmentedBookings,
              count: totalBookings,
              stats: {
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                pendingBookings
              },
              filters: {
                studioId: studioId || null,
                classId: classId || null,
                startDate: startDate || null,
                endDate: endDate || null,
                status: status || null
              }
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
      console.error('Error getting bookings:', error);
      return {
        status: 500,
        body: { error: 'Failed to get bookings' }
      };
    }
  }
  
  try {
    // Test case 1: Get all bookings for partner
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetAllBookings(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.bookings || !Array.isArray(response1.body.bookings)) {
      throw new Error('Response should include bookings array');
    }
    
    if (!response1.body.stats || typeof response1.body.stats.totalBookings !== 'number') {
      throw new Error('Response should include booking statistics');
    }
    
    console.log('✅ Successfully retrieved all bookings for partner');
    
    // Test case 2: Get bookings for a specific studio
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetAllBookings(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    console.log('✅ Successfully retrieved bookings for a specific studio');
    
    // Test case 3: Get bookings for a specific class
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings', { classId: 'class-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleGetAllBookings(request3);
    
    if (response3.status !== 200) {
      throw new Error(`Expected status 200, got ${response3.status}`);
    }
    
    console.log('✅ Successfully retrieved bookings for a specific class');
    
    // Test case 4: Get bookings with date range
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings', { 
        startDate: '2023-01-01', 
        endDate: '2023-12-31' 
      }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response4 = await handleGetAllBookings(request4);
    
    if (response4.status !== 200) {
      throw new Error(`Expected status 200, got ${response4.status}`);
    }
    
    console.log('✅ Successfully retrieved bookings with date range');
    
    // Test case 5: Get bookings with specific status
    const request5 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings', { status: 'confirmed' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response5 = await handleGetAllBookings(request5);
    
    if (response5.status !== 200) {
      throw new Error(`Expected status 200, got ${response5.status}`);
    }
    
    console.log('✅ Successfully retrieved bookings with specific status');
    
    // Test case 6: Unauthorized request (no token)
    const request6 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings'),
      method: 'GET'
    });
    
    const response6 = await handleGetAllBookings(request6);
    
    if (response6.status !== 401) {
      throw new Error(`Expected status 401, got ${response6.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get all bookings endpoint:', error);
    return false;
  }
}

// Test get booking details endpoint
async function testGetBookingDetailsEndpoint() {
  console.log('\n📋 Testing GET /api/bookings/[id]...');
  
  // Mock implementation of GET /api/bookings/[id] endpoint
  async function handleGetBookingDetails(request) {
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
      
      // Extract booking ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const bookingId = pathParts[pathParts.length - 1];
      
      if (!bookingId) {
        return {
          status: 400,
          body: { error: 'Booking ID is required' }
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
          
          // Get booking data
          try {
            const booking = await API.getDocument('bookings', bookingId);
            
            // Check if booking belongs to this partner
            if (booking.businessId !== partner.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Booking does not belong to this partner.' }
              };
            }
            
            // Get associated class
            let classData = null;
            try {
              if (booking.classId) {
                classData = await API.getDocument('classes', booking.classId);
              }
            } catch (error) {
              // Class not found, continue without class details
            }
            
            // Get associated studio
            let studio = null;
            try {
              if (booking.studioId) {
                studio = await API.getDocument('studios', booking.studioId);
              }
            } catch (error) {
              // Studio not found, continue without studio details
            }
            
            // Get associated user
            let userData = null;
            try {
              if (booking.userId) {
                const userFull = await API.getUserById(booking.userId);
                userData = {
                  id: userFull.id,
                  firstName: userFull.firstName,
                  lastName: userFull.lastName,
                  email: userFull.email,
                  phone: userFull.phone || null,
                  profileImage: userFull.profileImage || null
                };
              }
            } catch (error) {
              // User not found, continue without user details
            }
            
            // Get payment information
            let paymentInfo = null;
            try {
              if (booking.paymentId) {
                paymentInfo = await API.getDocument('payments', booking.paymentId);
              }
            } catch (error) {
              // Payment not found, continue without payment details
            }
            
            return {
              status: 200,
              body: { 
                booking,
                class: classData,
                studio,
                user: userData,
                payment: paymentInfo
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Booking not found' }
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
      console.error('Error getting booking details:', error);
      return {
        status: 500,
        body: { error: 'Failed to get booking details' }
      };
    }
  }
  
  try {
    // Test case 1: Get existing booking
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetBookingDetails(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.booking || response1.body.booking.id !== 'booking-123') {
      throw new Error('Response should include booking data');
    }
    
    console.log('✅ Successfully retrieved booking details');
    
    // Test case 2: Get non-existent booking
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/non-existent'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetBookingDetails(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent booking');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123'),
      method: 'GET'
    });
    
    const response3 = await handleGetBookingDetails(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get booking details endpoint:', error);
    return false;
  }
}

// Test update booking status endpoint
async function testUpdateBookingStatusEndpoint() {
  console.log('\n📋 Testing PUT /api/bookings/[id]/status...');
  
  // Mock implementation of PUT /api/bookings/[id]/status endpoint
  async function handleUpdateBookingStatus(request) {
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
      
      // Extract booking ID from URL
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      const bookingId = pathParts[pathParts.length - 2]; // Account for /status at the end
      
      if (!bookingId) {
        return {
          status: 400,
          body: { error: 'Booking ID is required' }
        };
      }
      
      // Get request body
      const body = request.bodyJson || {};
      
      // Validate required fields
      if (!body.status) {
        return {
          status: 400,
          body: { error: 'Status is required' }
        };
      }
      
      // Validate status value
      const allowedStatuses = ['confirmed', 'cancelled', 'pending', 'no-show'];
      if (!allowedStatuses.includes(body.status)) {
        return {
          status: 400,
          body: { error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` }
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
          
          // Get booking data
          try {
            let booking = await API.getDocument('bookings', bookingId);
            
            // Check if booking belongs to this partner
            if (booking.businessId !== partner.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Booking does not belong to this partner.' }
              };
            }
            
            // Update booking status
            booking.status = body.status;
            booking.statusUpdatedAt = new Date().toISOString();
            booking.statusUpdatedBy = userId;
            
            if (body.notes) {
              booking.businessNotes = body.notes;
            }
            
            // In a real implementation, this would update the database
            // and potentially trigger notifications
            const updatedBooking = await API.updateDocument('bookings', bookingId, booking);
            
            // Get associated class
            let classData = null;
            try {
              if (updatedBooking.classId) {
                classData = await API.getDocument('classes', updatedBooking.classId);
              }
            } catch (error) {
              // Class not found, continue without class details
            }
            
            return {
              status: 200,
              body: { 
                booking: updatedBooking,
                class: classData,
                success: true
              }
            };
          } catch (error) {
            return {
              status: 404,
              body: { error: 'Booking not found' }
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
      console.error('Error updating booking status:', error);
      return {
        status: 500,
        body: { error: 'Failed to update booking status' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully update booking status to confirmed
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123/status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        status: 'confirmed',
        notes: 'Customer confirmed via phone call'
      }
    });
    
    const response1 = await handleUpdateBookingStatus(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.booking || response1.body.booking.status !== 'confirmed') {
      throw new Error('Response should include updated booking with confirmed status');
    }
    
    console.log('✅ Successfully updated booking status to confirmed');
    
    // Test case 2: Update booking status to cancelled
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123/status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        status: 'cancelled',
        notes: 'Customer requested cancellation'
      }
    });
    
    const response2 = await handleUpdateBookingStatus(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    if (!response2.body.booking || response2.body.booking.status !== 'cancelled') {
      throw new Error('Response should include updated booking with cancelled status');
    }
    
    console.log('✅ Successfully updated booking status to cancelled');
    
    // Test case 3: Update with invalid status
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123/status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        status: 'invalid-status'
      }
    });
    
    const response3 = await handleUpdateBookingStatus(request3);
    
    if (response3.status !== 400) {
      throw new Error(`Expected status 400, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled invalid status');
    
    // Test case 4: Update non-existent booking
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/non-existent/status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        status: 'confirmed'
      }
    });
    
    const response4 = await handleUpdateBookingStatus(request4);
    
    if (response4.status !== 404) {
      throw new Error(`Expected status 404, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled non-existent booking');
    
    // Test case 5: Unauthorized request (no token)
    const request5 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123/status'),
      method: 'PUT',
      body: {
        status: 'confirmed'
      }
    });
    
    const response5 = await handleUpdateBookingStatus(request5);
    
    if (response5.status !== 401) {
      throw new Error(`Expected status 401, got ${response5.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update booking status endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getAllBookingsResult = await testGetAllBookingsEndpoint();
    const getBookingDetailsResult = await testGetBookingDetailsEndpoint();
    const updateBookingStatusResult = await testUpdateBookingStatusEndpoint();
    
    if (getAllBookingsResult && getBookingDetailsResult && updateBookingStatusResult) {
      console.log('\n🎉 All Booking API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Booking API Endpoint tests failed!');
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error running tests:', error);
    return false;
  }
}

// Run the tests
runAllTests().then(success => {
// Test create manual booking endpoint
async function testCreateManualBookingEndpoint() {
  console.log('\n📋 Testing POST /api/bookings/create-manual...');
  
  // Mock implementation of POST /api/bookings/create-manual endpoint
  async function handleCreateManualBooking(request) {
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
      if (!body.classId || !body.classDate || !body.userDetails) {
        return {
          status: 400,
          body: { error: 'Class ID, class date, and user details are required' }
        };
      }
      
      // Validate user details
      if (!body.userDetails.email || !body.userDetails.firstName || !body.userDetails.lastName) {
        return {
          status: 400,
          body: { error: 'User email, first name, and last name are required' }
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
          
          // Get class data
          try {
            const classData = await API.getDocument('classes', body.classId);
            
            // Check if class belongs to this partner
            if (classData.businessId !== partner.id) {
              return {
                status: 403,
                body: { error: 'Access denied. Class does not belong to this partner.' }
              };
            }
            
            // Get studio data
            try {
              const studio = await API.getDocument('studios', classData.studioId);
              
              // Check class capacity
              const existingBookings = await API.getDocuments('bookings', { 
                classId: body.classId,
                classDate: body.classDate,
                status: 'confirmed'
              });
              
              if (existingBookings.length >= classData.capacity) {
                return {
                  status: 400,
                  body: { error: 'Class is fully booked' }
                };
              }
              
              // Check for existing user account or create ghost user
              let bookingUserId = null;
              let existingUser = null;
              
              // Try to find existing user by email
              try {
                // In a real implementation, we'd search the database
                // For testing, we'll just simulate finding a user or creating a ghost user
                existingUser = { id: 'ghost-user-123' };
                bookingUserId = existingUser.id;
              } catch (error) {
                // User not found, continue with ghost user
                bookingUserId = 'ghost-user-123';
              }
              
              // Create booking
              const bookingData = {
                businessId: partner.id,
                studioId: studio.id,
                classId: body.classId,
                userId: bookingUserId,
                status: 'confirmed',
                paymentStatus: body.paymentStatus || 'paid',
                createdAt: new Date().toISOString(),
                classDate: body.classDate,
                price: body.price || classData.price || 0,
                participants: body.participants || 1,
                notes: [{
                  content: 'Manual booking created by staff',
                  createdAt: new Date().toISOString(),
                  createdBy: 'partner'
                }],
                userDetails: body.userDetails // Store user details for ghost users
              };
              
              const newBooking = await API.createDocument('bookings', bookingData);
              
              return {
                status: 201,
                body: { 
                  booking: newBooking,
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
              body: { error: 'Class not found' }
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
      console.error('Error creating manual booking:', error);
      return {
        status: 500,
        body: { error: 'Failed to create manual booking' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully create manual booking
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/create-manual'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        classId: 'class-123',
        classDate: '2023-12-01T18:00:00Z',
        price: 25,
        paymentStatus: 'paid',
        participants: 1,
        userDetails: {
          firstName: 'Walk-in',
          lastName: 'Customer',
          email: 'walkin@example.com',
          phone: '+1234567890'
        }
      }
    });
    
    const response1 = await handleCreateManualBooking(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    if (!response1.body.booking || !response1.body.success) {
      throw new Error('Response should include booking data and success flag');
    }
    
    console.log('✅ Successfully created manual booking');
    
    // Test case 2: Missing required fields
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/create-manual'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        classId: 'class-123'
        // Missing classDate and userDetails
      }
    });
    
    const response2 = await handleCreateManualBooking(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing required fields');
    
    // Test case 3: Unauthorized request (no token)
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/create-manual'),
      method: 'POST',
      body: {
        classId: 'class-123',
        classDate: '2023-12-01T18:00:00Z',
        userDetails: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        }
      }
    });
    
    const response3 = await handleCreateManualBooking(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing create manual booking endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const getAllBookingsResult = await testGetAllBookingsEndpoint();
    const getBookingByIdResult = await testGetBookingByIdEndpoint();
    const updateBookingStatusResult = await testUpdateBookingStatusEndpoint();
    const createManualBookingResult = await testCreateManualBookingEndpoint();
    
    if (getAllBookingsResult && getBookingByIdResult && updateBookingStatusResult && createManualBookingResult) {
      console.log('\n🎉 All Booking API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Booking API Endpoint tests failed!');
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