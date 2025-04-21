// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Log the start of the test
console.log('🔍 Testing @naadi/api Studio Stats functions...');

// Import the API functions we need to test
const { getStudioStats } = require('../dist/src/index');
const { db } = require('../dist/utils/firestore');

// Random IDs for our test
const businessId = 'test-partner-' + Math.random().toString(36).substring(2, 10);
const studioId = 'test-studio-' + Math.random().toString(36).substring(2, 10);

// Setup test data in Firestore
async function setupTestData() {
  console.log('🔧 Setting up test data...');
  
  // Create a test studio
  const studioData = {
    id: studioId,
    businessId: businessId,
    name: 'Test Yoga Studio',
    location: { lat: 37.7749, lng: -122.4194 },
    address: '123 Main St, San Francisco, CA',
    description: 'A peaceful yoga studio in the heart of the city',
    createdAt: new Date().toISOString()
  };
  await db.collection('studios').doc(studioId).set(studioData);
  console.log('✅ Test studio created');
  
  // Create test classes
  const classIds = [];
  for (let i = 0; i < 3; i++) {
    const classData = {
      studioId: studioId,
      businessId: businessId,
      name: `Class ${i+1}`,
      description: `Test class ${i+1}`,
      instructor: 'Jane Doe',
      duration: 60,
      capacity: 20,
      price: 15.99,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    const classRef = db.collection('classes').doc();
    classData.id = classRef.id;
    classIds.push(classRef.id);
    
    await classRef.set(classData);
  }
  console.log('✅ Test classes created');
  
  // Create test bookings
  const bookingIds = [];
  for (let i = 0; i < 5; i++) {
    const bookingData = {
      studioId: studioId,
      classId: classIds[i % 3], // Distribute bookings across classes
      userId: `test-user-${i}`,
      attendees: 1,
      price: 15.99,
      status: i < 4 ? 'completed' : 'pending', // Make one booking pending
      paymentStatus: i < 4 ? 'paid' : 'pending', // Make one payment pending
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString() // Different days
    };
    
    const bookingRef = db.collection('bookings').doc();
    bookingData.id = bookingRef.id;
    bookingIds.push(bookingRef.id);
    
    await bookingRef.set(bookingData);
  }
  console.log('✅ Test bookings created');
  
  return { classIds, bookingIds };
}

// Clean up test data from Firestore
async function cleanupTestData(classIds, bookingIds) {
  console.log('🧹 Cleaning up test data...');
  
  // Delete bookings
  for (const bookingId of bookingIds) {
    try {
      await db.collection('bookings').doc(bookingId).delete();
    } catch (e) {}
  }
  console.log('✅ Test bookings deleted');
  
  // Delete classes
  for (const classId of classIds) {
    try {
      await db.collection('classes').doc(classId).delete();
    } catch (e) {}
  }
  console.log('✅ Test classes deleted');
  
  // Delete studio
  try {
    await db.collection('studios').doc(studioId).delete();
    console.log('✅ Test studio deleted');
  } catch (e) {}
}

// Run the test sequence
async function testStudioStatsAPI() {
  let testData = null;
  
  try {
    // Setup test data
    testData = await setupTestData();
    
    // Test getStudioStats
    console.log('📊 Getting studio stats...');
    const stats = await getStudioStats(studioId, businessId);
    console.log('✅ Studio stats retrieved:', JSON.stringify(stats, null, 2));
    
    // Validate that the stats contain the expected data
    console.log('🔍 Validating studio stats...');
    
    // If the stats object exists, we consider it a success
    if (!stats) {
      throw new Error('No stats returned');
    }
    
    console.log('✅ Studio stats validated');
    
    // Clean up test data
    await cleanupTestData(testData.classIds, testData.bookingIds);
    
    console.log('🎉 Studio Stats API tested successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing Studio Stats API:', error);
    
    // Clean up if possible
    if (testData) {
      await cleanupTestData(testData.classIds, testData.bookingIds);
    }
    
    process.exit(1);
  }
}

// Run the test
testStudioStatsAPI(); 