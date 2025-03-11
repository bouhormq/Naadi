# Firebase Setup Guide for Naadi

This guide will help you set up Firebase for your Naadi project across all platforms: Web, iOS, and Android.

## 1. Firebase Service Account Setup

### Generate a Service Account Key
1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview" to open Project settings
4. Go to the "Service accounts" tab
5. Click "Generate new private key" button
6. Save the JSON file securely

### Add Service Account to Environment Variables
Option 1: Use the entire JSON (recommended for development)
1. Open the downloaded JSON file
2. Copy the entire contents
3. In your root `.env.local` file, add:
   ```
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your_project_id",...}
   ```
   Replace the JSON value with your actual service account JSON contents

Option 2: Use individual fields
1. Open the downloaded JSON file
2. In your root `.env.local` file, add:
   ```
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_client_email@your_project_id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n"
   ```
   Replace the values with the actual values from your service account JSON file

## 1.5 Environment Variable File Structure

For this project, you need to create **three separate** `.env.local` files:

1. **Root `.env.local`** (at the project root): Contains Firebase Admin SDK credentials for server-side operations
2. **User App `.env.local`** (in naadi-user directory): Contains Firebase Web SDK config for the user app
3. **Business App `.env.local`** (in naadi-business directory): Contains Firebase Web SDK config for the business app

### Create the App-Specific .env.local Files

1. **Create the User App environment file**:
   ```bash
   touch naadi-user/.env.local
   ```

2. **Create the Business App environment file**:
   ```bash
   touch naadi-business/.env.local
   ```

Each app needs its own Firebase configuration because they are registered as separate apps in Firebase. The app-specific files will be populated with the respective Firebase Web SDK configurations in the next steps.

## 2. Platform Registration - IMPORTANT!

You MUST register each platform separately in your Firebase project.

### 2.1 Register Web Apps (Two Separate Registrations)

#### 2.1.1 Register User Web App
1. In the Firebase Console, go to Project Overview
2. Click on the web icon (</>) to add a web app
3. Register the app with a nickname like "Naadi User Web"
4. Copy the `firebaseConfig` object values to `naadi-user/.env.local`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_for_user_web
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_for_user_web
   ```

#### 2.1.2 Register Business Web App
1. Click on the web icon (</>) AGAIN to add a second web app
2. Register the app with a nickname like "Naadi Business Web"
3. Copy the `firebaseConfig` object values to `naadi-business/.env.local`:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id_for_business_web
   EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_for_business_web
   ```
   
> **Important**: The `APP_ID` and `MEASUREMENT_ID` will be different for each web app, while the other values will typically be the same.

#### 2.1.3 Configure Authorized Domains
1. Go to Firebase Authentication > Settings > Authorized domains
2. Add your deployment domain (naadi.ma) to Authorized Domains

### 2.2 Register iOS Apps (Two Separate Registrations)

#### 2.2.1 Register User iOS App
1. In the Firebase Console, go to Project Overview
2. Click on the iOS icon (Apple icon) to add an iOS app
3. Enter your iOS Bundle ID: `com.naadi.user`
   - This matches the `ios.bundleIdentifier` in naadi-user/app.json
4. Enter an App Nickname (e.g., "Naadi User iOS")
5. (Optional) Enter the App Store ID if you have one
6. Click "Register app"
7. Download the `GoogleService-Info.plist` file
8. Save this file as `naadi-user/GoogleService-Info.plist`

#### 2.2.2 Register Business iOS App
1. Click on the iOS icon AGAIN to add a second iOS app
2. Enter your iOS Bundle ID: `com.naadi.business`
   - This matches the `ios.bundleIdentifier` in naadi-business/app.json
3. Enter an App Nickname (e.g., "Naadi Business iOS")
4. (Optional) Enter the App Store ID if you have one
5. Click "Register app"
6. Download the `GoogleService-Info.plist` file
7. Save this file as `naadi-business/GoogleService-Info.plist`

### 2.3 Register Android Apps (Two Separate Registrations)

#### 2.3.1 Register User Android App
1. In the Firebase Console, go to Project Overview
2. Click on the Android icon to add an Android app
3. Enter your Android package name: `com.naadi.user`
   - This matches the `android.package` in naadi-user/app.json
4. Enter an App Nickname (e.g., "Naadi User Android")
5. (Optional) Enter the SHA-1 debugging certificate
   - This is required for Google Sign-In on Android
6. Click "Register app"
7. Download the `google-services.json` file
8. Save this file as `naadi-user/google-services.json`

#### 2.3.2 Register Business Android App
1. Click on the Android icon AGAIN to add a second Android app
2. Enter your Android package name: `com.naadi.business`
   - This matches the `android.package` in naadi-business/app.json
3. Enter an App Nickname (e.g., "Naadi Business Android")
4. (Optional) Enter the SHA-1 debugging certificate
5. Click "Register app"
6. Download the `google-services.json` file
7. Save this file as `naadi-business/google-services.json`

## 3. Configure Expo for Native Platforms (iOS/Android)

### 3.1 Configure User App
1. Open `naadi-user/app.json` and update:

```json
{
  "expo": {
    // ... existing config
    "ios": {
      "bundleIdentifier": "com.naadi.user",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.naadi.user",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "@react-native-firebase/app",
      // other plugins...
    ]
  }
}
```

