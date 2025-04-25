# Firebase Setup Checklist for Naadi (Single Project)

Use this checklist to track your progress in setting up Firebase for the single Naadi Expo project, its variants, and Cloud Functions.

## 1. Firebase Project Setup
- [ ] Created Firebase Project in the [Firebase Console](https://console.firebase.google.com/).
- [ ] Upgraded to Blaze plan (Pay-as-you-go) if using Cloud Functions or other paid services beyond free tier.

## 2. Expo App Firebase Integration

### 2.1 Register Native Apps (One Registration Per Platform)
- **iOS App:**
  - [ ] Registered an iOS app in Firebase (Project Settings > General > Your apps > Add app).
  - [ ] Used a base Bundle ID (e.g., `ma.naadi.app` - `app.config.js` will use this for the 'main' variant and `ma.naadi.partner` for the 'partner' variant during builds).
  - [ ] Downloaded `GoogleService-Info.plist`.
  - [ ] Placed `GoogleService-Info.plist` in the project root or `src/` directory (ensure `.gitignore` does *not* commit it if it contains sensitive info, though it usually doesn't).
- **Android App:**
  - [ ] Registered an Android app in Firebase.
  - [ ] Used a base package name (e.g., `ma.naadi.app` - `app.config.js` will handle variants).
  - [ ] Added SHA-1 certificate fingerprint(s) (debug and release) for Google Sign-In, Phone Auth, etc.
  - [ ] Downloaded `google-services.json`.
  - [ ] Placed `google-services.json` in the project root or `src/` directory (ensure `.gitignore` does *not* commit it).

### 2.2 Register Web App (One Registration Generally Sufficient)
- [ ] Registered a Web app (</>) in Firebase.
- [ ] Noted the `firebaseConfig` values (apiKey, authDomain, projectId, etc.).
- [ ] Added deployment domains (e.g., `naadi.ma`, potentially `partner.naadi.ma` or localhost variants) to Authorized Domains in Firebase Authentication settings.

### 2.3 Configure Expo App (`src/app.config.js` & Environment Variables)
- [ ] Verified `src/app.config.js` correctly sets `ios.bundleIdentifier` and `android.package` based on `EXPO_PUBLIC_APP_VARIANT`.
- [ ] Ensured native config files (`GoogleService-Info.plist`, `google-services.json`) are referenced correctly (Expo CLI often finds them automatically if placed in standard locations like root or `src/`).
- [ ] Added necessary Firebase Web SDK config values (`apiKey`, `authDomain`, etc.) as environment variables (e.g., in `.env` file, loaded via `dotenv`).
    - **Important:** Use the `EXPO_PUBLIC_` prefix for variables needed client-side (e.g., `EXPO_PUBLIC_FIREBASE_API_KEY`).
    - Consider managing secrets via EAS Secrets (`eas secret:create`) for build-time environment variables rather than committing `.env` files.
- [ ] Added necessary Firebase plugins (e.g., `@react-native-firebase/app`, `@react-native-firebase/auth`) to `app.config.js` or `app.json` (if still using parts of it).

## 3. Cloud Functions (`cloud-functions/`)
- [ ] Initialized Firebase project within `cloud-functions/` using `firebase init functions` (if not already done).
- [ ] Installed necessary dependencies in `cloud-functions/functions/package.json` (e.g., `firebase-admin`, `firebase-functions`).
- [ ] Configured `cloud-functions/firebase.json` (e.g., functions runtime, source directory).
- [ ] Set up necessary Firebase Admin service account access (e.g., via Application Default Credentials in Cloud Functions environment, or manually setting `GOOGLE_APPLICATION_CREDENTIALS` locally for emulators).
- [ ] Configured environment variables for Cloud Functions if needed (e.g., API keys for third-party services) using `firebase functions:config:set mykey.id=key_id mykey.secret=key_secret`.

## 4. Enable Firebase Services
- [ ] Enabled Authentication methods (Email/Password, Phone, Google, etc.) in Firebase Console.
- [ ] Configured platform-specific Auth settings (OAuth redirects, SHA-1 keys, URL schemes, reCAPTCHA for web) as needed.
- [ ] Created Firestore Database.
- [ ] Configured Firestore Security Rules (initially permissive for development/emulators, secure for production).
- [ ] Enabled Cloud Functions (implicitly done by deploying).
- [ ] Enabled other services as needed (Storage, etc.).

## 5. Testing & Verification
- [ ] Verified Firebase client SDK initialization in the Expo app.
- [ ] Tested authentication flows (signup, login, logout) for both variants using different methods.
- [ ] Tested API helper functions (`src/api/`) making calls to Cloud Functions (use emulators locally).
- [ ] Tested Cloud Function logic (unit tests, integration tests with emulators).
- [ ] Verified data is written to/read from Firestore correctly via app interactions and function executions.
- [ ] Verified Firestore Security Rules are working as expected.

## 6. Build & Deploy Considerations
- [ ] Ensured EAS Build profiles (`eas.json`) correctly set necessary environment variables (`EXPO_PUBLIC_APP_VARIANT`, potentially Firebase web keys via EAS Secrets) for each variant build.
- [ ] Verified deployed Cloud Functions are working correctly.
- [ ] Ensured production Firestore Security Rules are active and secure. 