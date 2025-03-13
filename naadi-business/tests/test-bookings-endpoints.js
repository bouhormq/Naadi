// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

// Import mock functions
const { MockExpoRequest, MockExpoResponse, createRequestUrl, createAuthHeader } = require('./mock-expo-router');
const API = require('./mock-api');

// Log the start of the test
console.log('🔍 Testing Business App Bookings API Endpoints...');

// Test studio bookings endpoint
async function testStudioBookingsEndpoint() {
  console.log('\n📋 Testing GET /api/bookings/studio...');

  // Mock implementation of GET /api/bookings/studio endpoint
  async function handleStudioBookings(request) {
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
      
      // Get user data to verify business account
      const user = await API.getUserById(userId);
      
      if (user.role !== 'business') {
        return {
          status: 403,
          body: { error: 'Access denied. Business account required.' }
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
      
      // Get filter params
      const status = url.searchParams.get('status');
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');
      
      // Get the studio to verify ownership
      try {
        const studio = await API.getDocument('studios', studioId);
        // Get the business to verify ownership
        const business = await API.getBusinessByOwnerId(userId);
        
        if (studio.businessId !== business.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not manage this studio.' }
          };
        }
        
        // Build filter
        const filter = { studioId };
        if (status) filter.status = status;
        
        // Get bookings
        let bookings = await API.getDocuments('bookings', filter);
        
        // Filter by date if provided
        if (startDate || endDate) {
          bookings = bookings.filter(booking => {
            const bookingDate = new Date(booking.classDate);
            if (startDate && new Date(startDate) > bookingDate) return false;
            if (endDate && new Date(endDate) < bookingDate) return false;
            return true;
          });
        }
        
        return {
          status: 200,
          body: bookings
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Studio not found' }
        };
      }
    } catch (error) {
      console.error('Error in studio bookings endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch bookings' }
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
          businessId: 'business-123',
          name: 'Yoga Studio',
          address: '123 Yoga St'
        },
        'studio-456': {
          id: 'studio-456',
          businessId: 'business-456',
          name: 'Pilates Studio',
          address: '456 Pilates Ave'
        }
      };
    }
    
    // Initialize business
    if (!API.mockData.businesses) {
      API.mockData.businesses = {
        'business-123': {
          id: 'business-123',
          ownerId: 'user-123',
          name: 'Yoga Business'
        },
        'business-456': {
          id: 'business-456',
          ownerId: 'user-456',
          name: 'Pilates Business'
        }
      };
    }
    
    // Initialize users
    if (!API.mockData.users) {
      API.mockData.users = {
        'user-123': {
          id: 'user-123',
          email: 'business@example.com',
          role: 'business'
        }
      };
    }
    
    // Initialize bookings
    if (!API.mockData.bookings) {
      API.mockData.bookings = {
        'booking-123': {
          id: 'booking-123',
          userId: 'user-789',
          studioId: 'studio-123',
          classId: 'class-123',
          status: 'pending',
          classDate: new Date().toISOString()
        },
        'booking-456': {
          id: 'booking-456',
          userId: 'user-789',
          studioId: 'studio-123',
          classId: 'class-456',
          status: 'confirmed',
          classDate: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        }
      };
    }
    
    // Test case 1: Get all bookings for a studio
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/studio', { studioId: 'studio-123' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleStudioBookings(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const bookings1 = response1.body;
    
    if (!Array.isArray(bookings1) || bookings1.length !== 2) {
      throw new Error(`Expected 2 bookings, got ${bookings1.length}`);
    }
    
    console.log('✅ Successfully retrieved all bookings for a studio');
    
    // Test case 2: Filter bookings by status
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/studio', { 
        studioId: 'studio-123',
        status: 'confirmed'
      }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleStudioBookings(request2);
    
    if (response2.status !== 200) {
      throw new Error(`Expected status 200, got ${response2.status}`);
    }
    
    const bookings2 = response2.body;
    
    if (!Array.isArray(bookings2) || bookings2.length !== 1 || bookings2[0].status !== 'confirmed') {
      throw new Error('Expected 1 confirmed booking');
    }
    
    console.log('✅ Successfully filtered bookings by status');
    
    // Test case 3: Missing studio ID
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/studio'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response3 = await handleStudioBookings(request3);
    
    if (response3.status !== 400) {
      throw new Error(`Expected status 400, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled missing studio ID');
    
    // Test case 4: Unauthorized access
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/studio', { studioId: 'studio-123' }),
      method: 'GET'
    });
    
    const response4 = await handleStudioBookings(request4);
    
    if (response4.status !== 401) {
      throw new Error(`Expected status 401, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized access');
    
    // Test case 5: Studio not owned by business
    const request5 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/studio', { studioId: 'studio-456' }),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response5 = await handleStudioBookings(request5);
    
    if (response5.status !== 403) {
      throw new Error(`Expected status 403, got ${response5.status}`);
    }
    
    console.log('✅ Correctly handled unauthorized studio access');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing studio bookings endpoint:', error);
    return false;
  }
}

