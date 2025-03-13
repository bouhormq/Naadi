// Import required modules
const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Running all Naadi Business API tests...\n');

// Array of test files to run
const testFiles = [
  'test-auth-endpoints.js',
  'test-business-endpoints.js',
  'test-class-endpoints.js',
  'test-instructor-endpoints.js',
  'test-feedback-endpoints.js',
  'test-studio-endpoints.js',
  'test-booking-endpoints.js'
];

// Track test results
let allTestsPassed = true;

// Run each test file
for (const testFile of testFiles) {
  const testPath = path.join(__dirname, testFile);
  
  // Check if file exists
  if (!fs.existsSync(testPath)) {
    console.error(`❌ Test file not found: ${testFile}`);
    allTestsPassed = false;
    continue;
  }
  
  console.log(`\n📋 Running test file: ${testFile}`);
  console.log('--------------------------------------------------');
  
  try {
    // Run the test file
    execSync(`node ${testPath}`, { stdio: 'inherit' });
    console.log('--------------------------------------------------');
    console.log(`✅ All tests passed in ${testFile}`);
  } catch (error) {
    console.error('--------------------------------------------------');
    console.error(`❌ Tests failed in ${testFile}`);
    allTestsPassed = false;
  }
}

// Print final results
console.log('\n--------------------------------------------------');
if (allTestsPassed) {
  console.log('🎉 All API tests passed!');
  process.exit(0);
} else {
  console.error('❌ Some API tests failed!');
  process.exit(1);
} 