# Firebase Setup Guide for Naadi (Single Project Structure)

This guide details setting up Firebase for the Naadi project, which uses a single Expo codebase (`src/`) to build two variants ('main' and 'partner') and utilizes Firebase Cloud Functions (`cloud-functions/`) for backend logic.

## 1. Initial Firebase Project Setup

1.  **Create Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2.  **Billing:** Enable billing (Blaze plan) if you plan to use Cloud Functions beyond the free tier or other paid services.

## 2. Registering Firebase Apps

Unlike the previous structure, we register only **one** iOS app, **one** Android app, and typically **one** Web app within the *same* Firebase project.

### 2.1 Register iOS App

1.  **Firebase Console:** Go to Project Settings > General > Your apps > Add app > Select iOS.
2.  **Bundle ID:** Enter the Bundle ID for your **main** variant (e.g., `ma.naadi.app`). `src/app.config.js` will dynamically change this to `ma.naadi.partner` when building the partner variant.
3.  **Register & Download:** Complete the registration and download the `GoogleService-Info.plist` file.
4.  **Place File:** Move the downloaded `GoogleService-Info.plist` into the root of your Expo project (`/Users/salim/Desktop/Naadi/`) or inside the `src/` directory. Expo CLI typically finds it automatically in these locations.
5.  **`.gitignore`:** Ensure `GoogleService-Info.plist` is *not* committed to Git if it contains sensitive information (though it usually doesn't).

### 2.2 Register Android App

1.  **Firebase Console:** Go to Project Settings > General > Your apps > Add app > Select Android.
2.  **Package Name:** Enter the package name for your **main** variant (e.g., `ma.naadi.app`). `src/app.config.js` will dynamically change this to `ma.naadi.partner` for the partner variant build.
3.  **SHA-1 Fingerprints:** Add your SHA-1 certificate fingerprints (both debug and release). You can get the debug SHA-1 using:
   ```bash
    # Inside src/android directory if it exists, or use specific keytool commands
    # ./gradlew signingReport # If android dir exists
    # keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
    ```
    You'll need to generate a release key and get its SHA-1 for production builds.
4.  **Register & Download:** Complete the registration and download the `google-services.json` file.
5.  **Place File:** Move the downloaded `google-services.json` into the root of your Expo project (`/Users/salim/Desktop/Naadi/`) or inside the `src/` directory.
6.  **`.gitignore`:** Ensure `google-services.json` is listed in your `.gitignore` file.

### 2.3 Register Web App

1.  **Firebase Console:** Go to Project Settings > General > Your apps > Add app > Select Web (</>).
2.  **Nickname:** Give it a nickname (e.g., "Naadi Web").
3.  **Register & Config:** Register the app. Copy the `firebaseConfig` object provided. This contains your client-side API keys and project IDs.
4.  **Authorized Domains:** Go to Authentication > Settings > Authorized domains. Add `localhost` (for development) and your production domains (e.g., `naadi.ma`). If your partner app uses a different subdomain or path on the web, add that authorized domain too if necessary for OAuth redirects.

## 3. Configuring the Expo App (`src/`)

### 3.1 Firebase Configuration Values (Client-Side)

   The client-side app needs the `firebaseConfig` values from step 2.3 to initialize the Firebase SDK.

   **Recommended Method: Environment Variables via `.env` and EAS Secrets:**

   1.  **Create `.env`:** Create a `.env` file in your project root (`/Users/salim/Desktop/Naadi/.env`).
   2.  **Add Variables:** Add the Firebase config values prefixed with `EXPO_PUBLIC_`:
      ```dotenv
      # /Users/salim/Desktop/Naadi/.env
      EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
      EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
      EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_WEB_APP_ID
      EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID # Optional
      ```
   3.  **`.gitignore`:** **Crucially, add `.env` to your `.gitignore` file** to avoid committing secrets.
   4.  **Load in App:** Use a library like `dotenv` (install with `npm install dotenv`) early in your app entry point or configuration, or rely on Expo's built-in support for `.env` files.
   5.  **Initialize Firebase:** Create a Firebase initialization file (e.g., `src/api/firebase.ts`) that reads these environment variables:
      ```typescript
      // src/api/firebase.ts
      import firebase from 'firebase/app'; // Use compat for v8 or import { initializeApp } from 'firebase/app' for v9+
      import 'firebase/auth';
      import 'firebase/firestore';

      const firebaseConfig = {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
      };

      let app;
      if (firebase.apps.length === 0) { // Use firebase.initializeApp for v8 compat
        app = firebase.initializeApp(firebaseConfig);
      } else {
        app = firebase.app();
      }

      const auth = firebase.auth(); // Use getAuth(app) for v9+
      const db = firebase.firestore(); // Use getFirestore(app) for v9+

      export { auth, db, app };
      ```
   6.  **EAS Secrets (Production):** For production builds, inject these variables securely using EAS Secrets. Add them using `eas secret:create SECRET_NAME=value` and reference them in the `env` section of your build profiles in `eas.json`.

### 3.2 Native Configuration (`src/app.config.js`)

   *   **Bundle ID / Package Name:** Ensure `app.config.js` correctly sets `ios.bundleIdentifier` and `android.package` for each variant based on `EXPO_PUBLIC_APP_VARIANT`.
   *   **Native Files:** Confirm that `ios.googleServicesFile` and `android.googleServicesFile` properties are *not* explicitly set in `app.config.js` if you placed the files in standard locations (root or `src/`), allowing Expo CLI to auto-detect them. If you placed them elsewhere, provide the correct relative path.
   *   **Plugins:** Add necessary Firebase plugins, like `@react-native-firebase/app` (if using RNFirebase) or ensure configuration for the JS SDK is correct.

## 4. Setting Up Cloud Functions (`cloud-functions/`)

1.  **Navigate:** `cd cloud-functions`
2.  **Initialize Firebase:** If you haven't already, run `firebase init functions`. Choose TypeScript or JavaScript. Follow the prompts.
3.  **Install Dependencies:** `cd functions && npm install firebase-admin firebase-functions && cd ..`.
4.  **Service Account:** Cloud Functions running on Google Cloud automatically use a default service account with necessary permissions. For local testing with the Emulator Suite, you need to provide credentials:
    *   **Generate Key:** Download a service account key JSON file from Firebase Project Settings > Service accounts.
    *   **Set Environment Variable:** Point the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of this key file *before* starting the emulators:
        ```bash
        export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/serviceAccountKey.json"
        firebase emulators:start
        ```
    *   **`.gitignore`:** Add the service account key file to your `.gitignore`.
5.  **Environment Configuration:** If your functions need API keys or other secrets:
    *   Set them locally using `firebase functions:config:set service.key="YOUR_KEY" service.secret="YOUR_SECRET"`.
    *   Access them in your code using `functions.config().service.key`.
    *   These configs get deployed with your functions.

## 5. Enable Authentication & Firestore

1.  **Authentication Methods:** In the Firebase Console > Authentication > Sign-in method, enable the providers you need (Email/Password, Phone, Google, etc.).
2.  **Firestore:** Go to Firestore Database > Create database. Start in **production mode** (secure by default) and choose your location.
3.  **Security Rules:** Edit Firestore rules. For initial development with emulators, you might use permissive rules like `allow read, write: if true;`. **For production, write secure rules** that grant access based on user authentication (`request.auth`) and roles.
    ```javascript
    // Example: Allow logged-in users to read/write their own user doc
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        // Add rules for other collections (studios, classes, etc.)
        // Example: Allow any logged-in user to read studios
        match /studios/{studioId} {
          allow read: if request.auth != null;
          // Allow only partners (assuming a 'role' field in user doc) to write
          allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'partner';
        }
  }
}
```

## 6. Final Steps

*   **Initialize SDK:** Ensure you are correctly initializing the Firebase JS SDK in your Expo app (`src/api/firebase.ts` or similar) using the environment variables.
*   **Test:** Thoroughly test authentication and Firestore interactions using both app variants and potentially the Firebase Emulator Suite locally.
*   **Deploy Functions:** Deploy your functions using `firebase deploy --only functions` from the `cloud-functions` directory or project root.
