# Cloud Functions Setup for Google Places API

## Overview
The location autocomplete feature now uses your Firebase Cloud Functions as a backend proxy to call the Google Places API. This solves CORS issues and keeps your API key secure.

## Setup Steps

### 1. Get Your Google Places API Key
If you don't already have one:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the "Places API"
4. Go to "Credentials" and create an API key
5. (Optional but recommended) Restrict the key to:
   - API restrictions: Places API
   - Application restrictions: None (for development)

### 2. Set Environment Variable for Cloud Functions

#### For Firebase Emulator (Local Development):
1. Create or edit `api/functions/.env.local`:
```bash
GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

2. When running the emulator, the function will read this variable.

#### For Firebase Cloud Functions (Production):
1. Deploy the function with the environment variable:
```bash
cd /Users/salim/Desktop/Naadi/api/functions
firebase functions:config:set google.places_api_key="your_actual_api_key_here"
```

Or set it via Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Functions
4. Click the function `getPlacesSuggestions`
5. Go to Runtime settings
6. Add environment variable: `GOOGLE_PLACES_API_KEY=your_actual_api_key_here`

### 3. Test the Setup

#### Option A: Via Firebase Emulator
```bash
cd /Users/salim/Desktop/Naadi/api/functions
npm install
npm run build
firebase emulators:start
```

#### Option B: Deploy to Firebase
```bash
cd /Users/salim/Desktop/Naadi/api/functions
npm run deploy
```

### 4. Verify the Frontend Works

1. Start your dev server:
```bash
cd /Users/salim/Desktop/Naadi/naadi
npm start
```

2. Navigate to Step 3 (Location) in the onboarding
3. Type in the location field (after 3 characters)
4. You should see suggestions appearing in a dropdown
5. Click a suggestion to select it
6. Click Continue to save

## Troubleshooting

### No suggestions appear
- Check browser console for errors
- Verify `GOOGLE_PLACES_API_KEY` is set in Cloud Functions
- Ensure Places API is enabled in Google Cloud Console

### "Places API is not configured" error
- The environment variable `GOOGLE_PLACES_API_KEY` is not set
- Follow step 2 above to set it properly

### 401/403 API errors
- API key is invalid or expired
- Places API is not enabled for the key
- Check API key restrictions in Google Cloud Console

### Rate limiting errors
- Google Places has rate limits for free tier
- Contact Google Cloud support to increase limits
- Implement request caching/debouncing on frontend (already done - 400ms debounce)

## Cost Information

- **Google Places API**: Free tier available with some limits
- **Firebase Cloud Functions**: Free tier includes 125K calls/month
- **Typical usage**: 1 API call per location search (after debounce)

## Files Modified

- `api/functions/src/index.ts` - Added `getPlacesSuggestions` callable function
- `naadi/app/partners/(onboarding-steps)/Step3Location.tsx` - Updated to use Cloud Function
