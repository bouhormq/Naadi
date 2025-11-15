# Onboarding Flow Testing Guide

## Overview
This document guides you through testing the new onboarding flow for both user and partner apps.

## Current Status
✅ App is running on: **http://localhost:8082**

---

## Test Scenario 1: User App Onboarding Flow

### Prerequisites
- App variant is set to `main` (user app)
- You have a test email that hasn't signed up yet

### Steps to Test

1. **Navigate to the App**
   - Open browser: http://localhost:8082
   - Press `w` in terminal to open web interface

2. **Sign Up as New User**
   - Click on the onboarding/signup button
   - Enter test credentials:
     - Email: `testuser@example.com`
     - Password: `TestPassword123!`
     - First Name: `Test`
     - Last Name: `User`
     - Phone: Select country and enter phone number
     - Agree to marketing: ✓ Yes

3. **Expected Behavior After Signup**
   - You should be redirected to: `/(main)/onboarding-flow`
   - You should see:
     - ✅ Page title: "Welcome to Naadi"
     - ✅ Step indicator: "Onboarding Screen"
     - ✅ Features list with icons:
       - ✨ Discover local studios
       - 📅 Easy booking management
       - ⭐ Save your favorites
       - 💬 Leave reviews & feedback
     - ✅ "Continue to Dashboard" button
     - ✅ "Skip Tour" button

4. **Complete Onboarding**
   - Click "Continue to Dashboard" button
   - Loading indicator should appear briefly
   - Should be redirected to: `/(main)/(protected)` (user dashboard)
   - Database should update: `onboardingCompleted: true`

5. **Verify Onboarding is Saved**
   - Sign out from dashboard
   - Log back in with same credentials
   - Should go directly to dashboard (NOT onboarding screen)
   - ✅ This confirms `onboardingCompleted: true` is persisted

---

## Test Scenario 2: Partner App Onboarding Flow

### Prerequisites
- App variant is set to `partner`
- You have an approved partner account

### Steps to Test

1. **Switch to Partner App**
   - Stop current app: Press `Ctrl+C` in terminal
   - Update `.env` file: `EXPO_PUBLIC_APP_VARIANT=partner`
   - Restart app: `npm start`

2. **Log In as Partner**
   - Navigate to: http://localhost:8082
   - Go to Partners login tab
   - Enter partner email: `partneraccount@gmail.com` (or your test partner account)
   - Enter password

3. **Expected Behavior After Login**
   - You should be redirected to: `/partners/onboarding-flow`
   - You should see:
     - ✅ Page title: "Welcome to Naadi Partner"
     - ✅ Step indicator: "Onboarding Screen"
     - ✅ Features list with icons:
       - 📊 Business dashboard
       - 📅 Manage classes & schedules
       - 💰 Track revenue & bookings
       - 👥 Customer reviews & ratings
       - 📱 Mobile-first platform
     - ✅ "Go to Dashboard" button
     - ✅ "Skip Tour" button

4. **Complete Onboarding**
   - Click "Go to Dashboard" button
   - Loading indicator should appear
   - Should be redirected to: `/partners/(protected)` (partner dashboard)
   - Partner should see their business profile form

5. **Verify Onboarding is Saved**
   - Sign out from dashboard
   - Log back in with same partner credentials
   - Should go directly to dashboard (NOT onboarding screen)
   - ✅ This confirms `onboardingCompleted: true` is persisted

---

## Test Scenario 3: Skip Onboarding

### For User App
1. Complete signup
2. On onboarding screen, click "Skip Tour"
3. Should be redirected to dashboard directly
4. `onboardingCompleted` should be set to `true`

### For Partner App
1. Log in as partner
2. On onboarding screen, click "Skip Tour"
3. Should be redirected to partner dashboard
4. `onboardingCompleted` should be set to `true`

---

## Database Verification

### Check User Document in Firestore

1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `naadi-cf4c9`
3. Go to Firestore Database
4. Navigate to `Users` collection
5. Find your test user document
6. Verify the field: `onboardingCompleted: true`

