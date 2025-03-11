// Import required modules
const { exec } = require('child_process');
const path = require('path');

// Define colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// List of test files to run
const testFiles = [
  'test-api-imports.js',
  'test-api-functions.js',
  'test-studio-api.js',
  'test-classes-api.js',
  'test-bookings-api.js',
  'test-feedback-api.js',
  'test-studio-stats-api.js'
];

// Function to run a command and return a promise
function runCommand(command) {
  return new Promise((resolve, reject) => {
    // Log the command being executed
    console.log(`\n${colors.cyan}Running: ${colors.yellow}${command}${colors.reset}\n`);
    
    // Execute the command
    const process = exec(command);
    
    // Forward stdout and stderr
    process.stdout.on('data', (data) => {
      console.log(data);
    });
    
    process.stderr.on('data', (data) => {
      console.error(`${colors.red}${data}${colors.reset}`);
    });
    
    // Handle completion
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

// Run all tests sequentially
async function runAllTests() {
  console.log(`\n${colors.bgCyan}${colors.black} 🧪 RUNNING ALL API TESTS 🧪 ${colors.reset}\n`);
  
  // Keep track of test results
  const results = {
    passed: [],
    failed: []
  };
  
  // Loop through each test file
  for (const testFile of testFiles) {
    const testPath = path.join(__dirname, testFile);
    const command = `node ${testPath}`;
    
    try {
      // Run the test
      console.log(`\n${colors.bright}${colors.yellow}========================================${colors.reset}`);
      console.log(`${colors.bright}${colors.magenta}RUNNING TEST: ${testFile}${colors.reset}`);
      console.log(`${colors.bright}${colors.yellow}========================================${colors.reset}\n`);
      
      await runCommand(command);
      
      // If we get here, the test passed
      results.passed.push(testFile);
      console.log(`\n${colors.green}✅ TEST PASSED: ${testFile}${colors.reset}\n`);
    } catch (error) {
      // Test failed
      results.failed.push(testFile);
      console.log(`\n${colors.red}❌ TEST FAILED: ${testFile}${colors.reset}`);
      console.log(`${colors.red}${error.message}${colors.reset}\n`);
    }
  }
  
  // Print summary
  console.log(`\n${colors.bright}${colors.yellow}========================================${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}           TEST SUMMARY           ${colors.reset}`);
  console.log(`${colors.bright}${colors.yellow}========================================${colors.reset}\n`);
  
  console.log(`${colors.green}PASSED: ${results.passed.length}/${testFiles.length}${colors.reset}`);
  for (const test of results.passed) {
    console.log(`${colors.green}  ✅ ${test}${colors.reset}`);
  }
  
  if (results.failed.length > 0) {
    console.log(`\n${colors.red}FAILED: ${results.failed.length}/${testFiles.length}${colors.reset}`);
    for (const test of results.failed) {
      console.log(`${colors.red}  ❌ ${test}${colors.reset}`);
    }
  }
  
  console.log(`\n${colors.bright}${colors.yellow}========================================${colors.reset}`);
  
  // Exit with appropriate code
  if (results.failed.length > 0) {
    process.exit(1);
  } else {
    console.log(`\n${colors.bgGreen}${colors.black} 🎉 ALL TESTS PASSED! 🎉 ${colors.reset}\n`);
    process.exit(0);
  }
}

// Run all tests
runAllTests().catch(error => {
  console.error(`${colors.bgRed}${colors.white} FATAL ERROR: ${error.message} ${colors.reset}`);
  process.exit(1);
}); 