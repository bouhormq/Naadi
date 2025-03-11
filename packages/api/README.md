# Naadi API

This package contains the shared API logic for the Naadi platform. It provides functions for authentication, bookings, studios, classes, users, and feedback management.

## Installation

```bash
npm install @naadi/api
```

## Usage

```typescript
import { login, createBooking, createStudio } from '@naadi/api';

// Authentication
const authResult = await login({ email: 'user@example.com', password: 'password' });

// Create a booking
const booking = await createBooking({ userId: 'user123', classId: 'class456' });

// Create a studio (business only)
const studio = await createStudio({
  name: 'Yoga Studio',
  location: { lat: 37.7749, lng: -122.4194 },
  address: '123 Main St, San Francisco, CA',
  description: 'A peaceful yoga studio in the heart of the city'
}, 'business123');
```

## API Reference

### Authentication

- `signup(data: SignupRequest)`: Register a new user
- `businessSignup(data: BusinessSignupRequest)`: Register a new business
- `login(data: LoginRequest)`: Authenticate a user or business

### Bookings

- `createBooking(data: CreateBookingRequest)`: Create a new booking
- `cancelBooking(data: CancelBookingRequest)`: Cancel an existing booking
- `confirmPayment(data: ConfirmPaymentRequest)`: Confirm payment for a booking

### Studios

- `createStudio(data: CreateStudioRequest, businessId: string)`: Create a new studio
- `updateStudio(data: UpdateStudioRequest, businessId: string)`: Update an existing studio
- `deleteStudio(studioId: string, businessId: string)`: Delete a studio
- `getStudioStats(studioId: string, businessId: string)`: Get statistics for a studio

### Classes

- `createClass(data: CreateClassRequest, businessId: string)`: Create a new class
- `updateClass(data: UpdateClassRequest, businessId: string)`: Update an existing class
- `deleteClass(classId: string, businessId: string)`: Delete a class

### Users

- `updateUser(userId: string, data: UpdateUserRequest)`: Update a user's profile
- `deleteUserAccount(userId: string)`: Delete a user account

### Feedback

- `submitFeedback(userId: string, data: SubmitFeedbackRequest)`: Submit user feedback

## License

MIT 