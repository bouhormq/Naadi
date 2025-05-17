const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Settings from SDK53-FIXES.md
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];
config.resolver.resolverMainFields = ['browser', 'main'];

// Firebase/Expo SDK 53 workaround for "Component auth has not been registered yet"
// Allow .cjs files for Firebase an
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

// Disable the new, stricter "package.json exports" resolution for Metro
// This helps with Firebase sub-packages that might not have full export maps.
config.resolver.unstable_enablePackageExports = false;

module.exports = config; 