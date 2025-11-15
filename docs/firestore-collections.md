# Firestore Collections and Data Structure

This document provides a comprehensive overview of all Firestore collections in the Naadi platform, their structure, relationships, and context.

## Table of Contents

1. [Core Collections](#core-collections)
2. [User Management Collections](#user-management-collections)
3. [Business & Studio Collections](#business--studio-collections)
4. [Booking & Class Collections](#booking--class-collections)
5. [Feedback & Reviews](#feedback--reviews)
6. [Partner Management Collections](#partner-management-collections)
7. [Collection Relationships](#collection-relationships)
8. [Data Access Patterns](#data-access-patterns)

---

## Core Collections

### 1. Users Collection

**Path:** `users/{userId}`

Stores all user accounts in the Naadi platform.

```typescript
interface User {
  uid: string;                              // Firebase Auth UID (Document ID)
  email: string;                            // User's email address
  role: 'user' | 'partner' | 'admin';      // User's role in the system
  firstName: string;                        // First name
  lastName: string;                         // Last name
  phone: PhoneInfo;                         // Phone number details
  profilePic?: string;                      // URL to profile picture
  photoURL?: string;                        // Alternative profile photo URL
  authMethod?: 'email' | 'google' | 'facebook' | 'apple'; // Authentication method used
  lastLoginAt?: Date;                       // Timestamp of last login
  agreeToMarketing: boolean;                // Marketing consent
  gender?: 'male' | 'female';               // Gender (optional)
  favorites?: string[];                     // Array of favorite studio/establishment IDs
  createdAt: Date;                          // Account creation timestamp
  updatedAt?: Date;                         // Last update timestamp
}
```

**Phone Info Structure:**
```typescript
interface PhoneInfo {
  code: string;      // Country code (e.g., "MA" for Morocco)
  name: string;      // Country name (e.g., "Morocco")
  number: string;    // Raw phone number (e.g., "612345678")
  dialCode: string;  // International dial code (e.g., "+212")
}
```

**Security Rules:**
- Read: Authenticated users can read
- Write: Admins or the user themselves can write

**Use Cases:**
- User authentication and authorization
- User profile management
- Favorites management
- User preferences and settings

---

### 2. Studios Collection

**Path:** `studios/{studioId}`

Stores all service establishments/studios in the Naadi platform.

```typescript
interface Studio {
  id?: string;                      // Document ID (auto-generated)
  businessId: string;               // Reference to the partner/business owner (UID)
  name: string;                     // Studio name
  location: {                       // Geographic location (NOT GeoPoint)
    lat: number;                    // Latitude
    lng: number;                    // Longitude
  };
  address: string;                  // Full address string
  description: string;              // Studio description
  photos: string[];                 // Array of image URLs stored in Cloud Storage
  healthSafetyInfo: string;         // Health and safety information
  status: 'active' | 'inactive';    // Current status
  createdAt: Date;                  // Creation timestamp
  updatedAt: Date;                  // Last update timestamp
}
```

**Security Rules:**
- Read: All users
- Create: Partners only
- Update/Delete: Partner who owns the studio

**Use Cases:**
- Browse available studios
- Studio detail pages
- Partner studio management
- Location-based search

**Notes:**
- Consider using GeoPoint for efficient geo-queries
- Photos should be stored in Cloud Storage, not in Firestore

---

### 3. Classes Collection

**Path:** `classes/{classId}`

Stores all classes/services offered by studios.

```typescript
interface Class {
  id?: string;                  // Document ID (auto-generated)
  studioId: string;             // Reference to parent studio
  name: string;                 // Class name
  description: string;          // Class description
  instructor: string;           // Instructor name or ID
  startTime: Date;              // Class start time
  endTime: Date;                // Class end time
  capacity: number;             // Maximum number of bookings
  price: number;                // Price in local currency (consider storing in cents)
  tags: string[];               // Classification tags (e.g., "yoga", "pilates")
  status: 'active' | 'cancelled' | 'completed'; // Current status
  createdAt: Date;              // Creation timestamp
  updatedAt?: Date;             // Last update timestamp
}
```

**Security Rules:**
- Read: All users
- Create: Partners only
- Update/Delete: Partner who owns the parent studio

**Use Cases:**
- Browse available classes
- Class details and booking
- Partner class management
- Schedule management

---

### 4. Bookings Collection

**Path:** `bookings/{bookingId}`

Stores all customer bookings/reservations.

```typescript
interface Booking {
  id?: string;                           // Document ID (auto-generated)
  userId: string;                        // Reference to user making the booking
  classId: string;                       // Reference to class being booked
  studioId: string;                      // Reference to studio (denormalized for queries)
  status: 'pending' | 'confirmed' | 'cancelled'; // Booking status
  paymentStatus: 'pending' | 'paid' | 'refunded'; // Payment status
  createdAt: Date;                       // Booking creation timestamp
  updatedAt?: Date;                      // Last update timestamp
}
```

**Security Rules:**
- Read: User who made the booking, partner who owns the studio, admins
- Create: Authenticated users
- Update: User who made the booking or partner who owns the studio

**Use Cases:**
- User booking history
- Partner booking management
- Payment processing
- Capacity management

**Business Logic Considerations:**
- Validate capacity before confirming booking
- Handle cancellation policies
- Manage payment confirmation
- Send notifications on status change

---

## User Management Collections

### 5. Feedback Collection

**Path:** `feedback/{feedbackId}`

Stores customer reviews and feedback.

```typescript
interface Feedback {
  id?: string;              // Document ID (auto-generated)
  userId: string;           // Reference to user leaving feedback
  classId: string;          // Reference to class being reviewed
  studioId: string;         // Reference to studio (denormalized for queries)
  rating: number;           // Rating (typically 1-5)
  comment: string;          // Feedback comment/review text
  createdAt: Date;          // Creation timestamp
  updatedAt?: Date;         // Last update timestamp
}
```

**Security Rules:**
- Read: All users
- Create: Authenticated users
- Update/Delete: User who left the feedback or admins

**Use Cases:**
- Studio/class ratings and reviews
- User reviews of experiences
- Quality feedback for partners
- Average rating calculations

---

### 6. Reviews Collection (Alternative/Extended)

**Path:** `reviews/{reviewId}`

Extended review structure for more detailed feedback.

```typescript
interface Review {
  id: string;               // Document ID (auto-generated)
  userId: string;           // Reference to user leaving review
  userName: string;         // User's name (denormalized)
  userInitials?: string;    // User initials for display
  rating: number;           // Rating (1-5 stars)
  comment: string;          // Review text
  date: string;             // ISO timestamp string
  teamMemberId?: string;    // Optional reference to specific team member
  serviceId?: string;       // Optional reference to specific service
  studioId?: string;        // Reference to studio
}
```

**Use Cases:**
- Team member specific reviews
- Service specific feedback
- Advanced review filtering and analytics

---

## Business & Studio Collections

### 7. Businesses Collection

**Path:** `Businesses/{businessId}`

Represents business entities associated with partners.

```typescript
interface Business {
  id?: string;              // Document ID (auto-generated)
  ownerUid: string;         // Reference to partner user (UID)
  name: string;             // Business name
  address: {                // Detailed address structure
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phone: PhoneInfo;         // Business phone number
  website?: string;         // Business website URL
  description?: string;     // Business description
  category: string;         // Business category/type
  createdAt?: Date;         // Creation timestamp
  updatedAt?: Date;         // Last update timestamp
}
```

**Security Rules:**
- Read: All users
- Create: Partners only
- Update: Partner who owns the business, admins

**Use Cases:**
- Centralized business information
- Multi-studio businesses
- Business profile management

**Relationship:**
- One business can have multiple studios via `studioId` reference

---

### 8. Establishments Collection (Alternative Name)

**Path:** `establishments/{establishmentId}` (Alternative to studios)

```typescript
interface EstablishmentData {
  id: string;                           // Document ID
  name: string;                         // Establishment name
  rating: number;                       // Average rating
  numberReviews: number;                // Number of reviews
  reviews: Review[];                    // Array of review objects
  address: string;                      // Full address
  location: string;                     // Location description
  images: string[];                     // Image URLs
  coordinate: {                         // Geographic coordinates
    latitude: number;
    longitude: number;
  };
  type: string;                         // Establishment type
  price: number;                        // Price level/indicator
  gender: string;                       // Target gender demographic
  services: ServiceCategory[];          // Available services
  createdAt: string;                    // ISO timestamp
  updatedAt: string;                    // ISO timestamp
  cancellationPolicy?: string;          // Cancellation terms
  about?: string;                       // About section
  openingHours?: {                      // Weekly opening hours
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}
```

**Service Category Structure:**
```typescript
interface Service {
  id: string;               // Service ID
  name: string;             // Service name
  duration: string;         // Duration (e.g., "60 min")
  price: string;            // Price
  category: string;         // Service category
}

interface ServiceCategory {
  name: string;             // Category name (e.g., "Hair", "Spa")
  items: Omit<Service, 'id' | 'category'>[]; // Services in this category
}
```

---

## Booking & Class Collections

### 9. Appointments Collection

**Path:** `appointments/{appointmentId}`

Structured appointment data extending booking concept.

```typescript
interface Appointment {
  id: string;               // Document ID
  venue: string;            // Venue/studio name
  date: string;             // Appointment date (ISO format)
  time: string;             // Appointment time
  duration: string;         // Duration (e.g., "60 min")
  price: string;            // Price
  service: string;          // Service name
  address: string;          // Full address
  coordinate: {             // Geographic location
    latitude: number;
    longitude: number;
  };
  status?: 'Completed' | 'Cancelled' | 'Confirmed'; // Status
  bookingRef?: string;      // Reference to booking document
}
```

**Use Cases:**
- User appointment history
- Appointment tracking
- Cancellation and modifications

---

### 10. TeamMembers Collection

**Path:** `teamMembers/{teamMemberId}`

Stores information about service providers/staff.

```typescript
interface TeamMember {
  id: string;               // Document ID
  name: string;             // Team member name
  role: string;             // Job role/title
  image?: string;           // Profile image URL
  rating?: number;          // Average rating
  specialties: string[];    // List of specialties
  bio?: string;             // Professional biography
  experience?: string;      // Experience description
  venueId: string;          // Reference to primary venue/studio
  serviceIds: string[];     // Array of service IDs they can provide
  reviews: Review[];        // Array of reviews for this team member
  createdAt: string;        // ISO timestamp
  updatedAt: string;        // ISO timestamp
}
```

**Security Rules:**
- Read: All users
- Create/Update: Partner who owns the venue, admins

**Use Cases:**
- Service provider profiles
- Booking with specific providers
- Provider ratings and reviews

---

## Feedback & Reviews

### 11. Review Collection (Detailed)

Covered in section 6 above. Can be a sub-collection under studios/classes for hierarchical queries.

---

## Partner Management Collections

### 12. PartnerRegistrationRequest Collection

**Path:** `PartnerRegistrationRequest/{requestId}`

Stores pending partner signup requests (before approval).

```typescript
interface PartnerSignupRequest {
  id?: string;              // Document ID (requestId)
  email: string;            // Applicant email
  firstName: string;        // First name
  lastName: string;         // Last name
  businessName: string;     // Business name
  website?: string;         // Business website (optional)
  businessType: string;     // Type of business
  location: string;         // Business location
  phone: PhoneInfo;         // Contact phone number
  consent: boolean;         // Terms acceptance
  approved?: boolean;       // Admin approval status
  createdAt?: Date;         // Request creation timestamp
}
```

**Security Rules:**
- Read: Admins only
- Create: System (from signup form)
- Update/Delete: Admins only

**Use Cases:**
- Partner onboarding workflow
- Admin approval queue
- Partner verification

**Workflow:**
1. Partner fills signup form → creates document
2. Admin reviews in console
3. Admin approves → creates PartnerAccount
4. System sends approval email with registration code

---

### 13. PartnerAccounts Collection

**Path:** `PartnerAccounts/{accountId}`

Stores approved partner accounts.

```typescript
interface PartnerAccount {
  id: string;                              // Document ID
  uid?: string;                            // Firebase Auth UID (added after registration)
  email: string;                           // Partner email
  firstName: string;                       // First name
  lastName: string;                        // Last name
  businessName: string;                    // Business name
  website?: string;                        // Business website
  businessType: string;                    // Type of business
  location: string;                        // Business location
  phone: PhoneInfo;                        // Phone number
  consent: boolean;                        // Initial consent flag
  status: 'enabled' | 'disabled';         // Account status
  registrationCode?: string;               // Temporary code for initial signup (removed after use)
  approvedAt: Date;                        // Admin approval timestamp
  createdAt: Date;                         // Original request creation timestamp
  registeredAt?: Date;                     // Partner completion of registration timestamp
  businessId?: string;                     // Link to Business document
}
```

**Security Rules:**
- Read: Admin, the partner themselves
- Create: Admins only (via approval function)
- Update: Admins, the partner themselves

**Use Cases:**
- Partner account management
- Registration flow
- Account status management
- Partner authentication

**Lifecycle:**
1. Partner approval creates this document
2. Partner uses registration code to set password
3. Firebase Auth UID is linked
4. Account transitions to active/enabled state

---

## Collection Relationships

### Entity Relationship Diagram

```
┌─────────────────┐         ┌──────────────────┐
│     Users       │         │  PartnerAccounts │
│   (uid=PK)      │         │  (id=PK, uid=FK)│
└────────┬────────┘         └────────┬─────────┘
         │                           │
         │ businessId/uid            │ businessId (FK)
         │                           │
         └──────────┬────────────────┘
                    │
              ┌─────▼──────────┐
              │   Businesses   │
              │  (id=PK)       │
              └─────┬──────────┘
                    │
                    │ ownerUid (FK)
                    │
              ┌─────▼──────────────┐
              │     Studios        │
              │   (id=PK)          │
              │ businessId (FK)    │
              └─────┬──────────────┘
                    │
         ┌──────────┼──────────────┐
         │          │              │
    ┌────▼────┐ ┌───▼────┐   ┌────▼────┐
    │ Classes │ │Feedback│   │TeamMembs │
    │(id=PK)  │ │(id=PK) │   │(id=PK)  │
    └────┬────┘ └────────┘   └─────────┘
         │
    ┌────▼────────────┐
    │    Bookings     │
    │   (id=PK)       │
    │ userId (FK)     │
    │ classId (FK)    │
    │ studioId (FK)   │
    └─────────────────┘
```

---

## Data Access Patterns

### 1. User Browsing Studios

```
1. Query: studios where status = 'active'
2. Filter by location (client-side or GeoPoint query)
3. Sort by rating (requires materialized field or sub-query)
4. Load first 10 results with pagination
```

### 2. Partner Managing Their Studios

```
1. Query: studios where businessId = authUser.uid
2. List all studios owned by partner
3. For each studio:
   - Load classes
   - Load recent bookings
   - Calculate statistics
```

### 3. User Booking Flow

```
1. Query: Studio by ID
2. Query: Classes where studioId = studio.id AND status = 'active'
3. Create: Booking document with userId, classId, studioId
4. Update: Class document to increment bookings count
5. Check: Capacity constraints before confirming
```

### 4. Loading User Favorites

```
1. Fetch: User document
2. Extract: favorites array (studio IDs)
3. Query: Batch get studios by IDs from favorites
4. Return: Populated favorites list
```

### 5. Partner Dashboard Statistics

```
1. Query: bookings where studioId = partner.studios[]
2. Query: classes where studioId = partner.studios[]
3. Query: feedback where studioId = partner.studios[]
4. Calculate: bookingsCount, revenue, averageRating
5. Return: Dashboard metrics
```

### 6. Finding Reviews for a Studio

```
1. Query: feedback where studioId = studio.id
2. Sort: by createdAt DESC
3. Paginate: Load 10 at a time
4. Calculate: Average rating
```

---

## Denormalization Strategy

For performance optimization, consider denormalizing these fields:

### In Studios Document:
```typescript
- averageRating: number        // Cached from feedback
- reviewCount: number          // Cached from feedback
- bookingCount: number         // Cached from bookings
- totalRevenue: number         // Cached from bookings
- featuredImage?: string       // Primary photo URL
```

### In Classes Document:
```typescript
- bookingCount: number         // Current number of bookings
- availableCapacity: number    // capacity - bookingCount
- rating?: number              // Average class rating
```

### In Bookings Document:
```typescript
- studioName: string          // Denormalized from studio
- className: string           // Denormalized from class
- studentName: string         // Denormalized from user
- price: number               // Price at time of booking
```

**Note:** Use Cloud Functions triggers (onCreate, onUpdate, onDelete) to keep denormalized fields in sync.

---

## Indexing Recommendations

### Composite Indexes

```
Collection: studios
- businessId + status + createdAt
- location (GeoPoint) + status

Collection: classes
- studioId + status + startTime
- studioId + endTime

Collection: bookings
- userId + createdAt
- studioId + status + createdAt

Collection: feedback
- studioId + createdAt
- userId + createdAt
```

---

## Firestore Best Practices Implemented

1. **Security Rules:** Role-based access control (user, partner, admin)
2. **Denormalization:** Key fields copied for performance
3. **References:** Using document IDs for relationships
4. **Subcollections:** Consider for 1-to-many relationships
5. **Document Size:** Keep documents under 1MB (limit images to URLs)
6. **Timestamp:** Use server timestamps for consistency
7. **Pagination:** Implement cursor-based pagination for large result sets

---

## Migration Notes

### From Alternative Schema:

If migrating from the `EstablishmentData` schema:
- Map `establishments` → `studios`
- Normalize `ServiceCategory` → separate `services` collection
- Flatten `openingHours` → store in separate `businessHours` collection
- Extract `TeamMember` items to dedicated collection

---

## Related Documentation

- See `firebase-setup-guide.md` for Firebase configuration
- See `software-design-document.md` for system architecture
- See `testing-strategy.md` for data testing approaches
