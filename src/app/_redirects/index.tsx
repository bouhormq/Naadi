import { Redirect, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useSession } from '../../ctx';
import { View, ActivityIndicator, Text, Platform } from 'react-native';

// This component intercepts and redirects requests based on app variant and auth status
export default function RedirectHandler() {
  const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';
  const isPartner = appVariant === 'partner';
  const { session, isLoading } = useSession();
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  // Handle redirection without animations
  useEffect(() => {
    console.log(`[RedirectHandler] Intercepted navigation, app variant: ${appVariant}, isLoggedIn: ${!!session}, isMobile: ${isMobile}`);
    
    // For non-mobile platforms, just redirect to the main variant route
    if (!isMobile) {
      console.log('[RedirectHandler] Non-mobile platform - redirecting directly to main variant route');
      router.replace(isPartner ? '/partners' : '/(main)');
      return;
    }
    
    // Wait until session is loaded
    if (isLoading) {
      console.log('[RedirectHandler] Still loading session...');
      return;
    }
    
    // For partner variant (mobile only)
    if (isPartner) {
      if (session) {
        const userRole = session.role;
        if (userRole === 'partner') {
          console.log('[RedirectHandler] Partner variant, logged in as partner - redirecting to protected area');
          router.replace('/partners/(protected)');
        } else if (userRole === 'admin') {
          console.log('[RedirectHandler] Partner variant, logged in as admin - redirecting to admin area');
          router.replace('/admin/(protected)');
        } else {
          console.log('[RedirectHandler] Partner variant, wrong role - redirecting to login');
          router.replace('/partners/login');
        }
      } else {
        console.log('[RedirectHandler] Partner variant, not logged in - redirecting to login');
        router.replace('/partners/login');
      }
      return;
    }
    
    // For main variant (mobile only)
    if (session) {
      const userRole = session.role;
      if (userRole === 'user') {
        console.log('[RedirectHandler] Main variant, logged in as user - redirecting to protected area');
        router.replace('/(main)/(protected)');
      } else if (userRole === 'partner') {
        console.log('[RedirectHandler] Main variant, logged in as partner - redirecting to partner area');
        router.replace('/partners/(protected)');
      } else if (userRole === 'admin') {
        console.log('[RedirectHandler] Main variant, logged in as admin - redirecting to admin area');
        router.replace('/admin/(protected)');
      }
    } else {
      console.log('[RedirectHandler] Main variant, not logged in - redirecting to login');
      router.replace('/(main)/login');
    }
  }, [session, isLoading, isPartner, appVariant, isMobile]);

  // Show loading while redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Redirecting...</Text>
    </View>
  );
} 