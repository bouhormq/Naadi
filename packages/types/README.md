# Naadi Types

This package contains shared TypeScript type definitions for the Naadi platform. It includes Firestore schema types and API request/response types.

## Installation

```bash
npm install @naadi/types
```

## Usage

```typescript
import { User, Studio, Class, Booking } from '@naadi/types';
import { SignupRequest, CreateBookingRequest } from '@naadi/types';

// Use Firestore schema types
const user: User = {
  uid: 'user123',
  email: 'user@example.com',
  role: 'user',
  createdAt: new Date().toISOString()
};

// Use API request types
const signupData: SignupRequest = {
  email: 'user@example.com',
  password: 'password',
  displayName: 'John Doe'
};
```

## Type Definitions

### Firestore Schema Types

- `User`: User document in Firestore
- `Studio`: Studio document in Firestore
- `Class`: Class document in Firestore
- `Booking`: Booking document in Firestore
- `Feedback`: Feedback document in Firestore
- `SignupCode`: Signup code document in Firestore

### API Request/Response Types

- Authentication: `SignupRequest`, `PartnerSignupRequest`, `LoginRequest`
- Bookings: `CreateBookingRequest`, `CancelBookingRequest`, `ConfirmPaymentRequest`
- Studios: `CreateStudioRequest`, `UpdateStudioRequest`, `StudioStatsResponse`
- Classes: `CreateClassRequest`, `UpdateClassRequest`
- Users: `UpdateUserRequest`
- Feedback: `SubmitFeedbackRequest`

## License

MIT 