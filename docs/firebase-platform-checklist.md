# Firebase Platform Registration Checklist

Use this checklist to track your progress in setting up Firebase for all platforms in the Naadi project.

## Environment Files Setup
- [ ] Created root `.env.local` file in project root
- [ ] Created `naadi-user/.env.local` file for User app
- [ ] Created `naadi-partner/.env.local` file for Partner app

## Service Account Setup
- [ ] Generated Firebase Admin service account key
- [ ] Added service account credentials to root `.env.local`

## Web Platform (Two Separate Apps)

### User Web App
- [ ] Registered User Web app in Firebase Console
- [ ] Copied Web config to `naadi-user/.env.local`
- [ ] Added deployment domain (naadi.ma) to Authorized Domains

### Partner Web App
- [ ] Registered Partner Web app in Firebase Console
- [ ] Copied Web config to `naadi-partner/.env.local`
- [ ] Verified that APP_ID and MEASUREMENT_ID are different from User Web app

### Web Authentication Settings
- [ ] Configured reCAPTCHA for Phone Authentication (if using)
- [ ] Set up OAuth redirect domains for User app (https://naadi.ma/__/auth/handler)
- [ ] Set up OAuth redirect domains for Partner app (https://naadi.ma/partner/__/auth/handler)

## iOS Platform (Two Separate Apps)

### User iOS App
- [ ] Registered User iOS app with bundle ID `com.naadi.user`
- [ ] Downloaded GoogleService-Info.plist for User app
- [ ] Placed GoogleService-Info.plist in `naadi-user/` directory
- [ ] Added iOS configuration to naadi-user/app.json:
  ```json
  "ios": {
    "bundleIdentifier": "com.naadi.user",
    "googleServicesFile": "./GoogleService-Info.plist"
  }
  ```

### Partner iOS App
- [ ] Registered Partner iOS app with bundle ID `com.naadi.partner`
- [ ] Downloaded GoogleService-Info.plist for Partner app
- [ ] Placed GoogleService-Info.plist in `naadi-partner/` directory
- [ ] Added iOS configuration to naadi-partner/app.json:
  ```json
  "ios": {
    "bundleIdentifier": "com.naadi.partner",
    "googleServicesFile": "./GoogleService-Info.plist"
  }
  ```

### iOS Authentication Settings
- [ ] Set up URL schemes for OAuth providers
- [ ] Configured Sign in with Apple (if using)

## Android Platform (Two Separate Apps)

### User Android App
- [ ] Registered User Android app with package name `com.naadi.user`
- [ ] Added SHA-1 certificate fingerprint(s)
- [ ] Downloaded google-services.json for User app
- [ ] Placed google-services.json in `naadi-user/` directory
- [ ] Added Android configuration to naadi-user/app.json:
  ```json
  "android": {
    "package": "com.naadi.user",
    "googleServicesFile": "./google-services.json"
  }
  ```

### Partner Android App
- [ ] Registered Partner Android app with package name `com.naadi.partner`
- [ ] Added SHA-1 certificate fingerprint(s)
- [ ] Downloaded google-services.json for Partner app
- [ ] Placed google-services.json in `naadi-partner/` directory
- [ ] Added Android configuration to naadi-partner/app.json:
  ```json
  "android": {
    "package": "com.naadi.partner",
    "googleServicesFile": "./google-services.json"
  }
  ```

## Authentication Methods
- [ ] Enabled Email/Password authentication
- [ ] Enabled Phone authentication
- [ ] Enabled Google authentication
- [ ] Enabled Facebook authentication (if using)
- [ ] Enabled Apple authentication (if using)

## Firestore Setup
- [ ] Created Firestore database
- [ ] Configured Firestore rules
- [ ] Set up initial collections (if needed)

## Testing
- [ ] Tested authentication on User Web app
- [ ] Tested authentication on Partner Web app
- [ ] Tested authentication on User iOS app
- [ ] Tested authentication on Partner iOS app
- [ ] Tested authentication on User Android app
- [ ] Tested authentication on Partner Android app
- [ ] Verified data writing to Firestore
- [ ] Verified data reading from Firestore

## Build & Deploy
- [ ] Successfully built API package
- [ ] Successfully deployed User app
- [ ] Successfully deployed Partner app 