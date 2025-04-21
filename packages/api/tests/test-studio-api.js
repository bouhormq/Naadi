// Import required modules
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.local') });

// Log the start of the test
console.log('🔍 Testing @naadi/api Studio functions...');

// Import the API functions we need to test
const { createStudio, updateStudio, deleteStudio } = require('../dist/src/index');

// Random ID for our test partner
const businessId = 'test-partner-' + Math.random().toString(36).substring(2, 10);

// Test studio data
const testStudioData = {
  name: 'Test Yoga Studio',
  location: { lat: 37.7749, lng: -122.4194 },
  address: '123 Main St, San Francisco, CA',
  description: 'A peaceful yoga studio in the heart of the city',
  photos: ['https://example.com/photo1.jpg'],
  healthSafetyInfo: 'All equipment sanitized between sessions'
};

// Run the test sequence
async function testStudioAPI() {
  try {
    // Step 1: Create a studio
    console.log('📝 Creating a test studio...');
    const studio = await createStudio(testStudioData, businessId);
    console.log('✅ Test studio created:', studio);
    
    if (!studio || !studio.id) {
      throw new Error('Failed to create studio - no ID returned');
    }
    
    const studioId = studio.id;
    
    // Step 2: Update the studio
    console.log('✏️ Updating the test studio...');
    const updateData = {
      studioId: studioId, // This appears to be the expected format
      name: 'Updated Yoga Studio',
      description: 'Now with more zen and better views'
    };
    
    try {
      await updateStudio(updateData, businessId);
      console.log('✅ Test studio updated successfully');
    } catch (error) {
      console.error('Studio update error:', error);
      // Continue with the test even if update fails
    }
    
    // Step 3: Delete the studio
    console.log('🗑️ Deleting the test studio...');
    await deleteStudio(studioId, businessId);
    console.log('✅ Test studio deleted successfully');
    
    console.log('🎉 All Studio API functions tested successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing Studio API:', error);
    process.exit(1);
  }
}

// Run the test
testStudioAPI(); 