// app/_layout.tsx
import '../config/firebase';
import { Stack, useRouter, useSegments, SplashScreen } from 'expo-router';
import { useEffect, useCallback } from 'react';
import { Platform, View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { SessionProvider, useSession } from '../ctx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// Prevent the splash screen from auto-hiding immediately
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const path = segments.join('/');
    // More robust check for auth routes
    const isAuthRoute = path === 'login' || path === '(main)/login' || path === 'partners/login'; // Add others like signup
    
    const isInMainProtected = path.startsWith('(main)/(protected)');
    const isInPartnersProtected = path.startsWith('partners/(protected)');
    const isInAdminProtected = path.startsWith('admin/(protected)');
    const isAdminRoot = path === 'admin'; // Check specifically for admin root
    const isInAnyProtected = isInMainProtected || isInPartnersProtected || isInAdminProtected;

    // A route is considered protected if it's in a (protected) folder OR it's the admin root itself
    const shouldProtectRoute = isInAnyProtected || isAdminRoot;

    const currentTopLevelGroup = segments[0];

    console.log(`RootLayoutNav Effect: isLoading=${isLoading}, sessionExists=${!!session}, path=/${path}, isAuthRoute=${isAuthRoute}, shouldProtectRoute=${shouldProtectRoute}`);

    if (isLoading) {
        console.log("RootLayoutNav Effect: Still loading session...");
        return; // Wait until session is loaded
    }

    if (!session) {
      // --- LOGGED OUT --- 
      // Redirect ONLY if trying to access a route marked for protection.
      if (shouldProtectRoute) {
          console.log(`RootLayoutNav Effect: Logged out, accessing protected route (/${path}). Redirecting.`);
          // Specific redirect for admin root attempt
          if (isAdminRoot) { 
              console.log("...redirecting /admin to /partners");
              router.replace('/partners');
          } 
          // Redirect for attempts to access actual (protected) folders
          else if (isInAnyProtected) { 
              if (currentTopLevelGroup === 'partners' || currentTopLevelGroup === 'admin') {
                 console.log("...redirecting protected partners/admin to /partners/login");
                 router.replace('/partners/login'); 
              } else { // Assumes (main)/(protected)
                 console.log("...redirecting protected main to /login");
                 router.replace('/login');
              }
          }
      } else {
         // If not accessing a protected route, allow access.
         console.log(`RootLayoutNav Effect: Logged out, accessing public or auth route (/${path}). Allowed.`);
      }
    } else {
      // --- LOGGED IN --- 
      const userRole = session.role;
      let userHomeBase = '/'; 

      if (userRole === 'partner') {
          userHomeBase = '/partners/(protected)'; 
      } else if (userRole === 'admin') {
          userHomeBase = '/admin/(protected)'; 
      } else {
           userHomeBase = '/(main)/(protected)'; 
      }
      const userHomeBasePath = userHomeBase.replace(/^\//, ''); 

      // Redirect away from auth routes
      if (isAuthRoute) {
          console.log(`RootLayoutNav Effect: Logged in (${userRole}), accessing auth route (/${path}). Redirecting to ${userHomeBase}.`);
          router.replace(userHomeBase);
          return; 
      }

      // Redirect if accessing public routes or wrong protected area
      let shouldRedirect = false;
      if (userRole === 'user') {
           if (currentTopLevelGroup === 'partners' || currentTopLevelGroup === 'admin' || !isInMainProtected) {
              // User should not be in partners/admin or any public -(main) page
               shouldRedirect = true; 
           }
      } else if (userRole === 'partner') {
          if (!isInPartnersProtected) { // Partner should not be outside partners/(protected)
               shouldRedirect = true;
          }
      } else if (userRole === 'admin') {
           if (!isInAdminProtected) { // Admin should not be outside admin/(protected)
               shouldRedirect = true;
           }
      }

      // Execute redirect if needed
      if (shouldRedirect) {
           console.log(`RootLayoutNav Effect: Logged in (${userRole}), accessing disallowed route (/${path}). Redirecting to ${userHomeBase}.`);
           router.replace(userHomeBase);
      } else {
          console.log(`RootLayoutNav Effect: Logged in (${userRole}), accessing allowed route (/${path}).`);
      }
    }
  }, [isLoading, session, segments, router]);

  // Display loading indicator or null while checking session and redirecting
  if (isLoading) {
     return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Loading Session...</Text></View>;
  }

  // Render the main stack navigator
  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(main)" />
        <Stack.Screen name="partners" />
        <Stack.Screen name="admin" />
        {/* Add (auth) group if you create one for login/signup */}
        {/* <Stack.Screen name="(auth)" /> */}
      </Stack>
  );
}

export default function RootLayout() {
  // --- Font Loading (Moved from original RootLayoutNav) ---
  const [fontsLoaded, fontError] = useFonts({
    'SFProText-Regular': require('../assets/fonts/SF-Pro-Text-Regular.otf'),
    'SFProText-Medium': require('../assets/fonts/SF-Pro-Text-Medium.otf'),
    'SFProText-Semibold': require('../assets/fonts/SF-Pro-Text-Semibold.otf'),
    'SFProText-Bold': require('../assets/fonts/SF-Pro-Text-Bold.otf'),
    'SFProDisplay-Regular': require('../assets/fonts/SF-Pro-Display-Regular.otf'),
    'SFProDisplay-Medium': require('../assets/fonts/SF-Pro-Display-Medium.otf'),
    'SFProDisplay-Semibold': require('../assets/fonts/SF-Pro-Display-Semibold.otf'),
    'SFProDisplay-Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
    'SFProRounded-Regular': require('../assets/fonts/SF-Pro-Rounded-Regular.otf'),
    'SFProRounded-Medium': require('../assets/fonts/SF-Pro-Rounded-Medium.otf'),
    'SFProRounded-Semibold': require('../assets/fonts/SF-Pro-Rounded-Semibold.otf'),
    'SFProRounded-Bold': require('../assets/fonts/SF-Pro-Rounded-Bold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Wait for fonts to load before rendering the app
  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  // --- Render the App --- Wrap with I18nextProvider
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
      <RootLayoutNav />
      </I18nextProvider>
    </SessionProvider>
  );
}