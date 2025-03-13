// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import the mock API
const API = require('./mock-api');

// Import our mock implementation of ExpoRouter
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');

// Log the start of the test
console.log('🔍 Testing User App Booking API Endpoints...');

// Helper: Create mock bookings data
const mockBookings = {
  'booking-123': {
    id: 'booking-123',
    userId: 'user-123',
    classId: 'class-123',
    studioId: 'studio-123',
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2023-12-01T12:00:00.000Z',
    classDate: '2023-12-15T10:00:00.000Z',
    price: 15.99,
    participants: 1
  },
  'booking-456': {
    id: 'booking-456',
    userId: 'user-123',
    classId: 'class-456',
    studioId: 'studio-123',
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2023-12-05T14:30:00.000Z',
    classDate: '2023-12-20T15:00:00.000Z',
    price: 19.99,
    participants: 2
  }
};

// Extend API mock to include bookings
API.getBookings = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  return Object.values(mockBookings).filter(booking => booking.userId === userId);
};

API.getBookingById = async (bookingId) => {
  if (!bookingId) throw new Error('Booking ID is required');
  
  const booking = mockBookings[bookingId];
  if (!booking) throw new Error('Booking not found');
  
  return booking;
};

API.createBooking = async (bookingData) => {
  if (!bookingData.userId || !bookingData.classId) {
    throw new Error('User ID and Class ID are required');
  }
  
  const bookingId = `booking-${Date.now()}`;
  const booking = {
    id: bookingId,
    ...bookingData,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockBookings[bookingId] = booking;
  return booking;
};

API.updateBookingStatus = async (bookingId, status) => {
  if (!bookingId) throw new Error('Booking ID is required');
  if (!status) throw new Error('Status is required');
  
  const booking = mockBookings[bookingId];
  if (!booking) throw new Error('Booking not found');
  
  booking.status = status;
  return booking;
};

// Test create booking endpoint
async function testCreateBookingEndpoint() {
  console.log('\n📋 Testing POST /api/bookings/create...');
  
  // Mock implementation of POST /api/bookings/create endpoint
  async function handleCreateBooking(request) {
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
      
      // Get the request body
      const body = request.bodyJson || {};
      
      if (!body.classId) {
        return {
          status: 400,
          body: { error: 'Class ID is required' }
        };
      }
      
      // Verify the class exists
      let classData;
      try {
        classData = await API.getDocument('classes', body.classId);
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Class not found' }
        };
      }
      
      // Create the booking
      const bookingData = {
        userId,
        classId: body.classId,
        studioId: classData.studioId,
        classDate: body.classDate || new Date().toISOString(),
        price: classData.price || 0,
        participants: body.participants || 1,
      };
      
      try {
        const booking = await API.createBooking(bookingData);
        
        return {
          status: 201,
          body: { 
            success: true,
            booking 
          }
        };
      } catch (error) {
        return {
          status: 400,
          body: { error: 'Failed to create booking' }
        };
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        status: 500,
        body: { error: 'Failed to create booking' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully create booking
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        classId: 'class-123',
        classDate: '2023-12-30T10:00:00.000Z',
        participants: 1
      }
    });
    
    const response1 = await handleCreateBooking(request1);
    
    if (response1.status !== 201) {
      throw new Error(`Expected status 201, got ${response1.status}`);
    }
    
    if (!response1.body.success || !response1.body.booking) {
      throw new Error('Response should include success flag and booking data');
    }
    
    console.log('✅ Successfully created booking');
    
    // Test case 2: Missing class ID
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/create'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        classDate: '2023-12-30T10:00:00.000Z',
        participants: 1
      }
    });
    
    const response2 = await handleCreateBooking(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing class ID');
    
    // Test case 3: Unauthorized request
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/create'),
      method: 'POST',
      body: {
        classId: 'class-123',
        classDate: '2023-12-30T10:00:00.000Z',
        participants: 1
      }
      // No auth header
    });
    
    const response3 = await handleCreateBooking(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing create booking endpoint:', error);
    return false;
  }
}

