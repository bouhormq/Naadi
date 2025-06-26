try {
  // Load environment variables from .env file
  require('dotenv').config();
} catch (error) {
  console.warn('dotenv not found, using default environment variables');
}

// Determine the variant. Default to 'main' if not set.
const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';

console.log(`app.config.js: Configuring for variant: ${appVariant}`);

// --- Variant-Specific Configurations ---

const mainConfig = {
  name: 'Naadi',
  slug: 'naadi',
  identifier: 'ma.naadi.app',
  icon: './assets/images/icon.png',
  adaptiveIconForeground: './assets/images/adaptive-icon.png',
  splashImage: './assets/images/splash.png',
};

const partnerConfig = {
  name: 'Naadi Partner',
  slug: 'naadi-partner',
  identifier: 'ma.naadi.partner',
  icon: './assets/images/icon.png',
  adaptiveIconForeground: './assets/images/adaptive-icon.png',
  splashImage: './assets/images/splash.png',
};

// --- Select the configuration based on the variant ---
const variantConfig = appVariant === 'partner' ? partnerConfig : mainConfig;

// --- Base Expo Configuration (Common Settings) ---
export default {
  expo: {
    // --- Settings using variantConfig ---
    name: variantConfig.name,
    slug: variantConfig.slug,
    scheme: variantConfig.slug,
    icon: variantConfig.icon,

    ios: {
      supportsTablet: true,
      bundleIdentifier: variantConfig.identifier,
      buildNumber: '1.0.0',
      googleServicesFile: './GoogleService-Info.plist',
      config: {
        // --- ADDED: Google Maps API Key for iOS ---
        googleMapsApiKey: process.env.EXPO_PUBLIC_Maps_API_KEY_WEB,
      },
    },
    android: {
      package: variantConfig.identifier,
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: variantConfig.adaptiveIconForeground,
        backgroundColor: '#FFFFFF',
      },
      googleServicesFile: './google-services.json',
      config: {
        googleMaps: {
          // --- ADDED: Google Maps API Key for Android ---
          apiKey: process.env.EXPO_PUBLIC_Maps_API_KEY_WEB,
        },
      },
    },
    splash: {
      image: variantConfig.splashImage,
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },

    // --- Common settings ---
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    owner: 'bouhormq',
    jsEngine: 'hermes',
    newArchEnabled: true,

    web: {
      favicon: './app/(main)/(assets)/favicon.png',
      bundler: 'metro',
      config: {
         expoRouter: {
            origin: 'https://naadi.ma',
         }
      }
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: variantConfig.splashImage,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      // NOTE: Because you use the Metro bundler for web, a webpack plugin
      // for aliasing 'react-native-maps' will not work.
      // The recommended approach is to create a universal component, shown below.
    ],
    extra: {
      eas: {
        projectId: 'd2e1171b-6b0e-4bc9-bd2e-650a1c79a669'
      }
    },
  },
};
