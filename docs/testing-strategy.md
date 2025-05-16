# Testing Strategy for Naadi

This document outlines the testing strategy for the Naadi platform, covering both the Expo app and Firebase backend.

## 1. Testing Levels

### 1.1 Frontend Testing (Expo App)

#### Unit Tests
- **Tools**: Jest + React Native Testing Library
- **Location**: `src/__tests__/`
- **Coverage**: Components, hooks, utilities
- **Example**:
```typescript
// src/__tests__/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import Button from '@/components/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Test" onPress={onPress} />);
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

#### Integration Tests
- **Tools**: Jest + React Native Testing Library
- **Location**: `src/__tests__/integration/`
- **Coverage**: Screen components, navigation flows
- **Example**:
```typescript
// src/__tests__/integration/Login.test.tsx
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import LoginScreen from '@/app/(main)/login';

jest.mock('expo-router', () => ({
  useRouter: jest.fn()
}));

describe('Login Screen', () => {
  it('handles successful login', async () => {
    const mockRouter = { replace: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/(main)/(protected)');
    });
  });
});
```

#### E2E Tests
- **Tools**: Maestro
- **Location**: `e2e/`
- **Coverage**: Critical user flows
- **Example**:
```yaml
# e2e/login.maestro.yaml
appId: ma.naadi.app
---
- launchApp
- tapOn: "Login"
- inputText:
    id: "email"
    text: "test@example.com"
- inputText:
    id: "password"
    text: "password123"
- tapOn: "Login"
- assertVisible: "Dashboard"
```

### 1.2 Backend Testing (Firebase)

#### Unit Tests
- **Tools**: Jest
- **Location**: `cloud-functions/functions/__tests__/`
- **Coverage**: Cloud Functions, utilities
- **Example**:
```typescript
// cloud-functions/functions/__tests__/auth.test.ts
import { onUserCreated } from '../src/auth';

describe('onUserCreated', () => {
  it('creates user profile in Firestore', async () => {
    const mockUser = {
      uid: 'test123',
      email: 'test@example.com'
    };

    const mockFirestore = {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      set: jest.fn()
    };

    await onUserCreated(mockUser, mockFirestore);

    expect(mockFirestore.set).toHaveBeenCalledWith({
      email: 'test@example.com',
      role: 'user',
      createdAt: expect.any(Date)
    });
  });
});
```

#### Integration Tests
- **Tools**: Firebase Emulator Suite + Jest
- **Location**: `cloud-functions/functions/__tests__/integration/`
- **Coverage**: Function interactions with Firestore
- **Example**:
```typescript
// cloud-functions/functions/__tests__/integration/studios.test.ts
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { createStudio } from '../src/studios';

describe('Studio Management', () => {
  let testEnv;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-naadi'
    });
  });

  it('creates studio with correct permissions', async () => {
    const admin = testEnv.authenticatedContext('admin');
    const studioData = {
      name: 'Test Studio',
      location: { lat: 0, lng: 0 }
    };

    await createStudio(studioData, admin);

    const snapshot = await admin.firestore()
      .collection('studios')
      .where('name', '==', 'Test Studio')
      .get();

    expect(snapshot.size).toBe(1);
  });
});
```

## 2. Test Organization

### 2.1 Directory Structure

```
naadi/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── integration/
│   │   └── utils/
├── cloud-functions/
│   └── functions/
│       ├── __tests__/
│       │   ├── unit/
│       │   └── integration/
└── e2e/
    ├── login.maestro.yaml
    ├── booking.maestro.yaml
    └── studio-management.maestro.yaml
```

### 2.2 Test Naming Conventions

- Unit tests: `[component/function].test.ts(x)`
- Integration tests: `[feature].integration.test.ts(x)`
- E2E tests: `[feature].maestro.yaml`

## 3. Testing Workflow

### 3.1 Local Development

1. Run unit tests:
  ```bash
  npm test
  ```

2. Run integration tests:
```bash
npm run test:integration
```

3. Run E2E tests:
```bash
maestro test e2e/
```

### 3.2 CI/CD Pipeline

1. Pre-commit hooks:
   - Run unit tests
   - Run linter
   - Check types

2. Pull Request checks:
   - Run all tests
   - Generate coverage report
   - Run E2E tests

3. Deployment checks:
   - Run integration tests with emulators
   - Verify security rules
   - Check function permissions

## 4. Test Coverage

### 4.1 Coverage Goals

- Unit tests: 80% coverage
- Integration tests: 60% coverage
- E2E tests: Critical paths only

### 4.2 Coverage Reports

Generate coverage reports:
```bash
npm run test:coverage
```

## 5. Mocking Strategy

### 5.1 Frontend Mocks

- Firebase Auth: `jest.mock('@/api/firebase')`
- Navigation: `jest.mock('expo-router')`
- API calls: `jest.mock('@/api/studios')`

### 5.2 Backend Mocks

- Firestore: Firebase Emulator Suite
- Auth: Firebase Auth Emulator
- Functions: Local function emulator

## 6. Performance Testing

### 6.1 Frontend Performance

- React Native Performance Monitor
- FPS monitoring
- Memory usage tracking

### 6.2 Backend Performance

- Function execution time monitoring
- Firestore query performance
- Rate limiting tests

## 7. Security Testing

### 7.1 Authentication Tests

- Role-based access control
- Token validation
- Session management

### 7.2 Data Security Tests

- Firestore security rules
- Function permissions
- API endpoint security

## 8. Continuous Improvement

### 8.1 Test Review Process

1. Code review checklist:
   - Test coverage adequate
   - Edge cases covered
   - Error handling tested

2. Regular test maintenance:
   - Update tests with new features
   - Remove obsolete tests
   - Optimize test performance

### 8.2 Metrics and Monitoring

- Test coverage trends
- Test execution time
- Failed test patterns
- CI/CD pipeline performance 