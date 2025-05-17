# Naadi Partner Application

This is the partner administration application for the Naadi platform, allowing studio owners to manage their studios, classes, bookings, and staff.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm start`

## Directory Structure

```
naadi-partner/
├── api/                 # Client API wrappers
├── app/                 # Application code
│   ├── api/             # API endpoints
│   ├── (main)/          # Main app screens
│   └── (auth)/          # Authentication screens
├── components/          # Reusable components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── tests/               # API endpoint tests
```

## Testing

The application includes a comprehensive test suite for API endpoints, using a mock implementation of Firebase functionality.

### Running Tests

To run all tests:

```bash
node tests/run-all-tests.js
```

To run specific test files:

```bash
node tests/test-auth-endpoints.js
node tests/test-analytics-endpoints.js
node tests/test-users-endpoints.js
node tests/test-studios-endpoints.js
node tests/test-classes-endpoints.js
node tests/test-bookings-endpoints.js
node tests/test-feedback-endpoints.js
```

### Testing Architecture

The test suite uses a mock API implementation that simulates Firebase functionality without requiring actual Firebase connections. This approach provides:

- Fast test execution without external dependencies
- Comprehensive coverage of API endpoints
- Testing of error scenarios and edge cases
- Verification of authentication and authorization

Each test file follows a consistent pattern:
1. Mock endpoint implementation
2. Test functions for specific scenarios
3. Run all tests function

For detailed information about the testing strategy, see the [Testing Strategy Document](/docs/testing-strategy.md) in the docs folder.

## API Endpoints

The application exposes the following API endpoints:

### Authentication
- `POST /api/auth/signup`: User registration
- `POST /api/auth/login`: User authentication
- `GET /api/auth/me`: Current user info
- `POST /api/auth/signout`: User logout

### User Management
- `GET /api/users/staff`: Retrieve staff members
- `POST /api/users/staff`: Add staff member

### Studios
- `GET /api/studios/list`: List all studios for a partner
- `POST /api/studios/create`: Create a new studio
- `GET /api/studios/[id]`: Get studio by ID
- `PUT /api/studios/update`: Update studio details
- `DELETE /api/studios/delete`: Delete a studio

### Classes
- `GET /api/classes/list`: List all classes for a studio
- `POST /api/classes/create`: Create a new class
- `PUT /api/classes/update`: Update class details
- `DELETE /api/classes/delete`: Delete a class

### Bookings
- `GET /api/bookings/studio/[id]`: Get bookings for a studio
- `GET /api/bookings/[id]`: Get booking by ID
- `PUT /api/bookings/update`: Update booking status

### Feedback
- `GET /api/feedback/studio/[id]`: Get feedback for a studio
- `GET /api/feedback/class/[id]`: Get feedback for a class

### Analytics
- `GET /api/analytics/daily`: Get daily analytics
- `GET /api/analytics/weekly`: Get weekly analytics
- `GET /api/analytics/financial`: Get financial analytics

## Environment Variables

The application requires the following environment variables:

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

For development, create a `.env.local` file with these variables.

## Expo SDK 53 Upgrade Notes

The project has been successfully upgraded from Expo SDK 52 to SDK 53. All compatibility checks are now passing.

### Upgrade Changes

1. Updated Expo packages:
   - expo: ~53.0.0
   - expo-constants: ~17.1.6
   - expo-linking: ~7.1.5
   - expo-router: ~5.0.7
   - expo-secure-store, expo-splash-screen, expo-status-bar

2. Updated React and React Native:
   - react: 19.0.0
   - react-dom: 19.0.0
   - react-native: 0.79.2
   - react-native-safe-area-context: 5.4.0
   - react-native-web: ^0.20.0

3. Updated Metro packages:
   - metro: ^0.82.0
   - metro-config: ^0.82.0
   - metro-resolver: ^0.82.0

4. Added proper configuration:
   - Created metro.config.js for better module resolution
   - Updated React Navigation-related code for compatibility with v7

### Migration Notes

The upgrade involved significant changes:
- Updated from expo-router v4 to v5 (which uses React Navigation v7)
- Modified Stack navigation options to be compatible with the newer API
- Adjusted animation configurations for proper typing 