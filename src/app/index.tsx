import { Redirect, router } from 'expo-router';
import { Text, View, ActivityIndicator, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { useSession } from '../ctx';

// Root level redirect based on app variant
export default function Index() {
  const { session, isLoading: isSessionLoading } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState("");
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  // Immediately determine the right initial route based on app variant and auth status
  useEffect(() => {
    if (isSessionLoading) return; // Wait for session to finish loading

    try {
      const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';
      console.log(`[Root Index] Detected app variant: ${appVariant}, isLoggedIn: ${!!session}, isMobile: ${isMobile}`);
      
      // For web or non-mobile platforms, just navigate to the main route for the variant
      if (!isMobile) {
        console.log('[Root Index] Non-mobile platform - redirecting directly to main route');
        setInitialRoute(appVariant === 'partner' ? 'partners' : '(main)');
        setIsLoading(false);
        return;
      }
      
      // Mobile platform: Set initial route based on app variant and auth status
      if (appVariant === 'partner') {
        if (session) {
          const userRole = session.role;
          if (userRole === 'partner') {
            console.log('[Root Index] Partner variant, logged in as partner - redirecting to protected area');
            setInitialRoute('partners/(protected)');
          } else if (userRole === 'admin') {
            console.log('[Root Index] Partner variant, logged in as admin - redirecting to admin area');
            setInitialRoute('admin/(protected)');
          } else {
            console.log('[Root Index] Partner variant, wrong role - redirecting to login');
            setInitialRoute('partners/login');
          }
        } else {
          console.log('[Root Index] Partner variant, not logged in - redirecting to login');
          setInitialRoute('partners/login');
        }
      } else {
        // Main app variant
        if (session) {
          const userRole = session.role;
          if (userRole === 'user') {
            console.log('[Root Index] Main variant, logged in as user - redirecting to protected area');
            setInitialRoute('(main)/(protected)');
          } else if (userRole === 'partner') {
            console.log('[Root Index] Main variant, logged in as partner - redirecting to partner area');
            setInitialRoute('partners/(protected)');
          } else if (userRole === 'admin') {
            console.log('[Root Index] Main variant, logged in as admin - redirecting to admin area');
            setInitialRoute('admin/(protected)');
          }
        } else {
          console.log('[Root Index] Main variant, not logged in - redirecting to login');
          setInitialRoute('(main)/login');
        }
      }
    } catch (error) {
      console.error('[Root Index] Error determining route:', error);
      // Default to appropriate login page if there's an error
      const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';
      setInitialRoute(appVariant === 'partner' ? 'partners/login' : '(main)/login');
    } finally {
      setIsLoading(false);
    }
  }, [session, isSessionLoading, isMobile]);

  // Use the router directly on mount to avoid animation
  useEffect(() => {
    if (!isLoading && !isSessionLoading && initialRoute) {
      // Using router.replace instead of Redirect to have more control
      router.replace(`/${initialRoute}`);
    }
  }, [isLoading, isSessionLoading, initialRoute]);

  // Show loading until route is determined
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Initializing...</Text>
    </View>
  );
} 