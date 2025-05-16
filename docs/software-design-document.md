# Naadi Software Design Document

## 1. Introduction

### 1.1 Purpose

This Software Design Document (SDD) details the architecture and implementation of "Naadi," a platform connecting users to fitness studios and enabling partners to manage their offerings. It outlines a single Expo application project that builds two distinct app variants: a user-facing app ('main') and a partner-facing app ('partner'), configured dynamically. The system utilizes Expo Router for navigation and Firebase Firestore for backend data.

### 1.2 Scope

Naadi consists of a single codebase building two app variants:

- **Naadi (main variant)**: Allows users to browse studios, book classes, and manage bookings. Available on mobile and web.
- **Naadi Partner (partner variant)**: Enables studio owners to manage studios, classes, and bookings. Available on mobile and web.

Key features include:
- Dynamic configuration based on the `EXPO_PUBLIC_APP_VARIANT` environment variable
- Role-based access control within the application logic
- Map-based studio browsing in the user variant
- Management features in the partner variant
- Responsive design supporting both mobile and desktop layouts
- Internationalization support with i18next

### 1.3 Terminology

- **EAS**: Expo Application Services, for building and deploying app variants
- **Expo Router**: File-based routing for navigation within the app
- **Firestore**: NoSQL database for data storage
- **App Variant**: A specific build configuration of the app (e.g., 'main' or 'partner') determined at build time
- **API Helpers**: Functions located in `src/api` used to interact with backend services

## 2. System Overview

### 2.1 System Architecture

Naadi uses a client-server architecture within a single Expo project:

- **Frontend**: A single Expo app codebase (`src/`) using React Native and Expo Router for navigation
- **Backend**: Firebase Firestore for data storage and Firebase Authentication
- **API Interaction**: Client-side API calls managed through helper functions in `src/api`

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
│   ├── architecture-interaction.md
│   ├── testing-strategy.md
│   ├── managing-variants.md
│   └── ...
├── src/                  # Expo app source code
│   ├── app/              # Expo Router screens & layouts
│   │   ├── (main)/       # Main app screens
│   │   │   ├── (protected)/ # Protected user routes
│   │   │   └── ...
│   │   ├── partners/     # Partner app screens
│   │   │   ├── (protected)/ # Protected partner routes
│   │   │   └── ...
│   │   └── _layout.tsx   # Root layout
│   ├── api/              # Client-side API helpers
│   ├── components/       # Shared UI components
│   ├── assets/           # Shared assets
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── app.config.js     # Dynamic variant configuration
│   └── ...
├── types/                # Shared TypeScript types
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

### 3.2 Key Components

#### 3.2.1 Authentication System

- Role-based authentication (user, partner, admin)
- Email/password authentication
- Protected routes based on user role
- Session management through React Context

#### 3.2.2 Partner Management

- Studio creation and management
- Class scheduling and management
- Booking management
- Analytics and reporting

#### 3.2.3 User Features

- Studio browsing
- Class booking
- Booking management
- User profile management

### 3.3 Data Model

#### 3.3.1 Firestore Collections

- **users**: User profiles and authentication data
- **studios**: Studio information and settings
- **classes**: Class schedules and details
- **bookings**: User bookings and attendance
- **feedback**: User reviews and ratings

## 4. Security

### 4.1 Authentication

- Firebase Authentication for user management
- Role-based access control
- Secure session management
- Protected API endpoints

### 4.2 Data Security

- Firestore security rules
- Input validation
- Data sanitization
- Rate limiting

## 5. Deployment

### 5.1 Build Process

- EAS Build for mobile apps
- Web deployment via Expo
- Environment-specific configurations
- Variant-specific builds

### 5.2 Hosting

- Mobile: App Store and Play Store
- Web: Expo hosting
- Backend: Firebase services

## 6. Testing Strategy

- Unit tests for components and utilities
- Integration tests for API interactions
- End-to-end tests for critical flows
- Automated testing pipeline

## 7. Future Enhancements

- Real-time updates
- Advanced analytics
- Multi-language support
- Enhanced booking features
- Payment integration

## 8. Conclusion

Naadi's architecture provides a scalable and maintainable solution for connecting users with fitness studios while enabling partners to manage their offerings effectively. The single codebase approach with variant-specific builds ensures efficient development and deployment.