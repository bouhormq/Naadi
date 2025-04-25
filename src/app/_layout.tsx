// app/_layout.js
import '../config/firebase';
import { Stack, usePathname, useRouter, SplashScreen } from 'expo-router';
import { useEffect, useCallback } from 'react';
import { Platform, View } from 'react-native';
import { useFonts } from 'expo-font';
import { SessionProvider } from '../ctx';

// Prevent the splash screen from auto-hiding immediately
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // --- Font Loading ---
  const [fontsLoaded, fontError] = useFonts({
    // Map simple names to the actual file paths.
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
    'AppleColorEmoji': require('../assets/fonts/AppleColorEmoji.ttf'),
  });

  // Log font loading status for debugging
  useEffect(() => {
    if (fontsLoaded) {
      console.log("All fonts loaded successfully!");
    } else if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontsLoaded, fontError]);

  // --- Splash Screen Hiding and Initial Route Logic ---
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Fonts are loaded, now signal the root view is ready to potentially hide splash screen
    }
  }, [fontsLoaded, fontError]);

  // Define the callback for the root view's layout event
  const onLayoutRootView = useCallback(async () => {
    // Only hide the splash screen if fonts are loaded OR if there was a font loading error.
    if (fontsLoaded || fontError) {
      console.log("Root view layout complete. Hiding splash screen.");
      await SplashScreen.hideAsync(); // Hide the splash screen
    }
  }, [fontsLoaded, fontError]); // Depend on font status

  // Your existing initial route determination logic
  useEffect(() => {
    console.log("Determining initial route...");
    let targetRoute: string | null = null;

    if (Platform.OS !== 'web'){ // Note: Your code had Platform.OS === 'web', changed to !== 'web' for native logic
      const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT;
      console.log(`Native: App Variant detected: ${appVariant}`);

      if (appVariant === 'partners') {
        targetRoute = '/partners';
      } else {
        targetRoute = '/(main)';
      }
    }

     if (targetRoute && pathname === '/') {
        console.log(`Redirecting from '/' to ${targetRoute}`);
        router.replace(targetRoute);
    } else {
        console.log(`No redirection needed or not at root '/' (current: ${pathname})`);
    }

  }, [pathname, router]);


  // --- Conditional Rendering based on Font Loading State ---
  if (!fontsLoaded && !fontError) {
    console.log("Fonts not loaded, returning null to keep splash screen visible.");
    return null;
  }

  // --- Handle Font Loading Errors ---
  if (fontError) {
    console.error("Displaying font loading error UI.");
  }

  // --- Render the main app content (Stack Navigator) WHEN FONTS ARE READY ---
  console.log("Fonts loaded, rendering SessionProvider and Stack navigator.");
  return (
    // Wrap the main content with SessionProvider
    <SessionProvider>
      {/* Wrap your main navigation structure with a View that has the onLayout callback. */}
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(main)" />
          <Stack.Screen name="partners" />
          {/* Add other top-level modal screens etc. here if needed */}
          {/* Ensure the 'admin' stack group is defined here or handled by Expo Router conventions */}
          {/* If 'admin' is a top-level group like '(main)' and 'partners', it might need an entry here */}
          {/* <Stack.Screen name="admin" /> */}
        </Stack>
      </View>
    </SessionProvider>
  );
}