// app/_layout.tsx
import '../config/firebase';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { SessionProvider, useSession } from '../ctx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import * as SplashScreen from 'expo-splash-screen';
import type { StackAnimationTypes } from '@react-navigation/stack';

// Keep the splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

// Partner variant layout component
function PartnerLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  console.log(`[PartnerLayoutNav] App variant: partner, isPartner: true, isMobile: ${isMobile}, isLoggedIn: ${!!session}`);

  // Hide splash screen when we're ready to show content
  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Handle route protection - only on mobile platforms
  useEffect(() => {
    // Skip if not mobile or app is not ready yet
    if (!isMobile || !isReady || isLoading) return;
    
    const path = segments.join('/');
    console.log(`[PartnerLayoutNav] Checking route protection (mobile): ${path}, isLoggedIn: ${!!session}`);
    
    const isAuthRoute = path === 'partners/login';
    const isProtectedRoute = path.startsWith('partners/(protected)') || path.startsWith('admin/(protected)');
    
    // Not logged in - redirect to login
    if (!session) {
      if (isProtectedRoute) {
        console.log('[PartnerLayoutNav] Unauthorized access to protected route, redirecting to login');
        router.replace('/partners/login');
      } else if (!isAuthRoute && path.startsWith('partners')) {
        console.log('[PartnerLayoutNav] Unauthenticated access to partner route, redirecting to login');
        router.replace('/partners/login');
      }
      return;
    }
    
    // Logged in - ensure proper access based on role
    const userRole = session.role;
    
    // Already on login page but logged in - redirect to appropriate area
    if (isAuthRoute) {
      if (userRole === 'partner') {
        console.log('[PartnerLayoutNav] Already logged in, redirecting from login to partner area');
        router.replace('/partners/(protected)');
      } else if (userRole === 'admin') {
        console.log('[PartnerLayoutNav] Admin logged in, redirecting from login to admin area');
        router.replace('/admin/(protected)');
      } else {
        console.log('[PartnerLayoutNav] User with invalid role, staying on login');
        // Invalid role for partner app - let them stay on login
      }
      return;
    }
    
    // Role-based access control for protected routes
    if (isProtectedRoute) {
      if (userRole === 'partner' && !path.startsWith('partners/(protected)')) {
        console.log('[PartnerLayoutNav] Partner accessing wrong area, redirecting to partner area');
        router.replace('/partners/(protected)');
      } else if (userRole === 'admin' && !path.startsWith('admin/(protected)')) {
        console.log('[PartnerLayoutNav] Admin accessing wrong area, redirecting to admin area');
        router.replace('/admin/(protected)');
      } else if (userRole !== 'partner' && userRole !== 'admin') {
        console.log('[PartnerLayoutNav] User with invalid role accessing protected area, redirecting to login');
        router.replace('/partners/login');
      }
    }
  }, [isReady, isLoading, session, segments, router, isMobile]);

  // Show loading indicator while preparing
  if (isLoading || !isReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Configure screen options based on platform
  const screenOptions = {
    headerShown: false, 
    animation: 'none' as StackAnimationTypes,
    contentStyle: isMobile ? { 
      paddingTop: 0 
    } : undefined
  };
  
  // Render partner-specific layout with modified animation options
  return (
    <Stack 
      screenOptions={screenOptions}
      initialRouteName="partners"
    >
      <Stack.Screen 
        name="partners" 
        options={{
          headerShown: false,
          animation: 'none' as StackAnimationTypes,
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }}
      />
      <Stack.Screen 
        name="admin" 
        options={{
          headerShown: false,
          animation: 'none' as StackAnimationTypes,
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }} 
      />
      <Stack.Screen 
        name="_redirects/index" 
        options={{
          headerShown: false,
          animation: 'none' as StackAnimationTypes,
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }} 
      />
    </Stack>
  );
}

// Main variant layout component
function MainLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  console.log(`[MainLayoutNav] App variant: main, isPartner: false, isMobile: ${isMobile}, isLoggedIn: ${!!session}`);

  // Hide splash screen when we're ready to show content
  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  // Handle route protection - only on mobile platforms
  useEffect(() => {
    // Skip if not mobile or app is not ready yet
    if (!isMobile || !isReady || isLoading) return;
    
    const path = segments.join('/');
    console.log(`[MainLayoutNav] Checking route protection (mobile): ${path}, isLoggedIn: ${!!session}`);
    
    // Public routes that can be accessed without being logged in
    const publicRoutes = ['(main)/onboarding', '(main)/login', '(main)/signup'];
    const isPublicRoute = publicRoutes.some(r => path.startsWith(r));

    // Protected routes that require a user to be logged in
    const isProtectedRoute = path.startsWith('(main)/(protected)');

    if (!session) {
      // If the user is not logged in and trying to access a protected route,
      // redirect them to the onboarding screen.
      if (isProtectedRoute) {
        console.log('[MainLayoutNav] Unauthenticated user on protected route, redirecting to onboarding.');
        router.replace('/(main)/onboarding');
      }
      // If it's a public route, do nothing and let the user stay.
    } else {
      // If the user is logged in and on a public route (like login or onboarding),
      // redirect them to the main protected area.
      if (isPublicRoute) {
        console.log('[MainLayoutNav] Authenticated user on public route, redirecting to home.');
        router.replace('/(main)/(protected)');
      }
    }
  }, [isReady, isLoading, session, segments, router, isMobile]);

  // Show loading indicator while preparing
  if (isLoading || !isReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Configure screen options based on platform
  const screenOptions = {
    headerShown: false,
    animation: 'none' as StackAnimationTypes,
    contentStyle: isMobile ? { 
      paddingTop: 0
    } : undefined
  };
  
  // Render main-specific layout with modified animation options
  return (
    <Stack 
      screenOptions={screenOptions}
      initialRouteName="(main)"
    >
      <Stack.Screen 
        name="(main)" 
        options={{
          headerShown: false,
          animation: 'none' as StackAnimationTypes,
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }}
      />
      <Stack.Screen 
        name="partners" 
        options={{
          headerShown: false,
          animation: 'none' as StackAnimationTypes,
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }} 
      />
      <Stack.Screen 
        name="admin" 
        options={{
          headerShown: false,
          animation: 'none' as StackAnimationTypes,
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }} 
      />
      <Stack.Screen 
        name="_redirects/index" 
        options={{
          headerShown: false,
          animation: 'none' as StackAnimationTypes,
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }} 
      />
    </Stack>
  );
}

// Root layout that selects the appropriate variant layout
function RootLayoutNav() {
  // Get app variant from environment variable
  const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';
  const isPartner = appVariant === 'partner';
  
  console.log(`[RootLayoutNav] Rendering ${isPartner ? 'Partner' : 'Main'} layout for variant: ${appVariant}`);
  
  // Render the appropriate layout component based on app variant
  // This avoids any navigation before layout is mounted
  return isPartner ? <PartnerLayoutNav /> : <MainLayoutNav />;
}

export default function RootLayout() {
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
    async function prepare() {
      try {
        if (fontsLoaded || fontError) {
          // SplashScreen will be hidden by the navigation component
        }
      } catch (e) {
        console.warn('Error preparing app:', e);
        try {
          await SplashScreen.hideAsync();
        } catch (hideError) {
          console.warn('Error hiding splash screen:', hideError);
        }
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (fontError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
        <Text>Error loading fonts. Please restart the app.</Text>
      </View>
    );
  }
  
  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <RootLayoutNav />
      </I18nextProvider>
    </SessionProvider>
  );
}