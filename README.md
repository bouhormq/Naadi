# Naadi

Naadi is a platform connecting users to fitness studios and enabling partners to manage their offerings. It consists of a single Expo application that builds two distinct variants: a user-facing app ('main') and a partner-facing app ('partner').

## Features

### User App (Main Variant)
- Browse studios with map integration
- Book classes and manage bookings
- User profile management
- Responsive design for mobile and web
- Internationalization support

### Partner App (Partner Variant)
- Studio and class management
- Booking management and analytics
- Staff management
- Business profile customization
- Responsive dashboard

## Project Structure

```
naadi/
├── api/                  # Firebase functions project
│   ├── functions/        # Functions source code
│   │   ├── src/          # Example TS source folder
│   │   ├── utils/        # Shared logic for functions
│   │   └── ...
│   ├── firebase.json     # Firebase config
│   ├── package.json      # Dependencies for functions
│   └── ...
├── docs/                 # Project documentation
│   ├── software-design-document.md
│   ├── architecture-interaction.md
│   ├── testing-strategy.md
│   ├── managing-variants.md
│   └── ...
├── src/                  # Expo app source code
│   ├── app/              # Expo router screens & layouts
│   │   ├── (main)/       # Main app screens
│   │   │   ├── (protected)/ # Protected user routes
│   │   │   └── ...
│   │   ├── partners/     # Partner app screens
│   │   │   ├── (protected)/ # Protected partner routes
│   │   │   └── ...
│   │   └── _layout.tsx   # Root layout
│   ├── api/              # Client-side API helpers
│   ├── components/       # Shared UI components
│   ├── assets/           # Shared assets
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── app.config.js     # Dynamic variant configuration
│   └── ...
├── types/                # Shared TypeScript types
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

## Technologies

- **Frontend**: React Native, Expo SDK, Expo Router
- **Backend**: Firebase Cloud Functions, Firebase Firestore, Firebase Authentication
- **Build & Deployment**: Expo Application Services (EAS)
- **Types**: TypeScript
- **Internationalization**: i18next
- **Testing**: Jest, React Native Testing Library

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

1. Clone the repository:
    ```bash
git clone https://github.com/yourusername/naadi.git
    cd naadi
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
yarn install
    ```

3. Set up environment variables:
    ```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
        ```bash
# For main variant
EXPO_PUBLIC_APP_VARIANT=main npm start
# or
EXPO_PUBLIC_APP_VARIANT=main yarn start

# For partner variant
EXPO_PUBLIC_APP_VARIANT=partner npm start
# or
EXPO_PUBLIC_APP_VARIANT=partner yarn start
```

### Building

To build the app for production:

    ```bash
# Build main variant
eas build --profile production-main

# Build partner variant
eas build --profile production-partner
    ```

## Testing

Run the test suite:

    ```bash
npm test
# or
yarn test
```

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Software Design Document](docs/software-design-document.md)
- [Architecture Interaction](docs/architecture-interaction.md)
- [Testing Strategy](docs/testing-strategy.md)
- [Managing Variants](docs/managing-variants.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.