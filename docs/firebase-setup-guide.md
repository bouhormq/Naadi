# Firebase Setup Guide for Naadi

This guide provides step-by-step instructions for setting up Firebase services for the Naadi platform.

## 1. Firebase Project Setup

1. Create a new Firebase project:
   ```bash
   firebase init
   ```
   - Select "Create a new project"
   - Name it "naadi" or your preferred name
   - Enable Google Analytics (recommended)

2. Configure Firebase services:
   ```bash
   firebase init firestore
   firebase init functions
   firebase init hosting
   ```

## 2. Authentication Setup

1. Enable Email/Password authentication:
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Email/Password provider
   - Configure password requirements (minimum length, complexity)

2. Set up custom claims for roles:
   ```typescript
   // In your Cloud Functions
   admin.auth().setCustomUserClaims(uid, {
     role: 'partner' // or 'user', 'admin'
   });
   ```

## 3. Firestore Database

### 3.1 Collections Structure

```typescript
// Users Collection
users/{userId}
{
  email: string,
  role: 'user' | 'partner' | 'admin',
  displayName?: string,
  profilePic?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Studios Collection
studios/{studioId}
{
  businessId: string, // Reference to partner user
  name: string,
  location: {
    lat: number,
    lng: number
  },
  address: string,
  description: string,
  photos: string[],
  status: 'active' | 'inactive',
  createdAt: timestamp,
  updatedAt: timestamp
}

// Classes Collection
classes/{classId}
{
  studioId: string,
  name: string,
  description: string,
  schedule: {
    startTime: timestamp,
    endTime: timestamp,
    recurring: boolean,
    daysOfWeek?: number[]
  },
  capacity: number,
  price: number,
  status: 'active' | 'cancelled' | 'completed',
  createdAt: timestamp,
  updatedAt: timestamp
}

// Bookings Collection
bookings/{bookingId}
{
  userId: string,
  classId: string,
  studioId: string,
  status: 'confirmed' | 'cancelled' | 'completed',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 3.2 Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        request.auth.token.role == 'admin';
    }
    
    function isPartner() {
      return isAuthenticated() && 
        request.auth.token.role == 'partner';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && 
        request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isOwner(userId);
    }

    // Studios collection
    match /studios/{studioId} {
      allow read: if true;
      allow create: if isPartner();
      allow update, delete: if isPartner() && 
        resource.data.businessId == request.auth.uid;
    }

    // Classes collection
    match /classes/{classId} {
      allow read: if true;
      allow create: if isPartner();
      allow update, delete: if isPartner() && 
        exists(/databases/$(database)/documents/studios/$(resource.data.studioId)) &&
        get(/databases/$(database)/documents/studios/$(resource.data.studioId)).data.businessId == request.auth.uid;
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if isAuthenticated() && 
        (isOwner(resource.data.userId) || 
         isPartner() && resource.data.studioId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.studios);
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
        (isOwner(resource.data.userId) || 
         isPartner() && resource.data.studioId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.studios);
    }
  }
}
```

## 4. Cloud Functions

### 4.1 Required Functions

1. Authentication triggers:
   - `onUserCreated`: Set up user profile and role
   - `onUserDeleted`: Clean up user data

2. Studio management:
   - `createStudio`: Create new studio with validation
   - `updateStudio`: Update studio details
   - `deleteStudio`: Delete studio and related data

3. Class management:
   - `createClass`: Create new class with validation
   - `updateClass`: Update class details
   - `deleteClass`: Delete class and related bookings

4. Booking management:
   - `createBooking`: Create booking with availability check
   - `updateBooking`: Update booking status
   - `cancelBooking`: Handle booking cancellation

### 4.2 Function Setup

```bash
cd cloud-functions
npm install
```

Update `package.json`:
```json
{
  "name": "functions",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1"
  },
  "devDependencies": {
    "typescript": "^4.9.0"
  },
  "private": true
}
```

## 5. Environment Configuration

1. Create `.env` file in project root:
```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
```

2. Update `src/api/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## 6. Testing Setup

1. Install Firebase Emulator Suite:
```bash
firebase init emulators
```

2. Configure emulators in `firebase.json`:
```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "functions": {
      "port": 5001
    },
    "ui": {
      "enabled": true
    }
  }
}
```

3. Start emulators:
```bash
firebase emulators:start
```

## 7. Deployment

1. Deploy Firebase services:
```bash
firebase deploy
```

2. Deploy specific services:
```bash
firebase deploy --only firestore
firebase deploy --only functions
firebase deploy --only hosting
```

## 8. Monitoring and Maintenance

1. Set up Firebase Monitoring:
   - Enable Firebase Performance Monitoring
   - Configure Firebase Crashlytics
   - Set up Firebase Analytics

2. Regular maintenance tasks:
   - Monitor function execution times
   - Check database usage and costs
   - Review security rules
   - Update dependencies regularly

## 9. Troubleshooting

Common issues and solutions:

1. Authentication issues:
   - Check Firebase Console > Authentication > Users
   - Verify custom claims
   - Check security rules

2. Database access issues:
   - Review security rules
   - Check user permissions
   - Verify collection structure

3. Function deployment issues:
   - Check function logs
   - Verify dependencies
   - Check function permissions