### 3.2 Configure Business App
1. Open `naadi-business/app.json` and update:

```json
{
  "expo": {
    // ... existing config
    "ios": {
      "bundleIdentifier": "com.naadi.business",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.naadi.business",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      "@react-native-firebase/app",
      // other plugins...
    ]
  }
}
```

## 4. Enable Authentication Methods

1. In the Firebase Console, go to Authentication
2. Click on "Get started" if not already set up
3. Enable the following sign-in methods:
   - Email/Password
   - Phone
   - Google
   - Facebook (requires Facebook Developer account)

### Platform-Specific Authentication Requirements

#### Web-Specific Requirements
- Phone Authentication: Configure reCAPTCHA verification
- Google Sign-In: Add JavaScript origins in Google Cloud Console
  - Add `https://naadi.ma` for both apps
- Other OAuth providers: Configure redirect URLs
  - Set redirect URL to `https://naadi.ma/__/auth/handler` for the user app
  - Set redirect URL to `https://naadi.ma/business/__/auth/handler` for the business app

#### iOS-Specific Requirements
- For Google Sign-In: Add the reversed client ID to your URL schemes
- For Facebook: Configure your Info.plist with Facebook App ID
- For Apple Sign-In: Enable Sign in with Apple capability

#### Android-Specific Requirements
- For Google Sign-In: Ensure SHA-1 certificate fingerprints are added to Firebase
- For Facebook: Add Facebook App ID to strings.xml
- For Phone Auth: Ensure Google Play Services is installed on the device

## 5. Configure Firestore

1. In the Firebase Console, go to Firestore Database
2. Click "Create database" if not already set up
3. Choose "Start in production mode" (recommended)
4. Choose a database location closest to your users
5. Set up security rules (or use the ones below temporarily for development)

### Sample Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access during development
    // IMPORTANT: Change these rules before production!
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Uncomment these rules when ready for production
    // match /users/{userId} {
    //   allow read: if request.auth.uid == userId;
    //   allow write: if request.auth.uid == userId;
    // }
    // Add more collection-specific rules as needed
  }
}
```

## 6. Testing Your Configuration

### 6.1 Testing User Web App
1. Set up `naadi-user/.env.local` with the user web app configuration
2. Run the build script:
   ```bash
   npm run build:api
   ```
3. Test user authentication:
   ```bash
   npm run dev:user
   ```

### 6.2 Testing Business Web App
1. Set up `naadi-business/.env.local` with the business web app configuration
2. Test business authentication:
   ```bash
   npm run dev:business
   ```

### 6.3 Testing iOS and Android
1. Ensure platform-specific files are in their correct locations:
   - `naadi-user/GoogleService-Info.plist` and `naadi-user/google-services.json`
   - `naadi-business/GoogleService-Info.plist` and `naadi-business/google-services.json`
2. Build development clients:
   ```bash
   cd naadi-user
   eas build --profile development --platform ios
   eas build --profile development --platform android
   
   cd ../naadi-business
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```
3. Install the development clients on your devices
4. Run with development client:
   ```bash
   cd naadi-user
   eas start --device
   
   cd ../naadi-business
   eas start --device
   ```

## 7. Troubleshooting

### Firebase Admin SDK Initialization Error
- Check that your service account has the necessary permissions
- Verify that the JSON or individual fields are correctly formatted in .env.local
- For private key, ensure line breaks are properly preserved with \n

### Firebase Client Error
- Check that all EXPO_PUBLIC_FIREBASE_* variables are set correctly
- Verify that ALL apps are registered in Firebase Console for all platforms
- Ensure you're using the correct configuration for each app (user vs. business)

### Authentication Issues
- Ensure the authentication methods are enabled in Firebase Console
- Check platform-specific requirements:
  - Web: Authorized domains, reCAPTCHA settings
  - iOS: Correct Bundle ID, URL schemes
  - Android: SHA-1 certificate fingerprints

### Platform-Specific Issues
- iOS: Verify GoogleService-Info.plist has the correct Bundle ID for each app
- Android: Verify google-services.json has the correct package name for each app
- Web: Check if your domain is properly authorized

## 8. Summary - Environment Variable Structure

It's crucial to understand the environment variable file structure in this project:

### Three Separate `.env.local` Files

1. **Root-level `.env.local`**
   - **Location**: Project root directory
   - **Contains**: Firebase Admin SDK credentials
   - **Used by**: `packages/api` for server-side operations
   - **Key variables**: `FIREBASE_SERVICE_ACCOUNT` or individual credential fields

2. **User App `.env.local`**
   - **Location**: `naadi-user/` directory
   - **Contains**: Firebase User Web App configuration
   - **Used by**: User app only
   - **Key variables**: `EXPO_PUBLIC_FIREBASE_*` variables with unique APP_ID

3. **Business App `.env.local`**
   - **Location**: `naadi-business/` directory
   - **Contains**: Firebase Business Web App configuration
   - **Used by**: Business app only
   - **Key variables**: `EXPO_PUBLIC_FIREBASE_*` variables with unique APP_ID

This separation ensures that each app has its own Firebase configuration while sharing the same Admin SDK credentials for server-side operations.
