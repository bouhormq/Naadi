# Managing App Variants in Naadi

This document outlines how Naadi manages its two app variants (user-facing and partner-facing) using Expo's build system and environment configuration.

## 1. Variant Overview

### 1.1 Available Variants

1. **Main Variant (User App)**
   - Target: End users
   - Features: Studio browsing, class booking, user profile
   - Bundle ID: `ma.naadi.app`

2. **Partner Variant (Partner App)**
   - Target: Studio owners/managers
   - Features: Studio management, class scheduling, analytics
   - Bundle ID: `ma.naadi.partner`

## 2. Configuration Management

### 2.1 Environment Variables

```typescript
// src/app.config.js
export default {
  name: 'Naadi',
  slug: 'naadi',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.EXPO_PUBLIC_APP_VARIANT === 'partner' 
      ? 'ma.naadi.partner'
      : 'ma.naadi.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: process.env.EXPO_PUBLIC_APP_VARIANT === 'partner'
      ? 'ma.naadi.partner'
      : 'ma.naadi.app'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    appVariant: process.env.EXPO_PUBLIC_APP_VARIANT || 'main'
  }
};
```

### 2.2 EAS Build Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "development-main": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "main"
      }
    },
    "development-partner": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "partner"
      }
    },
    "preview-main": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "main"
      }
    },
    "preview-partner": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "partner"
      }
    },
    "production-main": {
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "main"
      }
    },
    "production-partner": {
      "env": {
        "EXPO_PUBLIC_APP_VARIANT": "partner"
      }
    }
  },
  "submit": {
    "production-main": {
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "your-team-id"
      }
    },
    "production-partner": {
      "ios": {
        "appleId": "your-apple-id",
        "ascAppId": "your-partner-app-store-connect-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

## 3. Code Organization

### 3.1 Directory Structure

```
src/
├── app/
│   ├── (main)/           # Main app routes
│   │   ├── (protected)/  # Protected user routes
│   │   │   ├── home.tsx
│   │   │   ├── profile.tsx
│   │   │   └── bookings.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── partners/         # Partner app routes
│   │   ├── (protected)/  # Protected partner routes
│   │   │   ├── dashboard.tsx
│   │   │   ├── studios.tsx
│   │   │   └── classes.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── _layout.tsx       # Root layout with variant detection
```

### 3.2 Variant Detection

```typescript
// src/app/_layout.tsx
import { useAppVariant } from '@/hooks/useAppVariant';

export default function RootLayout() {
  const { isPartner } = useAppVariant();

  return (
    <Stack>
      {isPartner ? (
        <Stack.Screen name="partners" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
```

### 3.3 Custom Hook

```typescript
// src/hooks/useAppVariant.ts
import Constants from 'expo-constants';

export function useAppVariant() {
  const appVariant = Constants.expoConfig?.extra?.appVariant || 'main';
  
  return {
    isPartner: appVariant === 'partner',
    isMain: appVariant === 'main',
    variant: appVariant
  };
}
```

## 4. Building and Deployment

### 4.1 Development

```bash
# Run main variant
EXPO_PUBLIC_APP_VARIANT=main npm start

# Run partner variant
EXPO_PUBLIC_APP_VARIANT=partner npm start
```

### 4.2 Building

```bash
# Build main variant
eas build --profile production-main

# Build partner variant
eas build --profile production-partner
```

### 4.3 Deployment

```bash
# Deploy main variant
eas submit --profile production-main

# Deploy partner variant
eas submit --profile production-partner
```

## 5. Testing

### 5.1 Unit Tests

```typescript
// src/__tests__/hooks/useAppVariant.test.ts
import { useAppVariant } from '@/hooks/useAppVariant';

describe('useAppVariant', () => {
  it('returns correct variant for main app', () => {
    // Mock Constants.expoConfig
    jest.spyOn(Constants, 'expoConfig', 'get').mockReturnValue({
      extra: { appVariant: 'main' }
    });

    const { isPartner, isMain, variant } = useAppVariant();
    
    expect(isPartner).toBe(false);
    expect(isMain).toBe(true);
    expect(variant).toBe('main');
  });
});
```

### 5.2 E2E Tests

```yaml
# e2e/main-app.maestro.yaml
appId: ma.naadi.app
---
- launchApp
- assertVisible: "Welcome to Naadi"
- tapOn: "Browse Studios"

# e2e/partner-app.maestro.yaml
appId: ma.naadi.partner
---
- launchApp
- assertVisible: "Partner Dashboard"
- tapOn: "Manage Studios"
```

## 6. Best Practices

### 6.1 Code Organization

1. **Shared Code**
   - Keep common utilities in `src/utils/`
   - Share components in `src/components/`
   - Use shared types in `types/`

2. **Variant-Specific Code**
   - Use route groups for variant-specific screens
   - Keep variant-specific components in their respective directories
   - Use the `useAppVariant` hook for conditional rendering

### 6.2 Performance

1. **Bundle Size**
   - Use dynamic imports for variant-specific code
   - Implement code splitting
   - Optimize assets per variant

2. **Caching**
   - Implement variant-specific caching strategies
   - Use appropriate storage keys per variant
   - Clear caches when switching variants

### 6.3 Security

1. **Authentication**
   - Implement variant-specific auth flows
   - Use appropriate role-based access control
   - Secure variant-specific endpoints

2. **Data Access**
   - Implement variant-specific data access patterns
   - Use appropriate security rules
   - Validate user roles per variant

## 7. Troubleshooting

### 7.1 Common Issues

1. **Build Failures**
   - Check environment variables
   - Verify bundle identifiers
   - Check EAS configuration

2. **Runtime Issues**
   - Verify variant detection
   - Check navigation structure
   - Validate environment setup

### 7.2 Debugging

1. **Development**
   ```bash
   # Enable debug logging
   EXPO_DEBUG=true EXPO_PUBLIC_APP_VARIANT=main npm start
   ```

2. **Production**
   ```bash
   # Check build logs
   eas build:list
   eas build:view
   ```
