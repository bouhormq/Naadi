# Step-by-Step Testing Instructions

## ✅ Current App Status
- App is running: **http://localhost:8082**
- Variant: **main** (User app)
- Metro bundler: Ready

---

## STEP 1: Create a New User Account

### 1.1 Open the App
- Open browser to: **http://localhost:8082**
- You should see the Naadi user app interface

### 1.2 Navigate to Signup
- Click on "Sign Up" or go to onboarding screen
- Look for the signup form

### 1.3 Fill in Signup Form
```
Email:           testuser_nov15@example.com
Password:        TestPassword123!
First Name:      Test
Last Name:       User
Phone Country:   Morocco (or any country)
Phone Number:    612345678
Marketing:       ✓ Agree to marketing
```

### 1.4 Submit Signup
- Click "Sign Up" button
- Wait for account creation (should take 2-3 seconds)

---

## STEP 2: Verify Onboarding Screen Appears

### 2.1 Expected Redirect
- After signup, you should be redirected to onboarding screen
- URL should be: `http://localhost:8082/(main)/onboarding-flow`

### 2.2 Verify Content
Look for these elements on the screen:

- ✅ Title: "Welcome to Naadi"
- ✅ Subtitle: "Discover amazing wellness experiences"
- ✅ Step indicator badge: "Onboarding Screen" (in blue box)
- ✅ Main heading: "🎯 Get Started with Naadi"
- ✅ Description text about browsing and booking
- ✅ Feature list with emoji icons:
  - ✨ Discover local studios
  - 📅 Easy booking management
  - ⭐ Save your favorites
  - 💬 Leave reviews & feedback
- ✅ Progress dots (3 dots, first one highlighted)
- ✅ Two buttons:
  - "Continue to Dashboard" (blue button)
  - "Skip Tour" (outlined button)

### 2.3 If You Don't See It
- Check browser console (F12) for errors
- Try refreshing the page
- Check that `onboarding-flow.tsx` was created in the correct path

---

## STEP 3: Complete Onboarding

### 3.1 Click "Continue to Dashboard"
- Click the blue "Continue to Dashboard" button
- You should see a loading indicator briefly

### 3.2 Verify Redirect
- Page should redirect to user dashboard
- URL should be: `http://localhost:8082/(main)/(protected)` or similar
- You should see the user dashboard (home page with studios, etc.)

### 3.3 What Happened Behind the Scenes
- ✅ `completeOnboarding()` function was called
- ✅ Firestore database updated: `Users/{userId}.onboardingCompleted = true`
- ✅ Session was updated
- ✅ User was redirected to protected dashboard

---

## STEP 4: Verify Onboarding is Saved

### 4.1 Sign Out
- Find and click "Log Out" or "Sign Out" button
- You should be redirected to login screen

### 4.2 Log Back In
- Enter your credentials:
  - Email: `testuser_nov15@example.com`
  - Password: `TestPassword123!`
- Click "Log In"

### 4.3 Verify Direct to Dashboard
- ✅ You should go DIRECTLY to dashboard
- ✅ You should NOT see the onboarding screen again
- ✅ This confirms `onboardingCompleted: true` was saved

---

## STEP 5: Verify in Firebase (Optional but Recommended)

### 5.1 Open Firebase Console
- Go to: https://console.firebase.google.com
- Select project: **naadi-cf4c9**

### 5.2 Navigate to Firestore
- Click "Firestore Database" in left menu
- Look for "Start a collection" or existing collections

### 5.3 Find Your User
- Click on **Users** collection
- Find document with email: `testuser_nov15@example.com`
- Look at the fields, especially: `onboardingCompleted`

### 5.4 Verify Fields
You should see:
```
uid:                     AS8o5d86iXdUIB2rsME...
email:                   testuser_nov15@example.com
role:                    "user"
firstName:               "Test"
lastName:                "User"
phone:                   {code: "MA", dialCode: "+212", ...}
authMethod:              "email"
agreeToMarketing:        true
onboardingCompleted:     true  ✅ THIS SHOULD BE TRUE
createdAt:               2025-11-15 (timestamp)
lastLoginAt:             2025-11-15 (timestamp)
```

---

## STEP 6: Test Partner App (Optional)

### 6.1 Stop Current App
```bash
# In terminal where npm start is running
Press Ctrl+C
```

