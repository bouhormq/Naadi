// Import required modules
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the path to the tests
const testsDir = __dirname;

// List of test files to run
const testFiles = [
  // Include all our test files
  'test-feedback-endpoints.js',
  'test-auth-endpoints.js',
  'test-users-endpoints.js',
  'test-booking-endpoints.js',
  'test-class-endpoints.js',
  'test-studio-endpoints.js',
  // The following can be uncommented when implemented
  // 'test-calendar-endpoints.js',
  // 'test-instructor-endpoints.js',
  // 'test-payment-endpoints.js',
  // 'test-preferences-endpoints.js',
  // 'test-profile-endpoints.js',
];

// Run tests one by one
console.log('🧪 Running User App API Tests...\n');
let passed = 0;
let failed = 0;

testFiles.forEach(testFile => {
  const testPath = path.join(testsDir, testFile);
  
  // Check if the file exists
  if (!fs.existsSync(testPath)) {
    console.error(`❌ Test file not found: ${testFile}`);
    failed++;
    return;
  }
  
  try {
    console.log(`\n⏳ Running ${testFile}...`);
    execSync(`node ${testPath}`, { stdio: 'inherit' });
    console.log(`✅ ${testFile} passed!`);
    passed++;
  } catch (error) {
    console.error(`❌ ${testFile} failed!`);
    failed++;
  }
});

// Print summary
console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed`);

// Exit with appropriate status code
process.exit(failed > 0 ? 1 : 0); 