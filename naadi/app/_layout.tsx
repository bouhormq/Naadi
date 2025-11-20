// app/_layout.tsx
import '../config/firebase/firebase';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { SessionProvider, useSession } from '@naadi/hooks/ctx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../utils/languageDetector/i18n';
import * as SplashScreen from 'expo-splash-screen';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'; // Added this import

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

  // Handle route protection - on all platforms
  useEffect(() => {
    // Skip if app is not ready yet
    if (!isReady || isLoading) return;

    const path = segments.join('/');
    console.log(`[PartnerLayoutNav] Route check - path: ${path}, session:`, {
      isLoggedIn: !!session,
      role: session?.role,
      onboardingCompleted: session?.onboardingCompleted
    });

    // Define public routes that don't require login
    const isPublicRoute = path === 'partners' ||
      path === 'partners/login' ||
      path === 'partners/signup' ||
      path === 'partners/how-it-works' ||
      path === 'partners/faq' ||
      path === 'partners/contact' ||
      path === 'partners/set-password';

    const isOnboardingRoute = path === 'partners/onboarding-flow';
    const isProtectedRoute = path.startsWith('partners/(protected)') || path.startsWith('admin/(protected)');

    console.log(`[PartnerLayoutNav] Route flags - isPublic: ${isPublicRoute}, isOnboarding: ${isOnboardingRoute}, isProtected: ${isProtectedRoute}`);

    // Not logged in - only redirect if accessing protected routes
    if (!session) {
      if (isProtectedRoute) {
        console.log('[PartnerLayoutNav] Unauthorized access to protected route, redirecting to login');
        router.replace('/partners/login');
      }
      // Allow access to public pages (no redirect needed)
      return;
    }

    // Logged in - check onboarding status FIRST before anything else
    if (!session.onboardingCompleted && !isOnboardingRoute) {
      // Redirect to onboarding based on role
      if (session.role === 'partner') {
        console.log('[PartnerLayoutNav] Partner needs to complete onboarding, redirecting...');
        router.replace('/partners/onboarding-flow');
        return;
      } else if (session.role === 'admin') {
        // Admins skip onboarding, redirect to admin area
        console.log('[PartnerLayoutNav] Admin logged in, skipping onboarding');
        router.replace('/admin/(protected)');
        return;
      }
    } else if (session.onboardingCompleted && isOnboardingRoute) {
      // User has completed onboarding but is on the onboarding route - redirect to protected area
      if (session.role === 'partner') {
        console.log('[PartnerLayoutNav] Partner completed onboarding, redirecting from onboarding flow');
        router.replace('/partners/(protected)');
        return;
      } else if (session.role === 'admin') {
        console.log('[PartnerLayoutNav] Admin on onboarding flow, redirecting to admin area');
        router.replace('/admin/(protected)');
        return;
      }
    }

    // Logged in and onboarding complete (or admin) - ensure proper access based on role
    const userRole = session.role;

    // Already on a public page but logged in - redirect to appropriate protected area
    if (isPublicRoute && session.onboardingCompleted) {
      if (userRole === 'partner') {
        console.log('[PartnerLayoutNav] Authenticated partner on public route, redirecting to partner area');
        router.replace('/partners/(protected)');
      } else if (userRole === 'admin') {
        console.log('[PartnerLayoutNav] Admin on public route, redirecting to admin area');
        router.replace('/admin/(protected)');
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
  }, [isReady, isLoading, session, segments, router]);

  // Show loading indicator while preparing
  if (isLoading || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Configure screen options based on platform
  const screenOptions: NativeStackNavigationOptions = { // Explicitly typed screenOptions
    headerShown: false,
    animation: 'none',
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
          animation: 'none',
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }}
      />
      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
          animation: 'none',
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }}
      />
      <Stack.Screen
        name="_redirects/index"
        options={{
          headerShown: false,
          animation: 'none',
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

  // Handle route protection - on all platforms
  useEffect(() => {
    // Skip if app is not ready yet
    if (!isReady || isLoading) return;

    const path = segments.join('/');
    console.log(`[MainLayoutNav] Checking route protection: ${path}, isLoggedIn: ${!!session}`);

    // Public routes that can be accessed without being logged in
    const publicRoutes = ['(main)/onboarding', '(main)/login', '(main)/signup'];
    const isPublicRoute = publicRoutes.some(r => path.startsWith(r));

    // Protected routes that require a user to be logged in
    const isProtectedRoute = path.startsWith('(main)/(protected)');

    // Onboarding route for logged in users
    const isOnboardingRoute = path === '(main)/onboarding-flow';

    if (!session) {
      // If the user is not logged in and trying to access a protected route,
      // redirect them to the onboarding screen.
      if (isProtectedRoute) {
        console.log('[MainLayoutNav] Unauthenticated user on protected route, redirecting to onboarding.');
        router.replace('/(main)/onboarding');
      }
      // If it's a public route, do nothing and let the user stay.
    } else {
      // If the user is logged in, check onboarding status
      if (!session.onboardingCompleted && !isOnboardingRoute) {
        // User hasn't completed onboarding, redirect to onboarding flow
        console.log('[MainLayoutNav] User not onboarded, redirecting to onboarding flow.');
        router.replace('/(main)/onboarding-flow');
      } else if (session.onboardingCompleted && isOnboardingRoute) {
        // User has completed onboarding but is on the onboarding route
        console.log('[MainLayoutNav] User completed onboarding, redirecting from onboarding flow.');
        router.replace('/(main)/(protected)');
      } else if (session.onboardingCompleted && isPublicRoute) {
        // If the user is logged in, onboarded, and on a public route (like login or onboarding),
        // redirect them to the main protected area.
        console.log('[MainLayoutNav] Authenticated user on public route, redirecting to home.');
        router.replace('/(main)/(protected)');
      }
    }
  }, [isReady, isLoading, session, segments, router]);

  // Show loading indicator while preparing
  if (isLoading || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Configure screen options based on platform
  const screenOptions: NativeStackNavigationOptions = { // Explicitly typed screenOptions
    headerShown: false,
    animation: 'none',
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
          animation: 'none',
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }}
      />
      <Stack.Screen
        name="partners"
        options={{
          headerShown: false,
          animation: 'none',
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }}
      />
      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
          animation: 'none',
          contentStyle: isMobile ? { paddingTop: 0 } : undefined
        }}
      />
      <Stack.Screen
        name="_redirects/index"
        options={{
          headerShown: false,
          animation: 'none',
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
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
