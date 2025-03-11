# Naadi User App

Mobile and web application for users to discover and book fitness classes.

## Setting Up Firebase Authentication

This app uses Firebase for authentication with multiple providers:
- Email/Password
- Phone Number
- Google
- Facebook

### 1. Configure Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Register your app (Web, iOS, and Android)

### 2. Enable Authentication Methods

In the Firebase Console:
1. Go to "Authentication" > "Sign-in method"
2. Enable the following methods:
   - Email/Password
   - Phone
   - Google
   - Facebook

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Install Required Dependencies

```bash
npx expo install firebase
npx expo install expo-web-browser
npx expo install @react-native-async-storage/async-storage
```

### 5. Facebook Authentication Setup

To set up Facebook Authentication:

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Get the App ID and App Secret
4. Add these to your Firebase Console under Authentication > Sign-in method > Facebook
5. Configure OAuth redirect URLs in both Firebase and Facebook Developer Console

### 6. Using Firebase Extensions

Firebase offers several extensions to simplify authentication:

1. **Authenticate with Any Provider**:
   - Enables users to sign up with multiple authentication methods
   - Install through Firebase Console > Extensions > "Authenticate with Any Provider"

2. **Trigger Email**:
   - Sends verification emails, password reset emails, etc.
   - Install through Firebase Console > Extensions > "Trigger Email"

3. **Use the Firebase Extensions in this app**:
   - Update environment variables if needed
   - The app is already configured to work with these extensions

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run start
```

## Testing Authentication

- Test each authentication method from the login/signup screens
- For phone authentication on web, ensure reCAPTCHA is properly set up
- For social logins, ensure you're using registered test accounts or real accounts

## Firebase Security Rules

Ensure your Firestore security rules are properly configured to protect user data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Add more rules as needed
  }
}
```

## API Layer Structure

Naadi uses a three-layer architecture for APIs:

1. **Shared Logic Layer** (`packages/api`): Contains core business logic shared between apps
2. **Server API Layer** (`app/api`): Server-side API endpoints using Expo's file routing
3. **Client API Layer** (`api/`): Client-side wrappers that call server endpoints

### Folder Structure

```
naadi-user/
├── app/
│   ├── api/                  # Server API endpoints
│   │   ├── auth/
│   │   │   ├── signup.ts     # POST handler for user signup
│   │   │   └── login.ts      # POST handler for user login
│   │   ├── bookings/
│   │   │   ├── create.ts
│   │   │   └── cancel.ts
│   │   └── ...
├── api/                      # Client API wrappers
│   ├── auth/
│   │   ├── email.ts
│   │   ├── phone.ts
│   │   ├── social.ts
│   │   └── session.ts
│   ├── bookings/
│   └── ...
```

### How It Works

1. The client code calls a function from the client API layer:
   ```typescript
   import { signupWithEmail } from '../../api/auth/email';
   
   async function handleSignup() {
     try {
       const result = await signupWithEmail(email, password, displayName);
       // Handle success
     } catch (error) {
       // Handle error
     }
   }
   ```

2. The client API function sends a fetch request to the server endpoint:
   ```typescript
   // naadi-user/api/auth/email.ts
   export async function signupWithEmail(email, password, displayName) {
     const response = await fetch('/api/auth/signup', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password, displayName })
     });
     // Handle response
   }
   ```

3. The server endpoint (in `app/api/auth/signup.ts`) processes the request:
   ```typescript
   // naadi-user/app/api/auth/signup.ts
   export async function POST(request: ExpoRequest): Promise<ExpoResponse> {
     const body = await request.json();
     const result = await signup(body); // Call packages/api
     return new ExpoResponse(JSON.stringify(result), { status: 200 });
   }
   ```

4. The shared logic in `packages/api` handles the business operations.

This architecture ensures:
- Code reuse between the user and business apps
- Proper separation between client and server code
- Type safety across all layers
- Consistent error handling

When developing new features, add the API functionality to the appropriate module in the `naadi-user/api` directory. 