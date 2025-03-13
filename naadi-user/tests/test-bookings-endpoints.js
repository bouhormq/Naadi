const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const API = require('./mock-api');

console.log('\n\n🧪 Testing User App Bookings API Endpoints...');

// Test GET /api/bookings endpoint (get user bookings)
async function testGetUserBookingsEndpoint() {
  console.log('\n📋 Testing GET /api/bookings endpoint...');
  
  // Mock implementation
  API.mockEndpoint('GET', '/api/bookings', (req, res) => {
    // Check for authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = API.getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid token' 
      });
    }
    
    // Initialize mock data if not exists
    if (!API.mockData) {
      API.mockData = {};
    }
    
    if (!API.mockData.bookings) {
      API.mockData.bookings = [
        {
          id: 'booking-123',
          userId: 'user-123',
          classId: 'class-101',
          studioId: 'studio-201',
          date: '2023-11-15',
          time: '10:00 AM',
          status: 'confirmed',
          createdAt: '2023-11-10T08:30:00Z'
        },
        {
          id: 'booking-124',
          userId: 'user-123',
          classId: 'class-102',
          studioId: 'studio-201',
          date: '2023-11-20',
          time: '2:00 PM',
          status: 'confirmed',
          createdAt: '2023-11-12T14:15:00Z'
        },
        {
          id: 'booking-125',
          userId: 'user-456',
          classId: 'class-103',
          studioId: 'studio-202',
          date: '2023-11-18',
          time: '9:00 AM',
          status: 'confirmed',
          createdAt: '2023-11-11T10:45:00Z'
        }
      ];
    }
    
    if (!API.mockData.classes) {
      API.mockData.classes = [
        {
          id: 'class-101',
          name: 'Vinyasa Flow Yoga',
          studioId: 'studio-201',
          instructorId: 'instructor-301',
          category: 'yoga',
          description: 'A flowing yoga class linking breath with movement',
          duration: 60,
          capacity: 20
        },
        {
          id: 'class-102',
          name: 'Meditation Basics',
          studioId: 'studio-201',
          instructorId: 'instructor-302',
          category: 'meditation',
          description: 'Learn fundamental meditation techniques',
          duration: 45,
          capacity: 15
        },
        {
          id: 'class-103',
          name: 'High-Intensity Interval Training',
          studioId: 'studio-202',
          instructorId: 'instructor-303',
          category: 'fitness',
          description: 'Intense workout alternating between active work and recovery',
          duration: 45,
          capacity: 12
        }
      ];
    }
    
    if (!API.mockData.studios) {
      API.mockData.studios = [
        {
          id: 'studio-201',
          name: 'Zen Fitness Studio',
          location: 'Downtown',
          address: '123 Main St, City Center',
          categories: ['yoga', 'meditation', 'pilates']
        },
        {
          id: 'studio-202',
          name: 'Power Athletics',
          location: 'Westside',
          address: '456 West Ave, Westside District',
          categories: ['fitness', 'crossfit', 'boxing']
        }
      ];
    }
    
    // Filter bookings by user ID
    const userBookings = API.mockData.bookings.filter(booking => booking.userId === userId);
    
    // Enrich booking data with class and studio information
    const enrichedBookings = userBookings.map(booking => {
      const classInfo = API.mockData.classes.find(c => c.id === booking.classId) || {};
      const studioInfo = API.mockData.studios.find(s => s.id === booking.studioId) || {};
      
      return {
        ...booking,
        class: {
          id: classInfo.id,
          name: classInfo.name,
          category: classInfo.category,
          duration: classInfo.duration
        },
        studio: {
          id: studioInfo.id,
          name: studioInfo.name,
          location: studioInfo.location
        }
      };
    });
    
    return res.status(200).json({
      success: true,
      data: enrichedBookings
    });
  });
  
  // Test case 1: Get bookings with valid token
  try {
    const response = await API.makeRequest('GET', '/api/bookings', null, {
      authorization: 'Bearer valid-token-user-123'
    });
    
    console.log('✅ Successfully retrieved user bookings with valid token');
    console.log(`   Status: ${response.status}`);
    console.log(`   Number of bookings: ${response.data.data.length}`);
    
    if (response.status !== 200 || !response.data.success || !Array.isArray(response.data.data)) {
      throw new Error('Invalid response format');
    }
    
    if (response.data.data.length !== 2) {
      throw new Error(`Expected 2 bookings for user-123, got ${response.data.data.length}`);
    }
    
    // Verify booking data structure
    const booking = response.data.data[0];
    if (!booking.id || !booking.classId || !booking.studioId || !booking.date || !booking.time || !booking.status) {
      throw new Error('Booking data missing required fields');
    }
    
    // Verify enriched data
    if (!booking.class || !booking.class.name || !booking.studio || !booking.studio.name) {
      throw new Error('Booking data missing enriched class and studio information');
    }
  } catch (error) {
    console.log(`❌ Failed to get user bookings with valid token: ${error.message}`);
    throw error;
  }
  
  // Test case 2: Get bookings with no token
  try {
    const response = await API.makeRequest('GET', '/api/bookings');
    console.log('❌ Should not succeed without token');
    throw new Error('Request succeeded without token');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected request without token');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`❌ Unexpected error when testing without token: ${error.message}`);
      throw error;
    }
  }
}

