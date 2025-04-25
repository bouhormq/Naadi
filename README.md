# Naadi

Naadi is a platform connecting users to fitness studios and enabling partners to manage their offerings. It consists of a single Expo application that builds two distinct variants: a user-facing app ('main') and a partner-facing app ('partner').

## Features

- **User App (Main Variant)**:
  - Browse studios
  - Book classes
  - Manage bookings
- **Partner App (Partner Variant)**:
  - Manage studios and classes
  - Handle bookings
  - View partner statistics

## Project Structure

```
naadi/
├── cloud-functions/      # Firebase functions project
│   ├── functions/        # Functions source code
│   │   ├── src/          # Example TS source folder
│   │   ├── utils/        # Shared logic for functions
│   │   └── ...
│   ├── firebase.json     # Firebase config
│   ├── package.json      # Dependencies for functions
│   └── ...
├── docs/                 # Project documentation
│   ├── software-design-document.md
│   └── ...
├── src/                  # Expo app source code
│   ├── app/              # Expo router screens & layouts ((main), (partners), etc.)
│   ├── api/              # Client-side API helper functions (calling Cloud Functions)
│   ├── assets/           # Shared assets (fonts, generic images)
│   ├── components/       # Shared UI components
│   ├── contexts/         # Shared React contexts (e.g., AuthContext)
│   ├── hooks/            # Shared custom React hooks
│   ├── tests/            # App tests
│   ├── utils/            # Shared utility functions
│   ├── app.config.js     # Dynamic variant configuration
│   ├── eas.json          # EAS build configuration (variants)
│   ├── tsconfig.json     # TypeScript config for the Expo app
│   └── ...               # Other app source files
├── types/                # Shared TypeScript types (used by src/ and cloud-functions/)
│   ├── index.ts
│   └── ...
├── .gitignore
├── LICENSE
├── package.json          # Dependencies and scripts for the Expo app
├── package-lock.json
└── README.md             # This file
```

## Technologies

- **Frontend**: React Native, Expo SDK, Expo Router
- **Backend**: Firebase Cloud Functions, Firebase Firestore, Firebase Authentication
- **Build & Deployment**: Expo Application Services (EAS)
- **Types**: TypeScript

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or yarn
- Expo CLI (`npm install -g expo-cli` or `yarn global add expo-cli`)
- Firebase CLI (`npm install -g firebase-tools` or `yarn global add firebase-tools`)
- EAS CLI (`npm install -g eas-cli` or `yarn global add eas-cli`)
- Access to the Firebase project
- An Expo account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd naadi
    ```

2.  **Install Expo App Dependencies:**
    ```bash
    # Navigate to the Expo app's source directory if your root package.json isn't set up for it
    # cd src # Uncomment if needed
    npm install
    # or
    # yarn install
    ```

3.  **Install Cloud Functions Dependencies:**
    ```bash
    cd cloud-functions/functions
    npm install
    # or
    # yarn install
    cd ../.. # Return to root
    ```

4.  **Firebase Setup:**
    *   Log in to Firebase: `firebase login`
    *   Select the correct Firebase project: `firebase use <your-firebase-project-id>`
    *   Ensure you have the necessary service account keys or configuration set up if your functions require Admin SDK access locally (refer to Firebase docs).

5.  **Expo Setup:**
    *   Log in to Expo: `expo login`
    *   Ensure `eas.json` is configured with the correct Expo project ID.

## Development

1.  **Run the Expo App (Choose a Variant):**
    *   Set the variant environment variable (e.g., in your shell or `.env` file):
        ```bash
        # For the main user app
        export EXPO_PUBLIC_APP_VARIANT=main
        # OR for the partner app
        # export EXPO_PUBLIC_APP_VARIANT=partner
        ```
    *   Start the development server (from the root or `src/` directory, depending on your `package.json`):
        ```bash
        npx expo start
        ```
    *   Follow the prompts to open the app in a simulator, on a device (Expo Go), or in a web browser.

2.  **Run Cloud Functions Locally (Optional):**
    *   Use the Firebase Emulator Suite:
        ```bash
        # Make sure emulators are configured in firebase.json
        firebase emulators:start --only functions,firestore,auth # Add other services as needed
        ```
    *   Update your client-side API helpers (`src/api/`) to point to the local emulator URLs during development.

## Deployment

1.  **Deploy Cloud Functions:**
    ```bash
    # From the project root
    firebase deploy --only functions
    ```

2.  **Build App Variants with EAS:**
    *   Choose the appropriate build profile from `eas.json` (e.g., `production-main`, `production-partner`).
    ```bash
    # Example: Build production Android app for the main variant
    eas build --platform android --profile production-main

    # Example: Build production iOS app for the partner variant
    eas build --platform ios --profile production-partner
    ```
    *   Follow the EAS CLI prompts.

3.  **Submit to Stores (Optional):**
    *   Use EAS Submit after a successful build:
    ```bash
    eas submit --platform ios --profile production-main --latest # Example
    ```

## License

[MIT](LICENSE)