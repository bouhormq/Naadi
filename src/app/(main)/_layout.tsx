import { Stack, Redirect, useRootNavigationState } from 'expo-router';
// Remove useEffect import if no longer needed for other purposes
// import { useEffect } from 'react'; 
import { Text, Platform } from 'react-native'; // Import Text for loading indicator and Platform for OS detection
import Header from './(components)/Header';
// Remove useSession and Redirect imports if no longer needed here
// import { useSession } from '../../ctx'; 

const MainLayout = () => {
  // No longer need session checks here, handled by root layout
  // const { session, isLoading } = useSession();
  // const navigationState = useRootNavigationState();

  // Detect if on mobile platform
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  // Render layout
  console.log(`(MainLayout): Rendering stack, isMobile: ${isMobile}`);
  
  // Configure screen options based on platform
  const screenOptions = {
    // Only show header on web/desktop, hide on mobile
    headerShown: !isMobile,
    // Only use custom header on web/desktop
    ...(isMobile ? {} : { header: () => <Header /> }),
    // Disable animations on mobile only
    ...(isMobile ? {
      animation: 'none' as const,
      animationDuration: 0,
      presentation: 'card' as const,
    } : {})
  };
  
  return (
    <>
      <Stack screenOptions={screenOptions}>
        {/* Define screens within the main stack here */}
        {/* Make sure files like index.tsx, login.tsx exist here */}
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Home',
            ...(isMobile ? { 
              animation: 'none' as const,
              headerShown: false 
            } : {})
          }} 
        /> 
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Login',
            ...(isMobile ? { 
              animation: 'none' as const,
              headerShown: false 
            } : {})
          }} 
        /> 
        <Stack.Screen 
          name="(protected)/index" 
          options={{ 
            ...(isMobile ? { 
              animation: 'none' as const,
              headerShown: false 
            } : { headerShown: true })
          }} 
        />
        {/* Add other main screens */} 
      </Stack>
    </>
  );
};

export default MainLayout;