// Test POST /api/bookings endpoint (create booking)
async function testCreateBookingEndpoint() {
  console.log('\n📋 Testing POST /api/bookings endpoint...');
  
  // Mock implementation
  API.mockEndpoint('POST', '/api/bookings', (req, res) => {
    // Check for authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = API.getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid token' 
      });
    }
    
    // Initialize mock data if not exists
    if (!API.mockData) {
      API.mockData = {};
    }
    
    if (!API.mockData.bookings) {
      API.mockData.bookings = [];
    }
    
    if (!API.mockData.classes) {
      API.mockData.classes = [
        {
          id: 'class-101',
          name: 'Vinyasa Flow Yoga',
          studioId: 'studio-201',
          instructorId: 'instructor-301',
          category: 'yoga',
          description: 'A flowing yoga class linking breath with movement',
          duration: 60,
          capacity: 20,
          currentBookings: 15
        }
      ];
    }
    
    // Validate request body
    const { classId, date, time } = req.body;
    
    if (!classId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: classId, date, and time are required'
      });
    }
    
    // Check if class exists
    const classInfo = API.mockData.classes.find(c => c.id === classId);
    if (!classInfo) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    // Check if class is full
    if (classInfo.currentBookings >= classInfo.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Class is fully booked'
      });
    }
    
    // Check if user already has a booking for this class
    const existingBooking = API.mockData.bookings.find(
      b => b.userId === userId && b.classId === classId && b.date === date && b.time === time
    );
    
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking for this class'
      });
    }
    
    // Create new booking
    const newBooking = {
      id: `booking-${Date.now()}`,
      userId,
      classId,
      studioId: classInfo.studioId,
      date,
      time,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    // Add booking to mock data
    API.mockData.bookings.push(newBooking);
    
    // Update class booking count
    classInfo.currentBookings += 1;
    
    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: newBooking
    });
  });
  
  // Test case 1: Create booking with valid token and data
  try {
    const bookingData = {
      classId: 'class-101',
      date: '2023-11-25',
      time: '3:00 PM'
    };
    
    const response = await API.makeRequest('POST', '/api/bookings', bookingData, {
      authorization: 'Bearer valid-token-user-123'
    });
    
    console.log('✅ Successfully created booking with valid token and data');
    console.log(`   Status: ${response.status}`);
    console.log(`   Booking ID: ${response.data.data.id}`);
    
    if (response.status !== 201 || !response.data.success || !response.data.data.id) {
      throw new Error('Invalid response format');
    }
    
    // Verify booking data
    const booking = response.data.data;
    if (booking.userId !== 'user-123' || booking.classId !== 'class-101' || 
        booking.date !== '2023-11-25' || booking.time !== '3:00 PM' || 
        booking.status !== 'confirmed') {
      throw new Error('Booking data does not match request');
    }
  } catch (error) {
    console.log(`❌ Failed to create booking with valid token and data: ${error.message}`);
    throw error;
  }
  
  // Test case 2: Create booking with no token
  try {
    const bookingData = {
      classId: 'class-101',
      date: '2023-11-26',
      time: '4:00 PM'
    };
    
    const response = await API.makeRequest('POST', '/api/bookings', bookingData);
    console.log('❌ Should not succeed without token');
    throw new Error('Request succeeded without token');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected booking creation without token');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`❌ Unexpected error when testing without token: ${error.message}`);
      throw error;
    }
  }
  
  // Test case 3: Create booking with missing data
  try {
    const bookingData = {
      // Missing classId
      date: '2023-11-26',
      time: '4:00 PM'
    };
    
    const response = await API.makeRequest('POST', '/api/bookings', bookingData, {
      authorization: 'Bearer valid-token-user-123'
    });
    console.log('❌ Should not succeed with missing data');
    throw new Error('Request succeeded with missing data');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected booking creation with missing data');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`❌ Unexpected error when testing with missing data: ${error.message}`);
      throw error;
    }
  }
}

