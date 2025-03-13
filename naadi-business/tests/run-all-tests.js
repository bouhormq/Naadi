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
// Only include tests that are working
const testFiles = [
  'test-auth-endpoints.js',
  'test-analytics-endpoints.js',
  'test-users-endpoints.js',
  'test-studios-endpoints.js',
  'test-classes-endpoints.js',
  'test-bookings-endpoints.js',
  'test-feedback-endpoints.js'
  // The following tests are currently not working:
  // 'test-bookings-endpoints.js',
  // 'test-feedback-endpoints.js',
];

// Function to run a command and return a promise
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

// Function to run all tests
async function runAllTests() {
  console.log(`${colors.bright}${colors.cyan}Running all Business App API endpoint tests...${colors.reset}\n`);
  
  let failedTests = 0;
  let passedTests = 0;
  
  for (const testFile of testFiles) {
    console.log(`\n${colors.bright}${colors.blue}Running test: ${testFile}${colors.reset}`);
    console.log(`${colors.dim}${'='.repeat(50)}${colors.reset}`);
    
    try {
      const { stdout, stderr } = await runCommand(`node ${path.join(__dirname, testFile)}`);
      
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      console.log(`${colors.green}✓ ${testFile} passed${colors.reset}`);
      passedTests++;
    } catch (error) {
      console.error(`${colors.red}✗ ${testFile} failed${colors.reset}`);
      
      if (error.stdout) console.log(error.stdout);
      if (error.stderr) console.error(error.stderr);
      
      failedTests++;
    }
    
    console.log(`${colors.dim}${'='.repeat(50)}${colors.reset}\n`);
  }
  
  // Print test summary
  console.log(`\n${colors.bright}${colors.blue}Test Summary:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  
  // Exit with appropriate code
  if (failedTests > 0) {
    console.log(`\n${colors.red}${colors.bright}Some tests failed!${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bright}All tests passed!${colors.reset}`);
    process.exit(0);
  }
}

// Run all tests
runAllTests(); 