// Test get booking by ID endpoint
async function testGetBookingByIdEndpoint() {
  console.log('\n📋 Testing GET /api/bookings/[id]...');
  
  // Mock implementation of GET /api/bookings/[id] endpoint
  async function handleGetBookingById(request) {
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
      
      // Get user data to verify business account
      const user = await API.getUserById(userId);
      
      if (user.role !== 'business') {
        return {
          status: 403,
          body: { error: 'Access denied. Business account required.' }
        };
      }
      
      // Get bookingId from path
      // Extract the bookingId from the URL - comes after /api/bookings/
      const urlParts = request.url.split('/');
      console.log('URL parts:', urlParts);
      const bookingId = urlParts[urlParts.length - 1].split('?')[0];
      console.log('Extracted booking ID:', bookingId);
      
      if (!bookingId) {
        return {
          status: 400,
          body: { error: 'Booking ID is required' }
        };
      }
      
      try {
        // Get booking data
        console.log('Looking for booking with ID:', bookingId);
        console.log('Available bookings:', Object.keys(API.mockData.bookings));
        const booking = await API.getDocument('bookings', bookingId);
        console.log('Found booking:', booking);
        
        // Get business to verify ownership
        const business = await API.getBusinessByOwnerId(userId);
        
        // Get studio to verify it belongs to the business
        const studio = await API.getDocument('studios', booking.studioId);
        
        if (studio.businessId !== business.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not manage this studio.' }
          };
        }
        
        // Get additional data to enrich the booking response
        const classData = booking.classId ? await API.getDocument('classes', booking.classId) : null;
        const userData = booking.userId ? await API.getDocument('users', booking.userId) : null;
        
        // Enrich booking data
        const enrichedBooking = {
          ...booking,
          className: classData?.name || null,
          userName: userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() : null,
          userEmail: userData?.email || null
        };
        
        return {
          status: 200,
          body: enrichedBooking
        };
      } catch (error) {
        console.error('Error getting booking:', error);
        return {
          status: 404,
          body: { error: 'Booking not found' }
        };
      }
    } catch (error) {
      console.error('Error in get booking by ID endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to fetch booking' }
      };
    }
  }
  
  try {
    // Test case 1: Get booking by ID
    // Make sure the booking exists in the mock data
    const bookingId = 'booking-123';
    
    // Add the booking directly to the mockBookings object that getDocument uses
    API.mockData.bookings[bookingId] = {
      id: bookingId,
      userId: 'user-789',
      studioId: 'studio-123',
      classId: 'class-123',
      status: 'pending',
      classDate: new Date().toISOString()
    };
    
    // Make sure the class exists in the mock data
    if (!API.mockData.classes) {
      API.mockData.classes = {};
    }
    API.mockData.classes['class-123'] = {
      id: 'class-123',
      businessId: 'business-123',
      studioId: 'studio-123',
      name: 'Yoga Class',
      description: 'A relaxing yoga class',
      instructor: 'John Doe',
      duration: 60,
      capacity: 20,
      price: 15.99
    };
    
    // Make sure the user exists in the mock data
    if (!API.mockData.users['user-789']) {
      API.mockData.users['user-789'] = {
        id: 'user-789',
        email: 'client@example.com',
        firstName: 'Client',
        lastName: 'User',
        role: 'user'
      };
    }
    
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/' + bookingId),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response1 = await handleGetBookingById(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const booking = response1.body;
    
    if (!booking || booking.id !== 'booking-123') {
      throw new Error('Response should include the booking data');
    }
    
    console.log('✅ Successfully retrieved booking by ID');
    
    // Test case 2: Non-existent booking
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/non-existent'),
      method: 'GET',
      headers: createAuthHeader('valid-token-user-123')
    });
    
    const response2 = await handleGetBookingById(request2);
    
    if (response2.status !== 404) {
      throw new Error(`Expected status 404, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled non-existent booking');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing get booking by ID endpoint:', error);
    return false;
  }
}

// Test update booking status endpoint
async function testUpdateBookingStatusEndpoint() {
  console.log('\n📋 Testing PUT /api/bookings/update-status...');
  
  // Mock implementation of PUT /api/bookings/update-status endpoint
  async function updateBookingStatus(request) {
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
      
      // Get user data to verify business account
      const user = await API.getUserById(userId);
      
      if (user.role !== 'business') {
        return {
          status: 403,
          body: { error: 'Access denied. Business account required.' }
        };
      }
      
      // Get request body
      const body = await request.json();
      
      // Validate required fields
      if (!body.bookingId) {
        return {
          status: 400,
          body: { error: 'Booking ID is required' }
        };
      }
      
      if (!body.status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(body.status)) {
        return {
          status: 400,
          body: { error: 'Valid status is required: pending, confirmed, cancelled, or completed' }
        };
      }
      
      try {
        // Get booking data
        const booking = await API.getDocument('bookings', body.bookingId);
        
        // Get business to verify ownership
        const business = await API.getBusinessByOwnerId(userId);
        
        // Get studio to verify it belongs to the business
        const studio = await API.getDocument('studios', booking.studioId);
        
        if (studio.businessId !== business.id) {
          return {
            status: 403,
            body: { error: 'Access denied. You do not manage this studio.' }
          };
        }
        
        // Update booking status
        const updatedBooking = await API.updateDocument('bookings', body.bookingId, {
          status: body.status
        });
        
        return {
          status: 200,
          body: updatedBooking
        };
      } catch (error) {
        return {
          status: 404,
          body: { error: 'Booking not found' }
        };
      }
    } catch (error) {
      console.error('Error in update booking status endpoint:', error);
      return {
        status: 500,
        body: { error: 'Failed to update booking' }
      };
    }
  }
  
  try {
    // Test case 1: Update booking status
    const request1 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/update-status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        bookingId: 'booking-123',
        status: 'confirmed'
      }
    });
    
    const response1 = await updateBookingStatus(request1);
    
    if (response1.status !== 200) {
      throw new Error(`Expected status 200, got ${response1.status}`);
    }
    
    const updatedBooking = response1.body;
    
    if (!updatedBooking || updatedBooking.status !== 'confirmed') {
      throw new Error('Response should include the updated booking with confirmed status');
    }
    
    console.log('✅ Successfully updated booking status');
    
    // Test case 2: Missing booking ID
    const request2 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/update-status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        status: 'confirmed'
      }
    });
    
    const response2 = await updateBookingStatus(request2);
    
    if (response2.status !== 400) {
      throw new Error(`Expected status 400, got ${response2.status}`);
    }
    
    console.log('✅ Correctly handled missing booking ID');
    
    // Test case 3: Invalid status
    const request3 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/update-status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        bookingId: 'booking-123',
        status: 'invalid-status'
      }
    });
    
    const response3 = await updateBookingStatus(request3);
    
    if (response3.status !== 400) {
      throw new Error(`Expected status 400, got ${response3.status}`);
    }
    
    console.log('✅ Correctly handled invalid status');
    
    // Test case 4: Non-existent booking
    const request4 = new MockExpoRequest({
      url: createRequestUrl('/api/bookings/update-status'),
      method: 'PUT',
      headers: createAuthHeader('valid-token-user-123'),
      body: {
        bookingId: 'non-existent',
        status: 'confirmed'
      }
    });
    
    const response4 = await updateBookingStatus(request4);
    
    if (response4.status !== 404) {
      throw new Error(`Expected status 404, got ${response4.status}`);
    }
    
    console.log('✅ Correctly handled non-existent booking');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing update booking status endpoint:', error);
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
    
    const studioBookingsResult = await testStudioBookingsEndpoint();
    const getBookingByIdResult = await testGetBookingByIdEndpoint();
    const updateStatusResult = await testUpdateBookingStatusEndpoint();
    
    if (studioBookingsResult && getBookingByIdResult && updateStatusResult) {
      console.log('\n🎉 All Bookings API Endpoint tests passed!');
      return true;
    } else {
      console.error('\n❌ Some Bookings API Endpoint tests failed!');
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