# Managing App Variants (Main vs. Partner)

This project uses a single codebase (`src/`) to build two distinct application variants: the main user app and the partner app. This is achieved through dynamic configuration driven by an environment variable and managed by Expo Application Services (EAS).

## Key Components

1.  **`EXPO_PUBLIC_APP_VARIANT` Environment Variable:**
    *   The core mechanism for determining which variant to build or run.
    *   Expected values: `'main'` or `'partner'`.
    *   Set during development locally (e.g., `export EXPO_PUBLIC_APP_VARIANT=main`) or via `.env` files.
    *   Set during builds via **EAS Build Profiles** in `eas.json`.

2.  **`src/app.config.js`:**
    *   Dynamically configures the Expo app build based on `process.env.EXPO_PUBLIC_APP_VARIANT`.
    *   Reads the variable at build time.
    *   Selects the appropriate configuration object (`mainConfig` or `partnerConfig`).
    *   Sets variant-specific properties like:
        *   `name`: App display name (e.g., "Naadi", "Naadi Partner").
        *   `slug`: Unique identifier for URLs/deep linking (e.g., "naadi", "naadi-partner").
        *   `ios.bundleIdentifier`: iOS app ID (e.g., "ma.naadi.app", "ma.naadi.partner").
        *   `android.package`: Android application ID (e.g., "ma.naadi.app", "ma.naadi.partner").
        *   `icon`: Path to the app icon.
        *   `splash.image`: Path to the splash screen image.
        *   `adaptiveIcon.foregroundImage`: Path to the Android adaptive icon foreground.
    *   Also defines common configuration shared by both variants.

3.  **`src/app/` Directory Structure (Expo Router):**
    *   Uses **Expo Router route groups** to organize variant-specific screens, layouts, and assets.
    *   `(main)`: Contains routes primarily for the main user app.
        *   `(main)/(tabs)`: Example tab layout for the main app.
        *   `(main)/(assets)`: Contains `icon-main.png`, `splash-main.png`, etc., referenced by `mainConfig` in `app.config.js`.
    *   `(partners)`: Contains routes primarily for the partner app.
        *   `(partners)/(tabs)`: Example tab layout for the partner app.
        *   `(partners)/(assets)`: Contains `icon-partner.png`, `splash-partner.png`, etc., referenced by `partnerConfig` in `app.config.js`.
    *   Shared routes, components, and the root layout (`_layout.tsx`) can exist outside these groups.

4.  **`eas.json` (EAS Build Profiles):**
    *   Defines different build profiles for development, preview, and production.
    *   Crucially, sets the `env.EXPO_PUBLIC_APP_VARIANT` within each profile to tell EAS which variant to build.
    *   Example Profiles:
        *   `development-main`: Builds a development client for the main app.
        *   `production-partner`: Builds a production app for the partner variant.

## Development Workflow

1.  **Set Environment Variable:** Before running the app locally, set the `EXPO_PUBLIC_APP_VARIANT`:
    ```bash
    export EXPO_PUBLIC_APP_VARIANT=main # Or 'partner'
    ```
2.  **Start Development Server:**
    ```bash
    npx expo start
    ```
    The running app will use the configuration corresponding to the `EXPO_PUBLIC_APP_VARIANT` you set. `app.config.js` selects the correct name, icons, etc., dynamically *at runtime* for the dev client, although some features like native bundle IDs are only truly set during a *build*.

## Build Workflow (EAS)

1.  **Choose Profile:** Select the desired build profile from `eas.json` that corresponds to the variant and environment you need.
2.  **Run Build:**
    ```bash
    # Build production Android app for the main variant
    eas build --platform android --profile production-main

    # Build preview iOS app for the partner variant
    eas build --platform ios --profile preview-partner
    ```
3.  EAS reads the profile, sets `EXPO_PUBLIC_APP_VARIANT` in the build environment, and `app.config.js` generates the correct native project configuration before the build proceeds.

## Conditional Logic in Code (If Needed)

While most variant differences are handled by configuration (`app.config.js`) and routing (`src/app/`), you might occasionally need conditional logic within shared components or hooks.

```typescript
import Constants from 'expo-constants';

const appVariant = Constants.expoConfig?.extra?.appVariant || process.env.EXPO_PUBLIC_APP_VARIANT || 'main';

function MySharedComponent() {
  if (appVariant === 'partner') {
    // Render something specific for partners
  } else {
    // Render default for main users
  }
  // ...
}
```

**Note:** Relying heavily on runtime checks can make code complex. Prefer configuration and routing for managing variants where possible. Ensure the `appVariant` is consistently available (e.g., by passing it via `extra` in `app.config.js` if needed beyond build time, although direct use of `EXPO_PUBLIC_APP_VARIANT` is often sufficient). 