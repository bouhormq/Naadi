# Google Places Autocomplete Setup Guide

## Step 1: Install the Package

```bash
npm install react-native-google-places-autocomplete
# or
yarn add react-native-google-places-autocomplete
```

## Step 2: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Places API
   - Maps JavaScript API
   - Google Maps Platform
4. Create an API key (restricted to Android/iOS)
5. Add restrictions:
   - Application restrictions: Android/iOS
   - API restrictions: Places API

## Step 3: Add API Key to Environment Variables

Add to your `.env` file in the root of the project:

```
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key_here
```

Or in `app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      googlePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
    },
  },
};
```

## Step 4: Update eas.json (if using EAS Build)

Add to your `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_GOOGLE_PLACES_API_KEY": "@env EXPO_PUBLIC_GOOGLE_PLACES_API_KEY"
      }
    }
  }
}
```

## Step 5: Usage in Components

The Step3Location component now uses GooglePlacesAutocomplete with the following features:

- **Autocomplete search** for business locations
- **Debounced search** (400ms) to reduce API calls
- **Minimum 2 characters** before searching
- **Custom styling** matching your design
- **Disabled when "No Physical Location" is checked**
- **Auto-clears** when checkbox is selected

## Features Implemented

✅ Google Places autocomplete search
✅ Checkbox for "No Physical Location"
✅ Firebase save on continue
✅ Loading indicators
✅ Error handling
✅ Custom styling

## Environment Variables Required

```
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_key_here
```

## Testing

1. Run `npm start` or `yarn start`
2. Navigate to Step 3 (Location) in onboarding
3. Start typing a location (e.g., "New York")
4. Select from the dropdown suggestions
5. Verify data saves to Firebase on Continue

## Troubleshooting

- **Autocomplete not working**: Check that API key is valid and Places API is enabled
- **Dropdown not showing**: Ensure `zIndex: 1000` is set (already configured)
- **Slow search**: Debounce is set to 400ms, can be adjusted in component
- **API quota exceeded**: Check your Google Cloud billing and quota limits

## API Costs

Google Places API is a paid service. Pricing:

- **Autocomplete (per session token)**: $0.017 per request
- **Place details**: $0.017 per request
- **$200 free credits monthly** for new accounts

Consider using session tokens to reduce costs:
- One session = complete autocomplete + selection flow
- Reduces costs by ~50%

See [Google Places Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
