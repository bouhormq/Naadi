/**
 * Mock API Functions for Testing
 * 
 * This file provides mock implementations of the @naadi/api functions
 * for use in testing the API endpoints.
 */

// Mock database of users
const mockUsers = {
  'user-123': {
    id: 'user-123',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    phoneNumber: '+1234567890',
    role: 'user',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z',
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      favoriteClasses: ['yoga', 'pilates'],
      favoriteInstructors: ['instructor-789']
    }
  },
  'user-456': {
    id: 'user-456',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phoneNumber: '+9876543210',
    role: 'user',
    createdAt: '2023-02-15T00:00:00.000Z',
    updatedAt: '2023-07-15T00:00:00.000Z',
    preferences: {
      notifications: {
        email: true,
        push: false,
        sms: true
      },
      favoriteClasses: ['spin', 'hiit'],
      favoriteInstructors: ['instructor-123']
    }
  }
};

// Mock database of studios
const mockStudios = {
  'studio-123': {
    id: 'studio-123',
    name: 'Zen Fitness Studio',
    address: {
      street: '123 Wellness Ave',
      city: 'Fitnessville',
      state: 'CA',
      zip: '90210',
      country: 'USA'
    },
    phone: '+1123456789',
    email: 'info@zenfitness.com',
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
    name: 'Power Athletics',
    address: {
      street: '456 Strength Street',
      city: 'Muscletown',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    phone: '+1987654321',
    email: 'info@powerathletics.com',
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
    name: 'Vinyasa Flow Yoga',
    description: 'A flowing yoga practice connecting breath with movement',
    duration: 60,
    capacity: 20,
    instructorId: 'instructor-123',
    category: 'yoga',
    level: 'all-levels',
    equipment: ['yoga mat', 'blocks', 'straps'],
    rating: 4.9
  },
  'class-456': {
    id: 'class-456',
    studioId: 'studio-123',
    name: 'Meditation Basics',
    description: 'Introduction to meditation techniques for beginners',
    duration: 45,
    capacity: 15,
    instructorId: 'instructor-789',
    category: 'meditation',
    level: 'beginner',
    equipment: ['meditation cushion'],
    rating: 4.7
  },
  'class-789': {
    id: 'class-789',
    studioId: 'studio-456',
    name: 'High-Intensity Interval Training',
    description: 'Intense cardio and strength intervals for maximum results',
    duration: 45,
    capacity: 25,
    instructorId: 'instructor-456',
    category: 'hiit',
    level: 'intermediate',
    equipment: ['dumbbells', 'kettlebells', 'jump rope'],
    rating: 4.8
  }
};

// Mock database of feedback
const mockFeedback = {
  'feedback-123': {
    id: 'feedback-123',
    userId: 'user-123',
    studioId: 'studio-123',
    classId: null,
    rating: 5,
    comment: 'Love this studio! The facilities are always clean and the staff is friendly.',
    createdAt: '2023-05-15T10:30:00.000Z'
  },
  'feedback-456': {
    id: 'feedback-456',
    userId: 'user-456',
    studioId: 'studio-123',
    classId: null,
    rating: 4,
    comment: 'Great studio overall. Could use more parking options.',
    createdAt: '2023-06-20T15:45:00.000Z'
  },
  'feedback-789': {
    id: 'feedback-789',
    userId: 'user-123',
    studioId: 'studio-123',
    classId: 'class-123',
    rating: 5,
    comment: 'Amazing yoga class! The instructor was very knowledgeable.',
    createdAt: '2023-07-10T09:15:00.000Z'
  },
  'feedback-101': {
    id: 'feedback-101',
    userId: 'user-456',
    studioId: 'studio-123',
    classId: 'class-123',
    rating: 4,
    comment: 'Good class. Would prefer if it was a bit more challenging.',
    createdAt: '2023-07-12T18:00:00.000Z'
  }
};

// Mock database of instructors
const mockInstructors = {
  'instructor-123': {
    id: 'instructor-123',
    firstName: 'Maya',
    lastName: 'Johnson',
    bio: 'Certified yoga instructor with 10 years of experience',
    specialties: ['yoga', 'meditation', 'breathwork'],
    certifications: ['RYT-500', 'Yoga Alliance Certified'],
    profileImage: 'https://example.com/instructors/maya.jpg',
    studioIds: ['studio-123'],
    classes: ['class-123'],
    rating: 4.9
  },
  'instructor-456': {
    id: 'instructor-456',
    firstName: 'Alex',
    lastName: 'Chen',
    bio: 'Former professional athlete specializing in high-intensity training',
    specialties: ['hiit', 'strength training', 'sports conditioning'],
    certifications: ['NASM-CPT', 'CrossFit L2 Trainer'],
    profileImage: 'https://example.com/instructors/alex.jpg',
    studioIds: ['studio-456'],
    classes: ['class-789'],
    rating: 4.8
  },
  'instructor-789': {
    id: 'instructor-789',
    firstName: 'Sarah',
    lastName: 'Miller',
    bio: 'Mindfulness coach and meditation expert',
    specialties: ['meditation', 'stress reduction', 'restorative yoga'],
    certifications: ['Mindfulness-Based Stress Reduction', 'RYT-200'],
    profileImage: 'https://example.com/instructors/sarah.jpg',
    studioIds: ['studio-123'],
    classes: ['class-456'],
    rating: 4.7
  }
};

// Mock data storage for tests
let mockData = {};

// Mock endpoint handlers
const mockEndpoints = {};

/**
 * Mock an API endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} path - API path, can include parameters like :id
 * @param {Function} handler - Handler function for the endpoint
 */
const mockEndpoint = (method, path, handler) => {
  const key = `${method}:${path}`;
  mockEndpoints[key] = handler;
};

/**
 * Make a request to a mocked endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {string} path - API path
 * @param {Object} body - Request body
 * @param {Object} headers - Request headers
 * @returns {Promise<Object>} - Response object
 */
const makeRequest = async (method, path, body = null, headers = {}) => {
  // Extract path parameters
  const pathParts = path.split('/');
  let matchedEndpoint = null;
  let params = {};

  // Find matching endpoint
  for (const key in mockEndpoints) {
    const [endpointMethod, endpointPath] = key.split(':');
    
    if (endpointMethod !== method) continue;
    
    const endpointParts = endpointPath.split('/');
    
    if (endpointParts.length !== pathParts.length) continue;
    
    let isMatch = true;
    const tempParams = {};
    
    for (let i = 0; i < endpointParts.length; i++) {
      if (endpointParts[i].startsWith(':')) {
        // This is a parameter
        const paramName = endpointParts[i].substring(1);
        tempParams[paramName] = pathParts[i];
      } else if (endpointParts[i] !== pathParts[i]) {
        isMatch = false;
        break;
      }
    }
    
    if (isMatch) {
      matchedEndpoint = mockEndpoints[key];
      params = tempParams;
      break;
    }
  }

  if (!matchedEndpoint) {
    throw new Error(`No mock endpoint found for ${method} ${path}`);
  }

  // Create mock request and response objects
  const req = {
    method,
    path,
    body,
    headers,
    params
  };

  const res = {
    status: (code) => {
      res.statusCode = code;
      return res;
    },
    json: (data) => {
      res.data = data;
      return res;
    },
    statusCode: 200,
    data: null
  };

  // Call the endpoint handler
  await matchedEndpoint(req, res);

  // Return response in a format similar to axios
  if (res.statusCode >= 400) {
    const error = new Error(`Request failed with status code ${res.statusCode}`);
    error.response = {
      status: res.statusCode,
      data: res.data
    };
    throw error;
  }

  return {
    status: res.statusCode,
    data: res.data
  };
};

// Mock JWT token validation
const getUserIdFromToken = (token) => {
  if (!token) return null;
  
  // For test purposes, we'll just map specific tokens to user IDs
  const tokenMap = {
    'valid-token-user-123': 'user-123',
    'valid-token-user-456': 'user-456',
    'valid-token-user-789': 'user-789'
  };
  
  return tokenMap[token] || null;
};

// Get a user by ID
const getUserById = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  
  const user = mockUsers[userId];
  if (!user) throw new Error('User not found');
  
  return user;
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
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
  
  if (!deleted) throw new Error(`Document not found in ${collection} with ID ${id}`);
  
  return { id, deleted: true };
};

// Export the API functions
module.exports = {
  getUserIdFromToken,
  getUserById,
  getDocument,
  getDocuments,
  updateDocument,
  createDocument,
  deleteDocument,
  // Mock data
  mockUsers,
  mockStudios,
  mockClasses,
  mockFeedback,
  mockInstructors,
  // Mock API functions
  mockEndpoint,
  makeRequest,
  mockData
}; 