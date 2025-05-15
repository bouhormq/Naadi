const fs = require('fs');
const path = require('path');

// Get the variant from command line arguments
const variant = process.argv[2];

// Validate the variant
if (!variant || !['main', 'partner'].includes(variant)) {
  console.error('Error: Please specify a valid variant (main or partner)');
  console.error('Usage: npm run set-variant <variant>');
  process.exit(1);
}

// Read existing .env file if it exists
const envPath = path.join(__dirname, '..', '.env');
let existingEnvContent = '';
try {
  existingEnvContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  // File doesn't exist yet, that's okay
}

// Parse existing environment variables
const existingVars = {};
existingEnvContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    existingVars[key.trim()] = value.trim();
  }
});

// Create new .env content
const newEnvContent = Object.entries({
  ...existingVars,
  EXPO_PUBLIC_APP_VARIANT: variant
})
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

// Write to .env file
try {
  fs.writeFileSync(envPath, newEnvContent);
  console.log(`✅ Variant set to: ${variant}`);
} catch (error) {
  console.error('Error writing to .env file:', error);
  process.exit(1);
} 