### Sample User Document
```json
{
  "uid": "AS8o5d86iXdUIB2rsMEF...",
  "email": "testuser@example.com",
  "role": "user",
  "firstName": "Test",
  "lastName": "User",
  "phone": {
    "code": "MA",
    "dialCode": "+212",
    "name": "Morocco",
    "number": "612345678"
  },
  "authMethod": "email",
  "agreeToMarketing": true,
  "onboardingCompleted": true,  ✅ Should be true after completing
  "createdAt": "2025-11-15T...",
  "lastLoginAt": "2025-11-15T..."
}
```

---

## Common Issues & Troubleshooting

### Issue: Onboarding screen not showing after signup
**Solution:**
- Check browser console for errors (F12)
- Verify user was created in Firebase Auth
- Check Firestore `Users` collection for the document
- Ensure `onboardingCompleted: false` was set

### Issue: "Onboarding Screen" text not visible
**Solution:**
- Clear browser cache (Ctrl+Shift+Del)
- Reload app (press `r` in terminal)
- Check that onboarding screens were created in the correct paths

### Issue: Continue button not working
**Solution:**
- Check browser console for errors
- Ensure `completeOnboarding()` function was properly imported
- Verify Firebase Firestore permissions allow user to update their own document

### Issue: Redirect loops between login and onboarding
**Solution:**
- Clear session storage: `localStorage.clear()` in browser console
- Sign out completely
- Sign in again
- Check app._layout.tsx routing logic

---

## Expected File Locations

✅ User Onboarding Screen: `/Users/salim/Desktop/Naadi/naadi/app/(main)/onboarding-flow.tsx`
✅ Partner Onboarding Screen: `/Users/salim/Desktop/Naadi/naadi/app/partners/onboarding-flow.tsx`
✅ Updated Root Layout: `/Users/salim/Desktop/Naadi/naadi/app/_layout.tsx`
✅ User Type: `/Users/salim/Desktop/Naadi/types/index.ts` (has `onboardingCompleted: boolean`)
✅ Auth API: `/Users/salim/Desktop/Naadi/naadi/utils/api/auth.ts` (has `completeOnboarding()`)

---

## Success Criteria

All of the following should be true:

- [ ] New user can sign up
- [ ] After signup, user is redirected to onboarding screen
- [ ] Onboarding screen displays "Onboarding Screen" label
- [ ] "Continue to Dashboard" button works
- [ ] After clicking button, user is redirected to dashboard
- [ ] `onboardingCompleted: true` is saved in Firestore
- [ ] On next login, user goes directly to dashboard (no onboarding)
- [ ] Partner signup/login follows same flow
- [ ] Admin account skips onboarding
- [ ] Skip button redirects to dashboard

---

## Environment Setup

### Current App Configuration
```
EXPO_PUBLIC_APP_VARIANT=main
EXPO_PUBLIC_FIREBASE_PROJECT_ID=naadi-cf4c9
EXPO_PUBLIC_FIREBASE_API_KEY=[configured]
```

### To Switch to Partner App
```bash
# Edit .env or use command:
EXPO_PUBLIC_APP_VARIANT=partner npm start
```

### To Switch Back to User App
```bash
EXPO_PUBLIC_APP_VARIANT=main npm start
```

---

## Additional Notes

- Onboarding screens are simple initial screens and can be enhanced later with:
  - Step-by-step tutorials
  - Video guides
  - Permission requests (camera, location, etc.)
  - Preferences setup
  
- The `completeOnboarding()` function can be called at any point to mark onboarding as complete
- Admin users skip onboarding entirely and go directly to admin dashboard
- Consider implementing a "Remind me later" button in future iterations

---

## Next Steps After Testing

1. ✅ Verify all test scenarios pass
2. ✅ Check Firestore for correct data
3. ✅ Test on mobile devices (iOS/Android) with Expo Go
4. ✅ Deploy Cloud Functions: `cd api && firebase deploy --only functions`
5. ✅ Test in production environment
6. ✅ Consider A/B testing different onboarding flows