### 6.2 Update App Variant
Edit `/Users/salim/Desktop/Naadi/naadi/.env`
```
# Change from:
EXPO_PUBLIC_APP_VARIANT=main

# To:
EXPO_PUBLIC_APP_VARIANT=partner
```

### 6.3 Restart App
```bash
npm start
# App will be available at http://localhost:8082
```

### 6.4 Login as Partner
- Go to: http://localhost:8082
- Click on Partner login tab
- Enter credentials:
  - Email: `partneraccount@gmail.com` (or your approved partner)
  - Password: (your partner password)

### 6.5 Verify Partner Onboarding
- You should see onboarding screen with partner features
- Title should be: "Welcome to Naadi Partner"
- Step indicator: "Onboarding Screen"
- Features should show:
  - 📊 Business dashboard
  - 📅 Manage classes & schedules
  - 💰 Track revenue & bookings
  - 👥 Customer reviews & ratings
  - 📱 Mobile-first platform

### 6.6 Complete Partner Onboarding
- Click "Go to Dashboard"
- Should redirect to partner dashboard
- Should show business profile form

---

## TROUBLESHOOTING

### Problem: Can't find signup screen
**Solution:**
- Check that you're on the user app (EXPO_PUBLIC_APP_VARIANT=main)
- Look for the onboarding or navigation screen
- Check browser console for errors

### Problem: Onboarding screen not showing after signup
**Solution:**
- Clear browser cache (Ctrl+Shift+Del)
- Press `r` in terminal to reload app
- Check browser console (F12) for errors
- Verify user was created in Firebase Authentication

### Problem: Continue button doesn't work
**Solution:**
- Check browser console (F12) for error messages
- Ensure completeOnboarding() function was imported correctly
- Check Firebase Firestore permissions

### Problem: Redirects to onboarding every time I log in
**Solution:**
- Clear local storage: Open F12 console and run `localStorage.clear()`
- Sign out completely
- Close browser
- Open browser again and log in

### Problem: Can't find the user in Firebase
**Solution:**
- Go to Firebase Console
- Check "Authentication" tab to see if user was created
- Check "Firestore Database" → Users collection
- Make sure you're looking at the correct collection

---

## Summary of What You Just Did

✅ Created a new user account  
✅ Saw the onboarding screen display "Onboarding Screen"  
✅ Clicked button to complete onboarding  
✅ Confirmed redirect to dashboard  
✅ Logged out and back in to verify onboarding was saved  
✅ (Optional) Verified data in Firebase Firestore  
✅ (Optional) Tested partner app onboarding flow  

---

## Next Steps

1. **Share feedback** on onboarding experience
2. **Enhance onboarding** screens with:
   - More detailed steps
   - Tutorial content
   - User preferences
   - Permission requests
3. **Test on mobile** using Expo Go
4. **Deploy** to production when ready
5. **Monitor** user feedback and engagement

---

## Quick Command Reference

```bash
# View app logs
npm start

# Switch to partner variant
EXPO_PUBLIC_APP_VARIANT=partner npm start

# Switch back to user variant
EXPO_PUBLIC_APP_VARIANT=main npm start

# Clear watchman (if having file watch issues)
watchman watch-del '/Users/salim/Desktop/Naadi'
watchman watch-project '/Users/salim/Desktop/Naadi'

# Deploy cloud functions (when ready)
cd /Users/salim/Desktop/Naadi/api
firebase deploy --only functions
```

---

## File Locations

| File | Purpose |
|------|---------|
| `naadi/app/(main)/onboarding-flow.tsx` | User onboarding screen |
| `naadi/app/partners/onboarding-flow.tsx` | Partner onboarding screen |
| `types/index.ts` | User type with `onboardingCompleted` |
| `naadi/utils/api/auth.ts` | Auth functions including `completeOnboarding()` |
| `api/functions/src/index.ts` | Cloud function for partner creation |
| `naadi/app/_layout.tsx` | Routing logic with onboarding redirects |

---

## Success Indicators

You've successfully tested the onboarding if:

- ✅ New user created with `onboardingCompleted: false`
- ✅ After signup, redirected to onboarding screen
- ✅ Onboarding screen displays "Onboarding Screen" text
- ✅ Can click button to complete onboarding
- ✅ Redirected to dashboard after completing
- ✅ `onboardingCompleted` changed to `true` in Firestore
- ✅ Next login skips onboarding and goes to dashboard
- ✅ Partner app follows same flow

