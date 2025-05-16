// app/_layout.tsx
import '../config/firebase';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect} from 'react';
import { Platform, View, Text, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { SessionProvider, useSession } from '../ctx';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import * as SplashScreen from 'expo-splash-screen';

function RootLayoutNav() {
  const { session, isLoading } = useSession();
  const segments = useSegments();
  const router = useRouter();
  
  // Get app variant from environment variable
  const appVariant = process.env.EXPO_PUBLIC_APP_VARIANT || 'main';
  const isPartner = appVariant === 'partner';
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  console.log(`[RootLayoutNav] App variant: ${appVariant}, isPartner: ${isPartner}, isMobile: ${isMobile}`);

  // Determine initial route based on auth state and variant
  const getInitialRoute = () => {
    // Only set initial route on mobile
    if (!isMobile) return undefined;

    if (!session) {
      const route = isPartner ? 'partners' : '(main)';
      console.log(`[getInitialRoute] Not logged in, returning: ${route}`);
      return route;
    }
    
    const userRole = session.role;
    let route;
    if (userRole === 'partner') {
      route = 'partners';
    } else if (userRole === 'admin') {
      route = 'admin';
    } else {
      route = '(main)';
    }
    console.log(`[getInitialRoute] Logged in as ${userRole}, returning: ${route}`);
    return route;
  };

  useEffect(() => {
    // Only apply mobile-specific routing on mobile platforms
    if (!isMobile) return;

    const path = segments.join('/');
    console.log(`[RootLayoutNav] Current path: ${path}, isPartner: ${isPartner}`);
    
    const isAuthRoute = path === 'login' || path === '(main)/login' || path === 'partners/login';
    const isInMainProtected = path.startsWith('(main)/(protected)');
    const isInPartnersProtected = path.startsWith('partners/(protected)');
    const isInAdminProtected = path.startsWith('admin/(protected)');
    const isAdminRoot = path === 'admin';
    const isInAnyProtected = isInMainProtected || isInPartnersProtected || isInAdminProtected;
    const shouldProtectRoute = isInAnyProtected || isAdminRoot;
    const currentTopLevelGroup = segments[0];

    if (isLoading) {
      console.log('[RootLayoutNav] Still loading session...');
      return;
    }

    // Handle route protection and redirects
    if (!session) {
      // Not logged in - redirect to appropriate login page
      if (isPartner) {
        // For partner variant, ensure we're in the partners section
        if (!path.startsWith('partners')) {
          console.log("[RootLayoutNav] Partner variant - redirecting to partners/login (not in partners section)");
          router.replace('/partners/login');
        } else if (path !== 'partners/login') {
          console.log("[RootLayoutNav] Partner variant - redirecting to partners/login (wrong path)");
                 router.replace('/partners/login'); 
          }
      } else {
        // For main variant, ensure we're in the main section
        if (!path.startsWith('(main)')) {
          console.log("[RootLayoutNav] Main variant - redirecting to (main)/login (not in main section)");
          router.replace('/(main)/login');
        } else if (path !== '(main)/login') {
          console.log("[RootLayoutNav] Main variant - redirecting to (main)/login (wrong path)");
          router.replace('/(main)/login');
        }
      }
    } else {
      const userRole = session.role;
      let userHomeBase = '/'; 

      if (userRole === 'partner') {
          userHomeBase = '/partners/(protected)'; 
      } else if (userRole === 'admin') {
          userHomeBase = '/admin/(protected)'; 
      } else {
           userHomeBase = '/(main)/(protected)'; 
      }

      if (isAuthRoute) {
        console.log(`[RootLayoutNav] Logged in as ${userRole}, redirecting from auth route to ${userHomeBase}`);
          router.replace(userHomeBase);
          return; 
      }

      let shouldRedirect = false;
      if (userRole === 'user') {
           if (currentTopLevelGroup === 'partners' || currentTopLevelGroup === 'admin' || !isInMainProtected) {
               shouldRedirect = true; 
           }
      } else if (userRole === 'partner') {
        if (!isInPartnersProtected) {
               shouldRedirect = true;
          }
      } else if (userRole === 'admin') {
        if (!isInAdminProtected) {
               shouldRedirect = true;
           }
      }

      if (shouldRedirect) {
        console.log(`[RootLayoutNav] Logged in as ${userRole}, redirecting to ${userHomeBase}`);
           router.replace(userHomeBase);
      }
    }
  }, [isLoading, session, segments, router, appVariant, isMobile]);

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack 
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
        <Stack.Screen name="(main)" />
        <Stack.Screen name="partners" />
        <Stack.Screen name="admin" />
      </Stack>
  );
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
        await SplashScreen.preventAutoHideAsync();
        
    if (fontsLoaded || fontError) {
          await SplashScreen.hideAsync();
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