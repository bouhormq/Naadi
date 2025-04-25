# Naadi Testing Strategy

This document outlines the testing approach for the Naadi platform, encompassing the Expo frontend application (with its variants) and the Firebase Cloud Functions backend.

## 1. Testing Philosophy

- **Confidence:** Ensure application correctness and prevent regressions.
- **Isolation:** Unit tests should focus on single components/functions.
- **Integration:** Verify interactions between different parts (frontend helpers <-> backend functions).
- **Maintainability:** Tests should be clear, concise, and easy to update.
- **Automation:** Tests should be runnable in CI/CD pipelines.

## 2. Testing Layers & Tools

We employ a multi-layered testing strategy:

1.  **Expo Frontend (`src/` directory):**
    *   **Unit/Integration Tests:** Using **Jest** and **React Native Testing Library** (`@testing-library/react-native`).
    *   **Focus:** Testing individual components, hooks, utility functions, context providers, and screen logic in isolation.
    *   **Location:** Likely within `src/tests/` or alongside components (`*.test.tsx`).

2.  **API Helper Functions (`src/api/`):**
    *   **Unit Tests:** Using **Jest**.
    *   **Focus:** Testing the logic within each helper function, mocking external dependencies (Firebase SDK calls, `fetch`).
    *   **Location:** Likely within `src/api/tests/` or alongside helpers (`*.test.ts`).

3.  **Cloud Functions (`cloud-functions/functions/`):**
    *   **Unit Tests:** Using **Jest** or **Mocha/Chai**. Test framework choice depends on `cloud-functions/functions/package.json`.
    *   **Focus:** Testing individual Cloud Function logic and shared utilities (`cloud-functions/functions/utils/`) in isolation, mocking Firebase Admin SDK calls.
    *   **Integration Tests:** Using the **Firebase Emulator Suite** and a test runner (Jest/Mocha).
    *   **Focus:** Testing the behavior of functions interacting with emulated Firestore, Auth, etc. Verifying database changes, responses, and triggers.
    *   **Location:** Within `cloud-functions/functions/tests/` or similar.

4.  **End-to-End (E2E) Tests (Optional):**
    *   **Tools:** **Detox** (React Native) or **Maestro**. **Playwright/Cypress** if focusing heavily on the web version.
    *   **Focus:** Simulating real user flows across the entire application (both variants), potentially interacting with emulated or staging backend services.
    *   **Location:** A separate `e2e/` directory at the project root.

## 3. Implementation Examples

### 3.1 Frontend Component Test (`src/components/MyButton.test.tsx`)

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyButton from './MyButton';

it('calls onPress when clicked', () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(<MyButton title="Click Me" onPress={mockOnPress} />);

  fireEvent.press(getByText('Click Me'));

  expect(mockOnPress).toHaveBeenCalledTimes(1);
});
```

### 3.2 API Helper Unit Test (`src/api/studios.test.ts`)

```typescript
import { fetchStudios } from './studios'; // Assuming studios helper
import { collection, getDocs } from 'firebase/firestore'; // Mock these

// Mock the entire firestore module
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  // ... other mocked functions
}));

describe('fetchStudios', () => {
  it('should fetch and return studios', async () => {
    const mockSnapshot = {
      docs: [
        { id: 's1', data: () => ({ name: 'Studio A' }) },
        { id: 's2', data: () => ({ name: 'Studio B' }) },
      ],
    };
    (getDocs as jest.Mock).mockResolvedValue(mockSnapshot);

    const studios = await fetchStudios();

    expect(getDocs).toHaveBeenCalledWith(expect.anything()); // Check if called
    expect(studios).toHaveLength(2);
    expect(studios[0].name).toBe('Studio A');
  });
});
```

### 3.3 Cloud Function Integration Test (`cloud-functions/functions/tests/myFunction.test.ts`)

```typescript
import * as admin from 'firebase-admin';
import * as functionsTest from 'firebase-functions-test';

// Initialize the test environment (offline mode)
const testEnv = functionsTest(); // Potentially with project config & service account key

// Import the function to test (adjust path as needed)
import { myFirestoreTrigger } from '../src/index'; // Assuming index.ts exports functions

describe('Cloud Functions Integration Tests', () => {
  let wrapped;

  beforeAll(() => {
    // Wrap the function
    wrapped = testEnv.wrap(myFirestoreTrigger);
  });

  afterAll(() => {
    // Clean up the test environment
    testEnv.cleanup();
    // Optionally clear emulator data
  });

  it('should process Firestore document creation correctly', async () => {
    // Use Admin SDK (connected to emulator) to set up test data
    const firestore = admin.firestore();
    const ref = firestore.collection('testData').doc('doc1');
    await ref.set({ initialValue: 'hello' });

    // Create a snapshot representing the document creation
    const beforeSnap = testEnv.firestore.makeDocumentSnapshot({}, 'testData/doc1');
    const afterSnap = testEnv.firestore.makeDocumentSnapshot({ initialValue: 'hello' }, 'testData/doc1');

    // Call the wrapped function with the trigger data
    await wrapped(afterSnap, { params: { docId: 'doc1' } });

    // Use Admin SDK to assert expected changes in the emulator
    const updatedDoc = await firestore.collection('results').doc('doc1').get();
    expect(updatedDoc.exists).toBe(true);
    expect(updatedDoc.data()?.processedValue).toBe('HELLO'); // Example assertion
  });
});
```

## 4. Running Tests

Specific commands will depend on the setup in `package.json` files (root and `cloud-functions/functions`). Examples:

- **Run Expo App Tests:**
  ```bash
  # From root or src/
  npm test
  # or
  jest
  ```

- **Run Cloud Functions Unit Tests:**
```bash
  cd cloud-functions/functions
  npm test # Or mocha, depending on setup
  cd ../..
```

- **Run Cloud Functions Integration Tests:**
```bash
  # Requires Firebase Emulator Suite running
  cd cloud-functions/functions
  npm run test:integration # Assuming a script is defined
  cd ../..
  ```

## 5. Continuous Integration (CI)

Tests should be integrated into a CI/CD pipeline (e.g., GitHub Actions) to run automatically on code pushes or pull requests. This includes setting up Node.js, Java (for Firebase emulators), installing dependencies for both the app and functions, and running the respective test commands. 