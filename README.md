# Naadi

Naadi is a platform that connects users to fitness studios via map-based browsing and enables businesses to manage their offerings.

## Features

- **User App** (naadi.ma):
  - Browse studios on a map
  - Book classes
  - Manage bookings
  - Available on mobile and web

- **Business App** (naadi.ma/business):
  - Manage studios and classes
  - Handle bookings
  - View business statistics
  - Available on mobile and web

## Project Structure

```
naadi/
├── packages/              # Shared packages
│   ├── types/             # Type definitions
│   └── api/               # API logic
├── naadi-user/            # User app (mobile + naadi.ma)
├── naadi-business/        # Business app (mobile + naadi.ma/business)
├── build-packages.sh      # Script to build packages
└── package.json           # Root monorepo config
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
   ./build-packages.sh
   ```

### Development

- To run the user app:
  ```bash
  npm run dev:user
  ```

- To run the business app:
  ```bash
  npm run dev:business
  ```

## Deployment

- **Mobile Apps**:
  ```bash
  npm run build:user    # Build user app
  npm run build:business    # Build business app
  ```

- **Web Apps**:
  ```bash
  npm run deploy:user-web     # Deploy to naadi.ma
  npm run deploy:business-web # Deploy to naadi.ma/business
  ```

## License

[MIT](LICENSE)