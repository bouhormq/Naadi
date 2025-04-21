# Naadi Software Design Document

## 1. Introduction

### 1.1 Purpose

This Software Design Document (SDD) details the architecture and implementation of "Naadi," a platform that connects users to fitness studios via map-based browsing and enables partneres to manage their offerings. It ensures the system meets the needs of a user app (accessible via naadi.ma) and a partner app (accessible via naadi.ma/partner), leveraging Expo EAS Hosting and Firebase Firestore.

### 1.2 Scope

Naadi consists of two applications:

- **Naadi User**: Allows users to browse studios on a map, book classes, and manage bookings, available on mobile and naadi.ma (web).
- **Naadi Partner**: Enables studio owners to manage studios, classes, and bookings, available on mobile and naadi.ma/partner (web).

Key features include:

- A web entry at naadi.ma with a "For partneres" button linking to naadi.ma/partner.
- A partner signup form at naadi.ma/partner collecting contact info.
- Role-based login redirecting to the appropriate app.
- Map-based studio browsing in the user app.

### 1.3 Terminology

- **EAS**: Expo Application Services, for building and hosting apps.
- **Expo Router**: File-based routing for navigation and API endpoints.
- **Firestore**: NoSQL database for data storage.
- **Subrepo**: Git subrepository for modular package management.

## 2. System Overview

### 2.1 System Architecture

Naadi uses a client-server architecture within a monorepo:

- **Frontend**: Expo-based apps (naadi-user, naadi-partner) for mobile and web, built with React Native and Expo Router.
- **Backend**: Firebase Firestore for data, with server-side logic in EAS-hosted API routes.
- **Shared Packages**: packages/types/ for type definitions and packages/api/ for API logic, both as subrepos.

### 2.2 High-Level Design

```
+------------------+       +------------------+       +------------------+
| naadi.ma         |       | naadi.ma/partner|       | EAS Hosting      |
| (naadi-user)     |       | (naadi-partner) |       | (API + Web)      |
| - Home w/ Button |<----->| - Signup Form    |<----->| - API Routes     |
| - Map Browsing   |       | - Login          |       | - Web Deployment |
| - Login/Signup   |       | - Partner Feat. |       |                  |
+------------------+       +------------------+       +------------------+
         |                            |                      |
         v                            v                      v
+------------------+       +------------------+       +------------------+
| Mobile App       |       | Mobile App       |       | Firebase         |
| (naadi-user)     |       | (naadi-partner) |       | - Firestore      |
| - Map/Browse     |       | - Manage Studios |       | - Authentication |
+------------------+       +------------------+       +------------------+
```

## 3. System Components

### 3.1 Folder Structure

```
naadi/
├── packages/              # Subrepo packages
│   ├── types/             # Shared types (subrepo)
│   └── api/               # Shared API routes (subrepo)
├── naadi-user/            # User app (mobile + naadi.ma)
├── naadi-partner/        # Partner app (mobile + naadi.ma/partner)
└── package.json           # Root monorepo config
```

#### 3.1.1 packages/types

- **Purpose**: Defines Firestore schemas and API payloads as a subrepo.
- **Structure**:

```
packages/types/
├── src/
│   ├── firestore.ts       # Firestore schemas
│   ├── api.ts            # API request/response types
│   └── index.ts          # Exports
├── .git/                 # Subrepo Git folder
├── package.json
├── tsconfig.json
└── dist/
```

#### 3.1.2 packages/api

- **Purpose**: Contains shared Expo Router API route logic, hosted by EAS, managed as a subrepo.
- **Structure**:

```
packages/api/
├── src/
│   ├── auth/
│   │   ├── signup.ts      # User signup
│   │   ├── businessSignup.ts # Partner signup
│   │   └── login.ts       # Login
│   ├── bookings/
│   │   ├── create.ts
│   │   ├── cancel.ts
│   │   └── confirmPayment.ts
│   ├── studios/
│   │   ├── create.ts
│   │   ├── update.ts
│   │   ├── delete.ts
│   │   └── stats.ts
│   ├── classes/
│   │   ├── create.ts
│   │   ├── update.ts
│   │   └── delete.ts
│   ├── users/
│   │   ├── update.ts
│   │   └── delete.ts
│   └── feedback/
│       └── submit.ts
├── utils/
│   ├── firestore.ts       # Firestore helpers
│   ├── payment.ts         # Payment processing
│   ├── signupCode.ts      # Signup code validation
│   └── apiError.ts        # Error handling
├── .git/                 # Subrepo Git folder
├── package.json
├── tsconfig.json
└── dist/
```

#### 3.1.3 naadi-user

- **Purpose**: User app for mobile and web (naadi.ma), featuring map-based studio browsing.
- **Structure**:

```
naadi-user/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup.ts  # From packages/api
│   │   │   └── login.ts   # From packages/api
│   │   ├── bookings/
│   │   │   ├── create.ts
│   │   │   └── cancel.ts
│   │   ├── users/
│   │   │   ├── update.ts
│   │   │   └── delete.ts
│   │   └── feedback/
│   │       └── submit.ts
│   ├── _layout.tsx        # Root layout with header
│   ├── index.tsx          # naadi.ma home
│   ├── index.web.tsx
│   ├── login.tsx          # Redirects to user app
│   ├── login.web.tsx
│   ├── signup.tsx
│   ├── signup.web.tsx
│   ├── (main)/
│   │   ├── _layout.tsx
│   │   ├── _layout.web.tsx
│   │   ├── _layout.native.tsx
│   │   ├── studios/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx      # List view
│   │   │   ├── index.web.tsx
│   │   │   ├── mapped.tsx     # Map-based browsing
│   │   │   ├── mapped.web.tsx
│   │   │   ├── [id].tsx       # Studio detail
│   │   │   └── [id].web.tsx
│   │   ├── classes/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── index.web.tsx
│   │   │   ├── [id].tsx
│   │   │   └── [id].web.tsx
│   │   ├── search/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── index.web.tsx
│   │   ├── upcoming/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── index.web.tsx
│   │   └── profile/
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       └── index.web.tsx
│   └── settings/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── index.web.tsx
├── components/
│   ├── Header.tsx         # "For partneres" button
│   ├── MapView.tsx        # Map component for browsing
├── hooks/
│   ├── useStudios.tsx     # Fetches studios for map
├── utils/
├── assets/
├── app.json
├── eas.json
├── tsconfig.json
├── package.json
└── metro.config.js
```

#### 3.1.4 naadi-partner

- **Purpose**: Partner app for mobile and web (naadi.ma/partner).
- **Structure**:

```
naadi-partner/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup.ts      # From packages/api
│   │   │   └── login.ts       # From packages/api
│   │   ├── bookings/
│   │   │   ├── create.ts
│   │   │   ├── cancel.ts
│   │   │   └── confirmPayment.ts
│   │   ├── studios/
│   │   │   ├── create.ts
│   │   │   ├── update.ts
│   │   │   ├── delete.ts
│   │   │   └── stats.ts
│   │   ├── classes/
│   │   │   ├── create.ts
│   │   │   ├── update.ts
│   │   │   └── delete.ts
│   │   ├── users/
│   │   │   ├── update.ts
│   │   │   └── delete.ts
│   │   └── feedback/
│   │       └── submit.ts
│   ├── _layout.tsx
│   ├── index.tsx          # naadi.ma/partner home
│   ├── index.web.tsx
│   ├── login.tsx          # Redirects to partner app
│   ├── login.web.tsx
│   ├── signup.tsx         # Partner signup form
│   ├── signup.web.tsx
│   ├── (main)/
│   │   ├── _layout.tsx
│   │   ├── _layout.web.tsx
│   │   ├── _layout.native.tsx
│   │   ├── index.tsx
│   │   ├── index.web.tsx
│   │   ├── studios/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── index.web.tsx
│   │   │   ├── add.tsx
│   │   │   ├── add.web.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── _layout.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── index.web.tsx
│   │   │   │   ├── reservations.tsx
│   │   │   │   ├── reservations.web.tsx
│   │   │   │   ├── stats.tsx
│   │   │   │   └── stats.web.tsx
│   │   └── profile/
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       └── index.web.tsx
│   └── settings/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── index.web.tsx
├── components/
│   ├── BusinessSignupForm.tsx
├── hooks/
├── utils/
├── assets/
├── app.json
├── eas.json
├── tsconfig.json
├── package.json
└── metro.config.js
```

### 3.2 Data Models

#### 3.2.1 Firestore Collections

- **users**:

```typescript
{
  uid: string,
  email: string,
  role: 'user' | 'partner',
  displayName?: string,
  profilePic?: string,
  businessName?: string,
  contactInfo?: { phone: string, address: string },
  createdAt: string
}
```

- **studios**:

```typescript
{
  id: string,
  businessId: string,
  name: string,
  location: { lat: number, lng: number }, // For map browsing
  address: string,
  description: string,
  photos: string[],
  healthSafetyInfo: string,
  createdAt: string
}
```

- **classes**, **bookings**, **signupCodes**, **feedback**: (Unchanged.)

## 4. System Design

### 4.1 User Flow

- **naadi.ma (naadi-user)**:
  - Home (app/index.tsx) includes a "For partneres" button linking to naadi.ma/partner.
  - Map browsing (app/(main)/studios/mapped.tsx) displays studios using location data.
  - Login (app/login.tsx) redirects to /(main) for user, or naadi.ma/partner for partner.
  - Signup (app/signup.tsx) creates a user account.
- **naadi.ma/partner (naadi-partner)**:
  - Home (app/index.tsx) offers signup/login.
  - Signup (app/signup.tsx) collects contact info, calls /api/auth/businessSignup, redirects to /(main).
  - Login (app/login.tsx) redirects to /(main) for partner, or naadi.ma for user.

