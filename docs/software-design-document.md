# Naadi Software Design Document

## 1. Introduction

### 1.1 Purpose

This Software Design Document (SDD) details the architecture and implementation of "Naadi," a platform connecting users to fitness studios and enabling partners to manage their offerings. It outlines a single Expo application project that builds two distinct app variants: a user-facing app ('main') and a partner-facing app ('partner'), configured dynamically. The system utilizes Expo Router for navigation and Firebase Firestore for backend data.

### 1.2 Scope

Naadi consists of a single codebase building two app variants:

- **Naadi (main variant)**: Allows users to browse studios, book classes, and manage bookings. Available on mobile and potentially web.
- **Naadi Partner (partner variant)**: Enables studio owners to manage studios, classes, and bookings. Available on mobile and potentially web.

Key features include:
- Dynamic configuration based on the `EXPO_PUBLIC_APP_VARIANT` environment variable.
- Role-based access control within the application logic.
- Map-based studio browsing in the user variant.
- Management features in the partner variant.

### 1.3 Terminology

- **EAS**: Expo Application Services, for building and deploying app variants.
- **Expo Router**: File-based routing for navigation within the app.
- **Firestore**: NoSQL database for data storage.
- **App Variant**: A specific build configuration of the app (e.g., 'main' or 'partner') determined at build time.
- **API Helpers**: Functions located in `src/api` used to interact with backend services (e.g., Firebase Functions or a separate API).

## 2. System Overview

### 2.1 System Architecture

Naadi uses a client-server architecture within a single Expo project:

- **Frontend**: A single Expo app codebase (`app/`) using React Native and Expo Router for navigation. Builds are configured into 'main' or 'partner' variants via `src/app.config.js` and `eas.json`.
- **Backend**: Firebase Firestore for data storage and Firebase Authentication. Business logic requiring server-side execution resides in Firebase Functions (or a separate dedicated backend API), *not* Expo Router API routes.
- **API Interaction**: Client-side API calls are managed through helper functions located in `src/api`.

### 2.2 High-Level Design

```
+---------------------+       +------------------------+       +---------------------+
| Expo App (Variant)  |       | src/api Helper Functions |       | Firebase Services   |
| - UI (React Native) | ----> | - Fetch/Mutate Data    | ----> | - Firestore         |
| - Navigation (Expo) |       | - Business Logic Calls |       | - Authentication    |
| - Variant Config    |       +------------------------+       | - Functions (Cloud) |
+---------------------+                                        +---------------------+
       |                                                            ^
       | Build Variants via EAS                                     | (Direct SDK or Functions)
       v
+---------------------+       +---------------------+
| Naadi App (Main)    |       | Naadi Partner App   |
| (iOS, Android, Web) |       | (iOS, Android, Web) |
+---------------------+       +---------------------+
```

## 3. System Components

### 3.1 Folder Structure

The project follows a standard Expo project structure, adapted for variants:

```
naadi/
├── cloud-functions/      # Firebase functions project
│   ├── functions/        # Functions source code
│   │   ├── src/          # Example TS source folder
│   │   ├── utils/        # Shared logic for functions
│   │   └── ...
│   ├── firebase.json     # Firebase config
│   ├── package.json      # Dependencies for functions
│   └── ...
├── docs/                 # Project documentation
│   ├── software-design-document.md
│   └── ...
├── src/                  # Expo app source code
│   ├── app/              # Expo Router: Screens, Layouts ((main), (partners), etc.)
│   │   ├── (main)/       # Screens/components specific to the main user app
│   │   │   ├── (tabs)/   # Example: Tab navigation layout for main app
│   │   │   │   └── ...
│   │   │   ├── (assets)/ # Assets specific to main variant (icon, splash)
│   │   │   └── ...       # Other main app screens/routes
│   │   ├── partners/     # Screens/components specific to the partner app
│   │   │   ├── (tabs)/   # Example: Tab navigation layout for partner app
│   │   │   │   └── ...
│   │   │   ├── (assets)/ # Assets specific to partner variant (icon, splash)
│   │   │   └── ...       # Other partner app screens/routes
│   │   ├── _layout.tsx   # Root layout, potentially handling variant logic
│   │   └── ...           # Other shared screens/routes
│   ├── api/              # Client-side API helper functions (calling Cloud Functions)
│   │   ├── firebase.js   # Firebase initialization
│   │   ├── auth.js       # Authentication functions (login, signup)
│   │   ├── studios.js    # Studio data functions
│   │   └── ...           # Other API modules
│   ├── components/       # Shared UI components
│   ├── assets/           # Shared assets (fonts, generic images)
│   ├── hooks/            # Shared custom React hooks
│   ├── contexts/         # Shared React contexts (e.g., AuthContext)
│   ├── utils/            # Shared utility functions
│   ├── app.config.js     # Expo configuration, dynamically selects variant settings
│   ├── eas.json          # EAS build configuration (defines variants/profiles)
│   ├── tsconfig.json     # TypeScript config for the Expo app
│   └── ...               # Other source files (tsconfig.json etc.)
├── types/                # Shared TypeScript types (used by src/ and cloud-functions/)
│   ├── index.ts
│   └── ...
├── .gitignore
├── LICENSE
├── package.json          # Dependencies and scripts for the Expo app
├── package-lock.json
└── README.md             # Project README file
```
*Note: The exact structure within `app/` and `cloud-functions/functions/` depends on the chosen layout strategy.*