// Test get user bookings endpoint
async function testGetUserBookingsEndpoint() {
  console.log('\n📋 Testing GET /api/bookings/my-bookings...');
  
  // Mock implementation of GET /api/bookings/my-bookings endpoint
  async function handleGetUserBookings(request) {
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
      
      // Get bookings for the user
      try {
        const bookings = await API.getBookings(userId);
        
        // Get additional details for each booking
        const bookingsWithDetails = await Promise.all(bookings.map(async (booking) => {
          let classData = null;
          let studioData = null;
          
          try {
            classData = await API.getDocument('classes', booking.classId);
          } catch (error) {
            // Class not found, continue
          }
          
          try {
            studioData = await API.getDocument('studios', booking.studioId);
          } catch (error) {
            // Studio not found, continue
          }
          
          return {
            ...booking,
            class: classData ? {
              id: classData.id,
              name: classData.name,
              duration: classData.duration
            } : null,
            studio: studioData ? {
              id: studioData.id,
              name: studioData.name
            } : null
          };
        }));
        
        return {
          status: 200,
          body: { 
            bookings: bookingsWithDetails,
            count: bookingsWithDetails.length
          }
        };
      } catch (error) {
        return {
          status: 400,
          body: { error: 'Failed to retrieve bookings' }
        };
      }
    } catch (error) {
      console.error('Error getting user bookings:', error);
      return {
        status: 500,
        body: { error: 'Failed to retrieve bookings' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully get user bookings
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/my-bookings'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetUserBookings(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.bookings || !Array.isArray(response1.body.bookings)) {
      throw new Error('Response should include bookings array');
    }
    
    console.log('✅ Successfully retrieved user bookings');
    
    // Test case 2: Unauthorized request
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/my-bookings'),
      method: 'GET'
      // No auth header
    });
    
    const response2 = await handleGetUserBookings(request2);
    
    if (response2.status !== 401) {
      throw new Error(`Expected status 401, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get user bookings endpoint:', error);
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
      
      // Get booking details
      try {
        const booking = await API.getBookingById(bookingId);
        
        // Check if the booking belongs to the authenticated user
        if (booking.userId !== userId) {
          return {
            status: 403,
            body: { error: 'You do not have permission to view this booking' }
          };
        }
        
        // Get class and studio details
        let classData = null;
        let studioData = null;
        
        try {
          classData = await API.getDocument('classes', booking.classId);
        } catch (error) {
          // Class not found, continue
        }
        
        try {
          studioData = await API.getDocument('studios', booking.studioId);
        } catch (error) {
          // Studio not found, continue
        }
        
        return {
          status: 200,
          body: { 
            booking,
            class: classData,
            studio: studioData
          }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Booking not found' }
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
    // Test case 1: Successfully get booking details
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
      throw new Error('Response should include booking details');
    }
    
    console.log('✅ Successfully retrieved booking details');
    
    // Test case 2: Non-existent booking
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
    
    // Test case 3: Unauthorized request
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123'),
      method: 'GET'
      // No auth header
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

// Test cancel booking endpoint
async function testCancelBookingEndpoint() {
  console.log('\n📋 Testing POST /api/bookings/[id]/cancel...');
  
  // Mock implementation of POST /api/bookings/[id]/cancel endpoint
  async function handleCancelBooking(request) {
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
      const bookingId = pathParts[pathParts.length - 2]; // Account for /cancel at the end
      
      if (!bookingId) {
        return {
          status: 400,
          body: { error: 'Booking ID is required' }
        };
      }
      
      // Get booking details
      try {
        const booking = await API.getBookingById(bookingId);
        
        // Check if the booking belongs to the authenticated user
        if (booking.userId !== userId) {
          return {
            status: 403,
            body: { error: 'You do not have permission to cancel this booking' }
          };
        }
        
        // Check if the booking can be canceled
        if (booking.status === 'canceled') {
          return {
            status: 400,
            body: { error: 'Booking is already canceled' }
          };
        }
        
        // Cancel the booking
        const updatedBooking = await API.updateBookingStatus(bookingId, 'canceled');
        
        return {
          status: 200,
          body: { 
            success: true,
            booking: updatedBooking
          }
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Booking not found' }
        };
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      return {
        status: 500,
        body: { error: 'Failed to cancel booking' }
      };
    }
  }
  
  try {
    // Test case 1: Successfully cancel booking
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123/cancel'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleCancelBooking(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    if (!response1.body.success || !response1.body.booking) {
      throw new Error('Response should include success flag and updated booking');
    }
    
    if (response1.body.booking.status !== 'canceled') {
      throw new Error(`Expected booking status to be 'canceled', got '${response1.body.booking.status}'`);
    }
    
    console.log('✅ Successfully canceled booking');
    
    // Test case 2: Non-existent booking
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/non-existent/cancel'),
      method: 'POST',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleCancelBooking(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent booking');
    
    // Test case 3: Unauthorized request
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/booking-123/cancel'),
      method: 'POST'
      // No auth header
    });
    
    const response3 = await handleCancelBooking(request3);
    
    if (response3.status !== 401) {
      throw new Error(`Expected status 401, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized request');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing cancel booking endpoint:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  try {
    const createBookingResult = await testCreateBookingEndpoint();
    const getUserBookingsResult = await testGetUserBookingsEndpoint();
    const getBookingDetailsResult = await testGetBookingDetailsEndpoint();
    const cancelBookingResult = await testCancelBookingEndpoint();
    
    if (createBookingResult && getUserBookingsResult && 
        getBookingDetailsResult && cancelBookingResult) {
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