### 4.2 API Endpoints

- **Hosted by EAS**:
  - `/api/auth/signup`: POST, user signup.
  - `/api/auth/businessSignup`: POST, partner signup with contact info.
  - `/api/auth/login`: POST, authentication.
  - `/api/bookings/create`: POST, booking creation.
  - `/api/studios/stats`: GET, partner stats.

### 4.3 Map Browsing

- **Component**: naadi-user/components/MapView.tsx uses a library (e.g., react-native-maps) to render studios.
- **Data**: Fetches studios collection via useStudios.tsx, plotting location.lat and location.lng.
- **Route**: app/(main)/studios/mapped.tsx integrates the map view.

**naadi-user/hooks/useStudios.tsx (example)**:
```typescript
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Studio } from '@naadi/types';
import { db } from '../utils/firebase/firestore';

export function useStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);

  useEffect(() => {
    const fetchStudios = async () => {
      const snapshot = await getDocs(collection(db, 'studios'));
      setStudios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Studio)));
    };
    fetchStudios();
  }, []);

  return studios;
}
```

### 4.4 Security

#### 4.4.1 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }

    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow create: if request.auth.token.firebase.sign_in_provider == 'custom';
      allow update: if request.auth.uid == userId || request.auth.token.firebase.sign_in_provider == 'custom';
      allow delete: if request.auth.uid == userId;
    }

    match /studios/{studioId} {
      allow read: if request.auth != null; // Public for map browsing
      allow create, update, delete: if request.auth.token.firebase.sign_in_provider == 'custom' && isRole('partner');
    }

    match /classes/{classId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth.token.firebase.sign_in_provider == 'custom' && isRole('partner');
    }

    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.userId || isRole('partner');
      allow create, update: if request.auth.token.firebase.sign_in_provider == 'custom';
      allow delete: if false;
    }

    match /signupCodes/{codeId} {
      allow read, update: if request.auth.token.firebase.sign_in_provider == 'custom' && isRole('partner');
      allow create, delete: if false;
    }

    match /feedback/{feedbackId} {
      allow create: if request.auth != null;
      allow read: if request.auth.token.firebase.sign_in_provider == 'custom';
      allow update, delete: if false;
    }
  }
}
```

## 5. Implementation Details

### 5.1 Technology Stack

- **Frontend**: React Native, Expo SDK 52, Expo Router v3, react-native-maps for map browsing.
- **Backend**: Firebase Firestore, Firebase Authentication.
- **Hosting**: EAS (mobile + web/API).
- **Subrepos**: Git subrepos for packages/types and packages/api.

### 5.2 Deployment

- **Subrepos**:
  - git subrepo clone <types-repo-url> packages/types.
  - git subrepo clone <api-repo-url> packages/api.
  - Build: cd packages/types && npm run build, cd packages/api && npm run build.
- **naadi-user**: eas build (mobile), eas deploy --platform web (naadi.ma).
- **naadi-partner**: eas build (mobile), eas deploy --platform web (naadi.ma/partners).

### 5.3 Cost Estimates

- **1M Ops**: ~$0.96 (Firestore + EAS free tier).
- **10M Ops**: ~$108.60 (Firestore + EAS Growth Plan).

### 5.4 Testing Strategy

- **Mock API Testing**: A mock implementation of Firebase API that allows testing without real database connections.
- **Endpoint Tests**: Comprehensive tests for all API endpoints:
  - Authentication (signup, login, me, signout)
  - User Management (staff operations)
  - Studios (list, create, retrieve, update, delete)
  - Classes (list, create, update, delete)
  - Bookings (get by studio, get by ID, update status)
  - Feedback (retrieve for studios and classes)
  - Analytics (daily, weekly, financial)
- **Test Structure**:
  - Mock endpoint implementations
  - Test functions for each API endpoint
  - Centralized test runner (run-all-tests.js)
- **Coverage**:
  - Authentication and authorization checks
  - Input validation
  - Error handling
  - Partner logic validation
  - Access control
- **Benefits**:
  - Isolation from external dependencies
  - Fast execution without network calls
  - Comprehensive coverage of API functionality
  - Early detection of regressions
  - Documentation of expected behavior

## 6. Constraints and Assumptions

### 6.1 Constraints

- Map browsing requires geolocation data in studios.
- EAS Hosting experimental status may need fallback.

### 6.2 Assumptions

- naadi.ma DNS supports subdomain/path routing.
- Users have map-compatible devices/browsers.

## 7. Future Enhancements

- Real-time studio updates on the map.
- Filter options for map browsing (e.g., distance, type).
- Multi-language support.

## 8. Conclusion

Naadi's design ensures a seamless experience for users browsing studios via a map and partneres managing their offerings, all within a lean monorepo with subrepos for shared logic. The structure supports naadi.ma and naadi.ma/partner efficiently, meeting all requirements.