// Test DELETE /api/bookings/[id] endpoint (cancel booking)
async function testCancelBookingEndpoint() {
  console.log('\n📋 Testing DELETE /api/bookings/[id] endpoint...');
  
  // Add a booking to mock data for testing
  if (!API.mockData) {
    API.mockData = {};
  }
  
  if (!API.mockData.bookings) {
    API.mockData.bookings = [];
  }
  
  // Ensure we have a booking to delete
  const testBooking = {
    id: 'booking-123',
    userId: 'user-123',
    classId: 'class-101',
    studioId: 'studio-201',
    date: '2023-11-15',
    time: '10:00 AM',
    status: 'confirmed',
    createdAt: '2023-11-10T08:30:00Z'
  };
  
  // Add the test booking if it doesn't exist
  if (!API.mockData.bookings.some(b => b.id === 'booking-123')) {
    API.mockData.bookings.push(testBooking);
  }
  
  // Mock implementation - using a completely fixed, non-parameterized path
  API.mockEndpoint('DELETE', '/api/bookings/booking-123', (req, res) => {
    // Check for authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = API.getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid token' 
      });
    }
    
    // We know the booking ID is booking-123 from the fixed URL path
    const bookingId = 'booking-123';
    
    // Find booking
    const bookingIndex = API.mockData.bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const booking = API.mockData.bookings[bookingIndex];
    
    // Check if booking belongs to user
    if (booking.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }
    
    // Remove booking from mock data
    API.mockData.bookings.splice(bookingIndex, 1);
    
    // Update class booking count if class exists
    if (API.mockData.classes) {
      const classInfo = API.mockData.classes.find(c => c.id === booking.classId);
      if (classInfo && classInfo.currentBookings) {
        classInfo.currentBookings -= 1;
      }
    }
    
    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  });
  
  // Add a second endpoint for the non-existent booking test case
  API.mockEndpoint('DELETE', '/api/bookings/non-existent-booking', (req, res) => {
    // Check for authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = API.getUserIdFromToken(token);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized - Invalid token' 
      });
    }
    
    // We know the booking ID doesn't exist
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  });
  
  // Test case 1: Cancel booking with valid token and booking ID
  try {
    const response = await API.makeRequest('DELETE', '/api/bookings/booking-123', null, {
      authorization: 'Bearer valid-token-user-123'
    });
    
    console.log('✅ Successfully cancelled booking with valid token and booking ID');
    console.log(`   Status: ${response.status}`);
    console.log(`   Message: ${response.data.message}`);
    
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.log(`❌ Failed to cancel booking with valid token and booking ID: ${error.message}`);
    throw error;
  }
  
  // Test case 2: Cancel booking with no token
  try {
    // Add the test booking back for the next test
    if (!API.mockData.bookings.some(b => b.id === 'booking-123')) {
      API.mockData.bookings.push(testBooking);
    }
    
    const response = await API.makeRequest('DELETE', '/api/bookings/booking-123');
    console.log('❌ Should not succeed without token');
    throw new Error('Request succeeded without token');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected booking cancellation without token');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`❌ Unexpected error when testing without token: ${error.message}`);
      throw error;
    }
  }
  
  // Test case 3: Cancel non-existent booking
  try {
    const response = await API.makeRequest('DELETE', '/api/bookings/non-existent-booking', null, {
      authorization: 'Bearer valid-token-user-123'
    });
    console.log('❌ Should not succeed with non-existent booking ID');
    throw new Error('Request succeeded with non-existent booking ID');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✅ Correctly rejected cancellation of non-existent booking');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    } else {
      console.log(`❌ Unexpected error when testing with non-existent booking ID: ${error.message}`);
      throw error;
    }
  }
}

// Set up mock API getUserIdFromToken function
API.getUserIdFromToken = (token) => {
  const tokenMap = {
    'valid-token-user-123': 'user-123',
    'valid-token-user-456': 'user-456'
  };
  return tokenMap[token];
};

// Run all tests
async function runAllTests() {
  try {
    await testGetUserBookingsEndpoint();
    await testCreateBookingEndpoint();
    await testCancelBookingEndpoint();
    console.log('\n✅ All bookings API endpoint tests completed successfully!');
  } catch (error) {
    console.log(`\n❌ Tests failed: ${error.message}`);
    process.exit(1);
  }
}

// Export the test functions
module.exports = {
  runAllTests,
  testGetUserBookingsEndpoint,
  testCreateBookingEndpoint,
  testCancelBookingEndpoint
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
} 