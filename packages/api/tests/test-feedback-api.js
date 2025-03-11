// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Log the start of the test
console.log('🔍 Testing @naadi/api Feedback functions...');

// Import the API functions we need to test
const { submitFeedback } = require('../dist/src/index');
const { db } = require('../dist/utils/firestore');

// Random IDs for our test
const userId = 'test-user-' + Math.random().toString(36).substring(2, 10);
const classId = 'test-class-' + Math.random().toString(36).substring(2, 10);
const studioId = 'test-studio-' + Math.random().toString(36).substring(2, 10);
const bookingId = 'test-booking-' + Math.random().toString(36).substring(2, 10);

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
    status: 'active',
    createdAt: new Date().toISOString()
  };
  await db.collection('classes').doc(classId).set(classData);
  console.log('✅ Test class created');
  
  // Create a test booking
  const bookingData = {
    id: bookingId,
    userId: userId,
    classId: classId,
    studioId: studioId,
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  await db.collection('bookings').doc(bookingId).set(bookingData);
  console.log('✅ Test booking created');
}

// Clean up test data from Firestore
async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
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
  
  try {
    await db.collection('bookings').doc(bookingId).delete();
    console.log('✅ Test booking deleted');
  } catch (e) {}
}

// Run the test sequence
async function testFeedbackAPI() {
  let feedbackId = null;
  
  try {
    // Setup test data
    await setupTestData();
    
    // Test feedback data with all required fields
    const testFeedbackData = {
      studioId: studioId,
      classId: classId,
      bookingId: bookingId,
      rating: 4.5,
      comment: 'Really enjoyed the class, instructor was very helpful!',
      category: 'class',
      tags: ['instructor', 'experience', 'facility'],
      // Add all required fields
      content: 'The facility was clean and the instructor was knowledgeable.',
      title: 'Great experience',
      status: 'published'
    };
    
    // Submit feedback
    console.log('📝 Submitting test feedback...');
    try {
      const feedback = await submitFeedback(userId, testFeedbackData);
      console.log('✅ Test feedback submitted:', feedback);
      
      if (!feedback || !feedback.id) {
        throw new Error('Failed to submit feedback - no ID returned');
      }
      
      feedbackId = feedback.id;
      
      // Verify the feedback was stored in Firestore
      console.log('🔍 Verifying feedback in Firestore...');
      const feedbackDoc = await db.collection('feedback').doc(feedbackId).get();
      
      if (!feedbackDoc.exists) {
        throw new Error('Feedback document not found in Firestore');
      }
      
      console.log('✅ Feedback document verified in Firestore');
      
      // Clean up - delete the test feedback
      console.log('🧹 Cleaning up test feedback...');
      await db.collection('feedback').doc(feedbackId).delete();
      console.log('✅ Test feedback deleted');
      
    } catch (error) {
      console.error('Feedback submission error:', error);
      throw error;
    }
    
    // Clean up test data
    await cleanupTestData();
    
    console.log('🎉 All Feedback API functions tested successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing Feedback API:', error);
    
    // Clean up if possible
    if (feedbackId) {
      try {
        await db.collection('feedback').doc(feedbackId).delete();
      } catch (e) {}
    }
    
    try {
      await cleanupTestData();
    } catch (cleanupError) {}
    
    process.exit(1);
  }
}

// Run the test
testFeedbackAPI(); 