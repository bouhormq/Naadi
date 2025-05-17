// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add resolution for monorepo setup if needed
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Ensure Metro uses the correct versions
config.resolver.resolverMainFields = ['browser', 'main'];

// -----------------------------------------------------------------------------
// Firebase / Expo SDK 53: allow “.cjs” files and use classic Node “exports”
// resolution so Firebase sub‑packages are bundled correctly.
// -----------------------------------------------------------------------------
config.resolver.sourceExts = config.resolver.sourceExts || [];
if (!config.resolver.sourceExts.includes("cjs")) {
  config.resolver.sourceExts.push("cjs");
}

// Disable the new, stricter “package.json exports” resolution until every
// dependency (Firebase, React‑Native‑WebView, etc.) ships full export maps.
config.resolver.unstable_enablePackageExports = false;

// -----------------------------------------------------------------------------
// That's it – export the tweaked config.
// -----------------------------------------------------------------------------
module.exports = config; 