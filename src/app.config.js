// app.config.js
import 'dotenv/config'; // Optional: for local testing with a .env file

// Determine the variant. Default to 'main' if not set.
// EXPO_PUBLIC_APP_VARIANT will be set by EAS build profiles.
const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';

console.log(`app.config.js: Configuring for variant: ${appVariant}`);

// --- Variant-Specific Configurations ---

const mainConfig = {
  name: 'Naadi', // App name for the main app
  slug: 'naadi', // Unique slug for main app (used for URL scheme)
  identifier: 'ma.naadi.app', // << NEW Unique Bundle ID / Package Name for main app
  icon: './app/(main)/(assets)/icon-main.png', // << CREATE THIS ICON FILE
  adaptiveIconForeground: './app/(main)/(assets)/adaptive-icon-main.png', // << CREATE THIS ICON FILE
  splashImage: './app/(main)/(assets)/splash-main.png', // << CREATE THIS SPLASH FILE
};

const partnerConfig = {
  name: 'Naadi Partner', // App name for the partner app (Adjust if needed)
  slug: 'naadi-partner', // Keep existing slug
  identifier: 'ma.naadi.partner', // Keep existing Bundle ID / Package Name
  icon: './app/partners/(assets)/icon.png', // Keep existing or rename to icon-partner.png
  adaptiveIconForeground: './app/partners/(assets)/adaptive-icon.png', // Keep existing or rename
  splashImage: './app/partners/(assets)/splash.png', // Keep existing or rename
};

// --- Select the configuration based on the variant ---
const variantConfig = appVariant === 'partner' ? partnerConfig : mainConfig;

// --- Base Expo Configuration (Common Settings) ---
export default {
  expo: {
    // --- Settings using variantConfig ---
    name: variantConfig.name,
    slug: variantConfig.slug,
    scheme: variantConfig.slug, // Use slug for deep linking scheme
    icon: variantConfig.icon,
    ios: {
      supportsTablet: true,
      bundleIdentifier: variantConfig.identifier, // Dynamically set
      buildNumber: '1.0.0', // Manage build number as needed
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      package: variantConfig.identifier, // Dynamically set
      versionCode: 1, // Manage version code as needed
      adaptiveIcon: {
        foregroundImage: variantConfig.adaptiveIconForeground, // Dynamically set
        backgroundColor: '#FFFFFF', // Keep or make variant-specific
      },
      googleServicesFile: './google-services.json',
    },
    splash: {
      image: variantConfig.splashImage, // Dynamically set
      resizeMode: 'contain',
      backgroundColor: '#ffffff', // Keep or make variant-specific
    },

    // --- Common settings from your old app.json ---
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    owner: 'bouhormq', // Your Expo account username
    jsEngine: 'hermes', // Recommended
    newArchEnabled: true, // Enable the new architecture

    web: {
      favicon: './app/(main)/(assets)/favicon.png', // Keep existing favicon
      bundler: 'metro',
      // Set the production origin for web builds
      config: {
         expoRouter: {
            // IMPORTANT: Set your actual production domain here
            origin: 'https://naadi.ma',
         }
      }
    },
    plugins: [
      'expo-router',
    ],
    extra: {
      "eas": {
        "projectId": "d2e1171b-6b0e-4bc9-bd2e-650a1c79a669"
      }
      // Keep your EAS Project ID
      // You could pass the variant here too if needed elsewhere, but EXPO_PUBLIC_* is preferred
      // appVariant: appVariant
    },
  },
};