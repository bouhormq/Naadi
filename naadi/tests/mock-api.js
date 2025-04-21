/**
 * Mock API Functions for Testing Partner App
 * 
 * This file provides mock implementations of the @naadi/api functions
 * for use in testing the partner app API endpoints.
 */

// Mock database of users
const mockUsers = {
  'user-123': {
    id: 'user-123',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phoneNumber: '+1234567890',
    role: 'partner',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z',
    businessId: 'partner-123'
  },
  'user-456': {
    id: 'user-456',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phoneNumber: '+9876543210',
    role: 'partner',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2023-07-15T00:00:00.000Z',
    businessId: 'partner-456'
  }
};

// Mock database of partneres
const mockBusinesses = {
  'partner-123': {
    id: 'partner-123',
    name: 'Zen Fitness',
    ownerId: 'user-123',
    email: 'info@zenfitness.com',
    phone: '+1123456789',
    address: {
      street: '123 Wellness Ave',
      city: 'Fitnessville',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    },
    description: 'A peaceful studio focused on mind-body wellness',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z',
    plan: 'premium',
    paymentStatus: 'active',
    studioIds: ['studio-123']
  },
  'partner-456': {
    id: 'partner-456',
    name: 'Power Athletics',
    ownerId: 'user-456',
    email: 'info@powerathletics.com',
    phone: '+1987654321',
    address: {
      street: '456 Strength Street',
      city: 'Muscletown',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    description: 'High-intensity workouts for serious athletes',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2023-07-15T00:00:00.000Z',
    plan: 'basic',
    paymentStatus: 'active',
    studioIds: ['studio-456']
  }
};

// Mock database of studios
const mockStudios = {
  'studio-123': {
    id: 'studio-123',
    businessId: 'partner-123',
    name: 'Zen Fitness Studio',
    address: {
      street: '123 Wellness Ave',
      city: 'Fitnessville',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    },
    phone: '+1123456789',
    email: 'studio@zenfitness.com',
    description: 'A peaceful studio focused on mind-body wellness',
    amenities: ['showers', 'lockers', 'water station', 'parking'],
    hours: {
      monday: { open: '06:00', close: '21:00' },
      tuesday: { open: '06:00', close: '21:00' },
      wednesday: { open: '06:00', close: '21:00' },
      thursday: { open: '06:00', close: '21:00' },
      friday: { open: '06:00', close: '21:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '09:00', close: '16:00' }
    },
    classes: ['class-123', 'class-456'],
    instructors: ['instructor-123', 'instructor-789'],
    rating: 4.8
  },
  'studio-456': {
    id: 'studio-456',
    businessId: 'partner-456',
    name: 'Power Athletics Gym',
    address: {
      street: '456 Strength Street',
      city: 'Muscletown',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    phone: '+1987654321',
    email: 'studio@powerathletics.com',
    description: 'High-intensity workouts for serious athletes',
    amenities: ['showers', 'lockers', 'towel service', 'protein bar', 'childcare'],
    hours: {
      monday: { open: '05:00', close: '22:00' },
      tuesday: { open: '05:00', close: '22:00' },
      wednesday: { open: '05:00', close: '22:00' },
      thursday: { open: '05:00', close: '22:00' },
      friday: { open: '05:00', close: '22:00' },
      saturday: { open: '07:00', close: '20:00' },
      sunday: { open: '07:00', close: '20:00' }
    },
    classes: ['class-789', 'class-101'],
    instructors: ['instructor-456', 'instructor-321'],
    rating: 4.6
  }
};

// Mock database of classes
const mockClasses = {
  'class-123': {
    id: 'class-123',
    studioId: 'studio-123',
    businessId: 'partner-123',
    name: 'Vinyasa Flow Yoga',
    description: 'A flowing yoga practice connecting breath with movement',
    duration: 60,
    capacity: 20,
    instructorId: 'instructor-123',
    category: 'yoga',
    level: 'all-levels',
    equipment: ['yoga mat', 'blocks', 'straps'],
    price: 15.99,
    schedule: {
      days: ['monday', 'wednesday', 'friday'],
      time: '10:00',
      timeZone: 'America/Los_Angeles'
    },
    rating: 4.9
  },
  'class-456': {
    id: 'class-456',
    studioId: 'studio-123',
    businessId: 'partner-123',
    name: 'Meditation Basics',
    description: 'Introduction to meditation techniques for beginners',
    duration: 45,
    capacity: 15,
    instructorId: 'instructor-789',
    category: 'meditation',
    level: 'beginner',
    equipment: ['meditation cushion'],
    price: 12.99,
    schedule: {
      days: ['tuesday', 'thursday'],
      time: '18:00',
      timeZone: 'America/Los_Angeles'
    },
    rating: 4.7
  }
};

// Mock database of feedback
const mockFeedback = {
  'feedback-123': {
    id: 'feedback-123',
    userId: 'user-123',
    studioId: 'studio-123',
    businessId: 'partner-123',
    classId: null,
    rating: 5,
    comment: 'Love this studio! The facilities are always clean and the staff is friendly.',
    createdAt: '2023-05-15T10:30:00.000Z'
  },
  'feedback-456': {
    id: 'feedback-456',
    userId: 'user-456',
    studioId: 'studio-123',
    businessId: 'partner-123',
    classId: null,
    rating: 4,
    comment: 'Great studio overall. Could use more parking options.',
    createdAt: '2023-06-20T15:45:00.000Z'
  },
  'feedback-789': {
    id: 'feedback-789',
    userId: 'user-123',
    studioId: 'studio-123',
    businessId: 'partner-123',
    classId: 'class-123',
    rating: 5,
    comment: 'Amazing yoga class! The instructor was very knowledgeable.',
    createdAt: '2023-07-10T09:15:00.000Z'
  }
};

// Mock database of instructors
const mockInstructors = {
  'instructor-123': {
    id: 'instructor-123',
    businessId: 'partner-123',
    firstName: 'Maya',
    lastName: 'Johnson',
    email: 'maya.johnson@example.com',
    phone: '+1234567890',
    bio: 'Certified yoga instructor with 10 years of experience',
    specialties: ['yoga', 'meditation', 'breathwork'],
    certifications: ['RYT-500', 'Yoga Alliance Certified'],
    profileImage: 'https://example.com/instructors/maya.jpg',
    studioIds: ['studio-123'],
    classes: ['class-123'],
    rating: 4.9
  },
  'instructor-789': {
    id: 'instructor-789',
    businessId: 'partner-123',
    firstName: 'Sarah',
    lastName: 'Miller',
    email: 'sarah.miller@example.com',
    phone: '+1345678901',
    bio: 'Mindfulness coach and meditation expert',
    specialties: ['meditation', 'stress reduction', 'restorative yoga'],
    certifications: ['Mindfulness-Based Stress Reduction', 'RYT-200'],
    profileImage: 'https://example.com/instructors/sarah.jpg',
    studioIds: ['studio-123'],
    classes: ['class-456'],
    rating: 4.7
  }
};

// Mock database of bookings
const mockBookings = {
  'booking-123': {
    id: 'booking-123',
    userId: 'client-123', // Client user ID
    classId: 'class-123',
    studioId: 'studio-123',
    businessId: 'partner-123',
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2023-12-01T12:00:00.000Z',
    classDate: '2023-12-15T10:00:00.000Z',
    price: 15.99,
    participants: 1
  },
  'booking-456': {
    id: 'booking-456',
    userId: 'client-456', // Client user ID
    classId: 'class-456',
    studioId: 'studio-123',
    businessId: 'partner-123',
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2023-12-05T14:30:00.000Z',
    classDate: '2023-12-20T15:00:00.000Z',
    price: 12.99,
    participants: 2
  }
};

// Mock analytics data
const mockAnalytics = {
  'partner-123': {
    dailyVisits: [
      { date: '2023-12-01', count: 25 },
      { date: '2023-12-02', count: 30 },
      { date: '2023-12-03', count: 22 }
    ],
    classBookings: [
      { classId: 'class-123', count: 45 },
      { classId: 'class-456', count: 32 }
    ],
    revenue: {
      total: 2500.99,
      byMonth: [
        { month: '2023-10', amount: 800.50 },
        { month: '2023-11', amount: 950.25 },
        { month: '2023-12', amount: 750.24 }
      ]
    },
    demographics: {
      ageGroups: [
        { group: '18-24', percentage: 15 },
        { group: '25-34', percentage: 40 },
        { group: '35-44', percentage: 25 },
        { group: '45-54', percentage: 15 },
        { group: '55+', percentage: 5 }
      ],
      gender: [
        { type: 'female', percentage: 65 },
        { type: 'male', percentage: 30 },
        { type: 'other', percentage: 5 }
      ]
    }
  }
};

// Mock JWT token validation
const getUserIdFromToken = (token) => {
  if (!token) return null;
  
  try {
    // Mock token parsing - in real implementation this would decode the token
    if (token === 'valid-token-user-123') return 'user-123';
    if (token === 'valid-token-user-456') return 'user-456';
    
    // For test purposes, we'll just extract the user ID from the token
    // In a real app, this would verify the JWT and extract the user ID from it
    const tokenSections = token.split('.');
    if (tokenSections.length === 3) {
      // Handle JWT-like tokens
      // Additional JWT validation logic would go here
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Get a user by ID
const getUserById = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const user = mockUsers[userId];
  if (!user) throw new Error('User not found');
  
  return user;
};

// Get a partner by owner ID
const getBusinessByOwnerId = async (ownerId) => {
  if (!ownerId) throw new Error('Owner ID is required');
  
  const partner = Object.values(mockBusinesses).find(b => b.ownerId === ownerId);
  if (!partner) throw new Error('Partner not found for owner');
  
  return partner;
};

// Get a document from a collection
const getDocument = async (collection, id) => {
  if (!collection) throw new Error('Collection name is required');
  if (!id) throw new Error('Document ID is required');
  
  let doc = null;
  
  switch (collection) {
    case 'users':
      doc = mockUsers[id];
      break;
    case 'partneres':
      doc = mockBusinesses[id];
      break;
    case 'studios':
      doc = mockStudios[id];
      break;
    case 'classes':
      doc = mockClasses[id];
      break;
    case 'feedback':
      doc = mockFeedback[id];
      break;
    case 'instructors':
      doc = mockInstructors[id];
      break;
    case 'bookings':
      doc = mockBookings[id];
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  
  if (!doc) throw new Error(`Document not found in ${collection} with ID ${id}`);
  
  return doc;
};

// Get all documents from a collection that match a filter
const getDocuments = async (collection, filter = {}) => {
  if (!collection) throw new Error('Collection name is required');
  
  let docs = [];
  
  switch (collection) {
    case 'users':
      docs = Object.values(mockUsers);
      break;
    case 'partneres':
      docs = Object.values(mockBusinesses);
      break;
    case 'studios':
      docs = Object.values(mockStudios);
      break;
    case 'classes':
      docs = Object.values(mockClasses);
      break;
    case 'feedback':
      docs = Object.values(mockFeedback);
      break;
    case 'instructors':
      docs = Object.values(mockInstructors);
      break;
    case 'bookings':
      docs = Object.values(mockBookings);
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  
  // Apply filters if any
  if (Object.keys(filter).length > 0) {
    docs = docs.filter(doc => {
      for (const [key, value] of Object.entries(filter)) {
        if (doc[key] !== value) return false;
      }
      return true;
    });
  }
  
  return docs;
};

// Get analytics data for a partner
const getBusinessAnalytics = async (businessId) => {
  if (!businessId) throw new Error('Partner ID is required');
  
  const analytics = mockAnalytics[businessId];
  if (!analytics) throw new Error('Analytics not found for partner');
  
  return analytics;
};

// Update a document in a collection
const updateDocument = async (collection, id, data) => {
  if (!collection) throw new Error('Collection name is required');
  if (!id) throw new Error('Document ID is required');
  if (!data) throw new Error('Update data is required');
  
  let doc = null;
  
  switch (collection) {
    case 'users':
      doc = mockUsers[id];
      if (doc) mockUsers[id] = { ...doc, ...data, updatedAt: new Date().toISOString() };
      break;
    case 'partneres':
      doc = mockBusinesses[id];
      if (doc) mockBusinesses[id] = { ...doc, ...data, updatedAt: new Date().toISOString() };
      break;
    case 'studios':
      doc = mockStudios[id];
      if (doc) mockStudios[id] = { ...doc, ...data, updatedAt: new Date().toISOString() };
      break;
    case 'classes':
      doc = mockClasses[id];
      if (doc) mockClasses[id] = { ...doc, ...data, updatedAt: new Date().toISOString() };
      break;
    case 'feedback':
      doc = mockFeedback[id];
      if (doc) mockFeedback[id] = { ...doc, ...data, updatedAt: new Date().toISOString() };
      break;
    case 'instructors':
      doc = mockInstructors[id];
      if (doc) mockInstructors[id] = { ...doc, ...data, updatedAt: new Date().toISOString() };
      break;
    case 'bookings':
      doc = mockBookings[id];
      if (doc) mockBookings[id] = { ...doc, ...data, updatedAt: new Date().toISOString() };
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  
  if (!doc) throw new Error(`Document not found in ${collection} with ID ${id}`);
  
  return { id, ...data };
};

// Create a document in a collection
const createDocument = async (collection, data) => {
  if (!collection) throw new Error('Collection name is required');
  if (!data) throw new Error('Document data is required');
  
  // Generate a new ID
  const id = `${collection.slice(0, -1)}-${Date.now()}`;
  const now = new Date().toISOString();
  const document = { id, ...data, createdAt: now, updatedAt: now };
  
  switch (collection) {
    case 'users':
      mockUsers[id] = document;
      break;
    case 'partneres':
      mockBusinesses[id] = document;
      break;
    case 'studios':
      mockStudios[id] = document;
      break;
    case 'classes':
      mockClasses[id] = document;
      break;
    case 'feedback':
      mockFeedback[id] = document;
      break;
    case 'instructors':
      mockInstructors[id] = document;
      break;
    case 'bookings':
      mockBookings[id] = document;
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  
  return document;
};

// Delete a document from a collection
const deleteDocument = async (collection, id) => {
  if (!collection) throw new Error('Collection name is required');
  if (!id) throw new Error('Document ID is required');
  
  let deleted = false;
  
  switch (collection) {
    case 'users':
      if (mockUsers[id]) {
        delete mockUsers[id];
        deleted = true;
      }
      break;
    case 'partneres':
      if (mockBusinesses[id]) {
        delete mockBusinesses[id];
        deleted = true;
      }
      break;
    case 'studios':
      if (mockStudios[id]) {
        delete mockStudios[id];
        deleted = true;
      }
      break;
    case 'classes':
      if (mockClasses[id]) {
        delete mockClasses[id];
        deleted = true;
      }
      break;
    case 'feedback':
      if (mockFeedback[id]) {
        delete mockFeedback[id];
        deleted = true;
      }
      break;
    case 'instructors':
      if (mockInstructors[id]) {
        delete mockInstructors[id];
        deleted = true;
      }
      break;
    case 'bookings':
      if (mockBookings[id]) {
        delete mockBookings[id];
        deleted = true;
      }
      break;
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  
  if (!deleted) throw new Error(`Document not found in ${collection} with ID ${id}`);
  
  return { id, deleted: true };
};

// Export the mock API functions
module.exports = {
  getUserIdFromToken,
  getUserById,
  getBusinessByOwnerId,
  getDocument,
  getDocuments,
  getBusinessAnalytics,
  updateDocument,
  createDocument,
  deleteDocument,
  // Expose the mock data for testing
  mockData: {
    users: mockUsers,
    partneres: mockBusinesses,
    studios: mockStudios,
    classes: mockClasses,
    feedback: mockFeedback,
    instructors: mockInstructors,
    bookings: mockBookings,
    analytics: mockAnalytics
  }
}; 