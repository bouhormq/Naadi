# Naadi

Naadi is a platform that connects users to fitness studios via map-based browsing and enables partneres to manage their offerings.

## Features

- **User App** (naadi.ma):
  - Browse studios on a map
  - Book classes
  - Manage bookings
  - Available on mobile and web

- **Partner App** (naadi.ma/partner):
  - Manage studios and classes
  - Handle bookings
  - View partner statistics
  - Available on mobile and web

## Project Structure

```
naadi/
├── config/
│   └── tsconfig.base.json    # Base TypeScript configuration
├── docs/
│   ├── api-routing-guide.md        # API routing documentation
│   ├── software-design-document.md # Software Design Document
│   ├── api-implementation-plan.md  # API implementation plan
│   ├── firebase-platform-checklist.md # Firebase platform setup checklist
│   └── firebase-setup-guide.md     # Firebase setup guide
├── naadi-partner/           # Partner app (mobile + naadi.ma/partner)
├── naadi-user/               # User app (mobile + naadi.ma)
├── packages/
│   ├── api/                  # Shared API logic (as subrepo)
│   └── types/                # Shared type definitions (as subrepo)
├── scripts/
│   ├── build-packages.sh     # Script to build packages
│   └── git-sync.sh           # Script to commit and push changes to GitHub
├── .env.local                # Environment variables
├── package.json              # Root package.json
└── README.md                 # This file
```

## Technologies

- **Frontend**: React Native, Expo SDK, Expo Router
- **Backend**: Firebase Firestore, Firebase Authentication
- **Hosting**: EAS (mobile + web/API)
- **Package Management**: npm workspaces

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bouhormq/Naadi.git
   cd naadi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the packages:
   ```bash
   npm run build:all
   ```

### Development

1. Install dependencies:
```bash
npm install
```

2. Build shared packages:
```bash
npm run build:all
# OR
bash scripts/build-packages.sh
```

3. Commit and push changes to GitHub:
```bash
npm run git:sync
# OR
bash scripts/git-sync.sh
```

4. Running Tests:
```bash
# Run all API endpoint tests (both partner and user apps)
npm run test:endpoints

# Run partner app API endpoint tests only
npm run test:partner

# Run user app API endpoint tests only
npm run test:user

# Run shared API package tests
npm run test:api
```

- To run the user app:
  ```bash
  npm run dev:user
  ```

- To run the partner app:
  ```bash
  npm run dev:partner
  ```

## Deployment

- **Mobile Apps**:
  ```bash
  npm run build:user    # Build user app
  npm run build:partner    # Build partner app
  ```

- **Web Apps**:
  ```bash
  npm run deploy:user-web     # Deploy to naadi.ma
  npm run deploy:partner-web # Deploy to naadi.ma/partner
  ```

## License

[MIT](LICENSE)