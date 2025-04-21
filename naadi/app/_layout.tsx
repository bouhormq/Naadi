import { Stack, usePathname, useRouter, SplashScreen } from 'expo-router';
import { useEffect } from 'react'; // No need for useState(isReady) here
import { Platform } from 'react-native';
import 'dotenv/config'; // Optional: for local testing with a .env file

// Prevent the splash screen from auto-hiding before we determine the route.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This effect runs once on initial load to determine the correct starting route.
    console.log("Determining initial route...");

    let targetRoute: string | null = null; // Use a different name than initialRoute

    if (Platform.OS === 'web') {
      // --- Web Logic ---
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const currentPath = window.location.pathname; // Check the actual path

        // Only try to redirect if we are exactly at the web root '/'
        if (currentPath === '/') {
            if (hostname === 'localhost') {
                // Localhost testing: Use query param or default to main
                const searchParams = new URLSearchParams(window.location.search);
                if (searchParams.get('mode') === 'partner') {
                    console.log("Web localhost: Redirecting to /partners");
                    targetRoute = '/partners';
                } else {
                    console.log("Web localhost: Redirecting to /(main)");
                    targetRoute = '/(main)';
                }
            } else if (hostname === 'naadi.ma') {
                // Production: naadi.ma root goes to main
                console.log("Web naadi.ma: Redirecting to /(main)");
                targetRoute = '/(main)';
            } else {
                // Default unknown hostnames at root '/' to main
                console.log(`Web other hostname (${hostname}): Redirecting to /(main)`);
                targetRoute = '/(main)';
            }
        } else {
             // If not at the root '/', let Expo Router handle the path directly.
             // e.g., if the user directly visits naadi.ma/partners, it should load the partner route.
             console.log(`Web: Pathname is ${currentPath}, letting Expo Router handle it.`);
             // targetRoute remains null, no redirection needed
        }
      }
    } else {
      // --- Native Logic ---
      // Use an environment variable set during the build process
      const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT;
      console.log(`Native: App Variant detected: ${appVariant}`);

      if (appVariant === 'partners') {
        targetRoute = '/partners';
      } else {
        // Default to 'main' if the variant is 'main' or not set
        targetRoute = '/(main)';
      }
    }

    // Perform the redirection if a target route was determined AND we are currently at the root '/'
    // The check `pathname === '/'` is crucial here to prevent infinite redirects
    // if the targetRoute happens to be '/' itself or a path that resolves back to '/'.
    // However, based on your logic, targetRoute will always be '/(main)' or '/partners',
    // so the check ensures we only replace the initial root.
    if (targetRoute && pathname === '/') {
        console.log(`Redirecting from '/' to ${targetRoute}`);
        router.replace(targetRoute);
    } else {
         // If targetRoute is null or we aren't at the root '/', just hide splash screen.
         // Expo Router will handle rendering based on the current path.
        console.log(`No redirection needed or not at root '/' (current: ${pathname})`);
    }

    // Hide the splash screen once the initial route logic is complete
    // (whether a redirect happened or not).
    SplashScreen.hideAsync();

  }, [pathname]); // Added pathname to dependency array - though for initial load [], might be sufficient, but including pathname makes the intention clearer if logic were more complex later. If this causes issues, revert to []. The core fix is always rendering Stack.

  // --- Always render the Stack navigator ---
  // This ensures Expo Router's core navigation structure is present from the start.
  return (
    // Stack navigator containing both main and partner route groups
    <Stack screenOptions={{ headerShown: false }}>
      {/*
         Render your route groups. Expo Router will automatically render the
         correct initial screen based on the URL/initial route path,
         or the path you redirect to via router.replace().
      */}
      <Stack.Screen name="(main)" />
      <Stack.Screen name="partners" />
      {/* Add other top-level modal screens etc. here if needed */}
    </Stack>
  );
}