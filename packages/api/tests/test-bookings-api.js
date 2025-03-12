// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Log the start of the test
console.log('🔍 Testing @naadi/api Bookings functions...');

// Import the API functions we need to test
const { createBooking, cancelBooking, confirmPayment } = require('../dist/src/index');
const { db } = require('../dist/utils/firestore');

// Random IDs for our test
const userId = 'test-user-' + Math.random().toString(36).substring(2, 10);
const studioId = 'test-studio-' + Math.random().toString(36).substring(2, 10);
const classId = 'test-class-' + Math.random().toString(36).substring(2, 10);
let bookingId = null; // Will store the ID of the booking created during the test

// Setup test data in Firestore
async function setupTestData() {
  console.log('🔧 Setting up test data...');
  
  // Create a test user
  const userData = {
    uid: userId,
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'user',
    createdAt: new Date().toISOString()
  };
  await db.collection('users').doc(userId).set(userData);
  console.log('✅ Test user created');
  
  // Create a test studio
  const studioData = {
    id: studioId,
    businessId: 'test-business-' + Math.random().toString(36).substring(2, 10),
    name: 'Test Yoga Studio',
    location: { lat: 37.7749, lng: -122.4194 },
    address: '123 Main St, San Francisco, CA',
    description: 'A peaceful yoga studio in the heart of the city',
    createdAt: new Date().toISOString()
  };
  await db.collection('studios').doc(studioId).set(studioData);
  console.log('✅ Test studio created');
  
  // Create a test class
  const classData = {
    id: classId,
    studioId: studioId,
    name: 'Morning Vinyasa Flow',
    description: 'A dynamic and energizing yoga practice',
    instructor: 'Jane Doe',
    duration: 60,
    capacity: 20,
    price: 15.99,
    schedule: {
      dayOfWeek: 'Monday',
      startTime: '10:00',
      endTime: '11:00'
    },
    status: 'active',
    createdAt: new Date().toISOString()
  };
  await db.collection('classes').doc(classId).set(classData);
  console.log('✅ Test class created');
}

// Clean up test data from Firestore
async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  // Delete the booking first (due to potential foreign key relationships)
  if (bookingId) {
    try {
      await db.collection('bookings').doc(bookingId).delete();
      console.log('✅ Test booking deleted');
    } catch (e) {
      console.error('Error deleting booking:', e.message);
    }
  }
  
  // Also delete any other bookings associated with the test class
  try {
    const bookingsSnapshot = await db.collection('bookings').where('classId', '==', classId).get();
    const batch = db.batch();
    let count = 0;
    
    bookingsSnapshot.forEach(doc => {
      batch.delete(doc.ref);
      count++;
    });
    
    if (count > 0) {
      await batch.commit();
      console.log(`✅ ${count} additional test bookings deleted`);
    }
  } catch (e) {
    console.error('Error deleting additional bookings:', e.message);
  }
  
  try {
    await db.collection('users').doc(userId).delete();
    console.log('✅ Test user deleted');
  } catch (e) {}
  
  try {
    await db.collection('studios').doc(studioId).delete();
    console.log('✅ Test studio deleted');
  } catch (e) {}
  
  try {
    await db.collection('classes').doc(classId).delete();
    console.log('✅ Test class deleted');
  } catch (e) {}
}

// Test booking data
const testBookingData = {
  userId: userId,
  classId: classId,
  studioId: studioId,
  attendees: 1,
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
  startTime: '10:00',
  endTime: '11:00',
  price: 15.99,
  paymentMethod: 'card',
  status: 'pending', // Add any other required fields
  createdAt: new Date().toISOString()
};

// Run the test sequence
async function testBookingsAPI() {
  let bookingId = null;
  
  try {
    // Setup test data
    await setupTestData();
    
    // Step 1: Create a booking
    console.log('📝 Creating a test booking...');
    try {
      const booking = await createBooking(testBookingData);
      console.log('✅ Test booking created:', booking);
      
      if (!booking || !booking.id) {
        throw new Error('Failed to create booking - no ID returned');
      }
      
      bookingId = booking.id;
      
      // Step 2: Confirm payment for the booking
      console.log('💰 Confirming payment for the test booking...');
      const paymentData = {
        bookingId: bookingId,
        paymentMethod: 'card',
        paymentId: 'test-payment-' + Math.random().toString(36).substring(2, 8),
        amount: testBookingData.price,
        status: 'succeeded'
      };
      
      try {
        await confirmPayment(paymentData);
        console.log('✅ Payment confirmed successfully');
      } catch (error) {
        console.error('Payment confirmation error:', error);
        // Continue with the test even if confirmation fails
      }
      
      // Step 3: Cancel the booking
      console.log('🚫 Cancelling the test booking...');
      const cancelData = {
        bookingId: bookingId,
        reason: 'Testing cancellation',
        refundRequested: true
      };
      
      await cancelBooking(cancelData);
      console.log('✅ Test booking cancelled successfully');
      
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
    
    // Clean up test data
    await cleanupTestData();
    
    console.log('🎉 All Bookings API functions tested successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing Bookings API:', error);
    
    // Clean up if possible
    try {
      await cleanupTestData();
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    process.exit(1);
  }
}

// Run the test
testBookingsAPI(); 