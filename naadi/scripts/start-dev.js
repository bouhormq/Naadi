const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Read the .env file
const envPath = path.join(__dirname, '..', '.env');
let variant;

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/EXPO_PUBLIC_APP_VARIANT=(\w+)/);
  if (match) {
    variant = match[1];
  }
} catch (error) {
  console.error('Error reading .env file:', error);
  process.exit(1);
}

if (!variant) {
  console.error('Error: No variant set. Please run "npm run set-variant <variant>" first');
  process.exit(1);
}

console.log(`Starting development server with variant: ${variant}`);

// Start expo with the correct variant
const expo = spawn('expo', ['start', '--web'], {
  env: {
    ...process.env,
    EXPO_PUBLIC_APP_VARIANT: variant
  },
  stdio: 'inherit',
  shell: true
});

expo.on('error', (error) => {
  console.error('Failed to start expo:', error);
  process.exit(1);
}); 