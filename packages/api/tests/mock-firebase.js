// Mock Firebase implementation for testing
const mockAuth = {
  currentUser: {
    uid: 'test-user-id',
    email: 'test-user@example.com',
    getIdToken: () => Promise.resolve('mock-token')
  }
};

const mockFirestore = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({
        exists: true,
        id: 'test-doc-id',
        data: () => ({
          id: 'test-doc-id',
          email: 'test-user@example.com',
          displayName: 'Test User'
        })
      }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve()
    }),
    add: () => Promise.resolve({ id: 'test-doc-id' }),
    where: () => mockFirestore.collection(),
    orderBy: () => mockFirestore.collection(),
    limit: () => mockFirestore.collection(),
    get: () => Promise.resolve({
      empty: false,
      docs: [
        {
          id: 'test-doc-id',
          data: () => ({
            id: 'test-doc-id',
            email: 'test-user@example.com',
            displayName: 'Test User'
          })
        }
      ]
    })
  })
};

// Mock Firebase Auth functions
const mockFirebaseAuth = {
  getAuth: () => mockAuth,
  signInWithEmailAndPassword: () => Promise.resolve({
    user: {
      uid: 'test-user-id',
      email: 'test-user@example.com',
      displayName: 'Test User'
    }
  }),
  createUserWithEmailAndPassword: () => Promise.resolve({
    user: {
      uid: 'test-user-id',
      email: 'test-user@example.com'
    }
  }),
  updateProfile: () => Promise.resolve({}),
  getIdToken: () => Promise.resolve('mock-token')
};

// Mock Firebase Firestore functions
const mockFirebaseFirestore = {
  getFirestore: () => mockFirestore,
  collection: mockFirestore.collection,
  doc: () => mockFirestore.collection().doc(),
  getDoc: () => Promise.resolve({
    exists: () => true,
    data: () => ({
      id: 'test-user-id',
      email: 'test-user@example.com',
      displayName: 'Test User'
    })
  }),
  setDoc: () => Promise.resolve({}),
  updateDoc: () => Promise.resolve({}),
  deleteDoc: () => Promise.resolve({}),
  addDoc: () => Promise.resolve({ id: 'test-doc-id' }),
  query: () => mockFirestore.collection(),
  where: () => mockFirestore.collection(),
  orderBy: () => mockFirestore.collection(),
  limit: () => mockFirestore.collection(),
  getDocs: () => Promise.resolve({
    empty: false,
    docs: [
      {
        id: 'test-doc-id',
        data: () => ({
          id: 'test-doc-id',
          email: 'test-user@example.com',
          displayName: 'Test User'
        })
      }
    ]
  })
};

// Export mock Firebase
module.exports = {
  auth: mockAuth,
  db: mockFirestore,
  firebase: {
    auth: mockFirebaseAuth,
    firestore: mockFirebaseFirestore
  }
}; 