#### 3.1.1 `src/app.config.js`

- **Purpose**: Configures the Expo build based on the `EXPO_PUBLIC_APP_VARIANT` environment variable. Dynamically sets app name, bundle identifier, icons, splash screens, etc., for each variant ('main', 'partner').
- **Key Logic**: Reads `process.env.EXPO_PUBLIC_APP_VARIANT` and selects the appropriate configuration object (`mainConfig` or `partnerConfig`) to export.

#### 3.1.2 `src/api/`

- **Purpose**: Houses JavaScript/TypeScript modules containing functions that interact with backend services (like Firebase Firestore, Authentication, and Cloud Functions). These are *not* API routes served by Expo, but rather client-side helpers.
- **Example Modules**: `auth.js`, `firestore.js`, `studios.js`, `bookings.js`. Functions typically handle data fetching, data mutation, and communication with the backend.

#### 3.1.3 `app/` Directory (Expo Router)

- **Purpose**: Defines the application's screens, navigation structure, and layouts using Expo Router's file-based routing conventions.
- **Structure**: Organized potentially using route groups like `(main)` and `(partners)` to separate variant-specific UI flows. Shared layouts (`_layout.tsx`) and screens can exist at higher levels. Asset folders like `(assets)` within variant groups hold variant-specific images.

#### 3.1.4 `eas.json`

- **Purpose**: Configures Expo Application Services (EAS) builds. Defines build profiles (e.g., `production-main`, `production-partner`, `preview-main`) that set environment variables like `EXPO_PUBLIC_APP_VARIANT` to trigger the correct configuration in `app.config.js`.

### 3.2 Data Model (Firestore)

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

### 3.4 API Design (Helper Functions)

The application interacts with the backend (primarily Firebase) through helper functions defined in the `src/api/` directory. These functions encapsulate the logic for specific operations.

#### 3.4.1 Authentication (`src/api/auth.js`)

- `signInWithEmail(email, password)`: Authenticates a user.
- `signUpUser(email, password, userData)`: Creates a new user account.
- `signUpPartner(email, password, partnerData)`: Creates a new partner account.
- `signOutUser()`: Signs out the current user.
- `getCurrentUser()`: Retrieves the current authenticated user state.

#### 3.4.2 Studio Management (`src/api/studios.js`)

- `fetchStudios(queryParams)`: Retrieves a list of studios (potentially filtered).
- `fetchStudioById(studioId)`: Gets details for a specific studio.
- `createStudio(studioData)`: Creates a new studio (partner action).
- `updateStudio(studioId, updateData)`: Updates studio details (partner action).

## 5. Deployment

### 5.1 Build Process (EAS)

Builds are managed using EAS CLI and configured in `eas.json`. Different build profiles are defined for each variant and environment (e.g., development, preview, production).

Example `eas.json` structure:

```json
{
  "cli": { ... },
  "build": {
    "development-main": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "main"
      }
    },
    "development-partner": {
       "developmentClient": true,
       "distribution": "internal",
       "env": {
         "EXPO_PUBLIC_APP_VARIANT": "partner"
       }
    },
    "preview-main": {
       "distribution": "internal",
       "env": {
         "EXPO_PUBLIC_APP_VARIANT": "main"
       }
       // ... other preview settings
    },
    "preview-partner": {
       "distribution": "internal",
       "env": {
         "EXPO_PUBLIC_APP_VARIANT": "partner"
       }
       // ... other preview settings
    },
    "production-main": {
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "main"
      }
      // ... iOS/Android specific production settings
    },
    "production-partner": {
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "partner"
      }
      // ... iOS/Android specific production settings
    }
  },
  "submit": { ... } // Submission profiles likely variant-specific too
}

```

To build a specific variant:
`eas build --profile production-main`
`eas build --profile production-partner`

### 5.2 Hosting

- **Mobile Apps**: Deployed to app stores (Apple App Store, Google Play Store) via EAS Submit.
- **Web App**: Can be deployed using various static hosting providers (Vercel, Netlify, Firebase Hosting) or potentially EAS Web Hosting if suitable. The `web.config.expoRouter.origin` in `app.config.js` should be set correctly for the deployed web URL.
- **Backend**: Firebase services (Firestore, Authentication, Functions) are managed through the Firebase console.

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

Naadi's design ensures a seamless experience for users browsing studios via a map and partneres managing their offerings, all within a single Expo project utilizing build variants and client-side API helpers. The structure supports distinct user and partner experiences efficiently, meeting all requirements.