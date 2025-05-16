import { Stack, Redirect, useRootNavigationState } from 'expo-router';
// Remove useEffect import if no longer needed for other purposes
// import { useEffect } from 'react'; 
import { Text, Platform } from 'react-native'; // Import Text for loading indicator and Platform for OS detection
import Header from './(components)/Header'; // Ensure the path is correct
// Remove useSession and Redirect imports if no longer needed here
// import { useSession } from '../../ctx'; 

const PartnerLayout = () => {
  // No longer need session checks here, handled by root layout
  // const { session, isLoading } = useSession();
  // const navigationState = useRootNavigationState();

  // Could potentially add a basic loading check if needed
  // if (!navigationState?.key) return null; 

  // Detect if on mobile platform
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  // Render layout
  console.log(`(PartnerLayout): Rendering stack, isMobile: ${isMobile}`);
  
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
    <Stack 
      screenOptions={screenOptions}
    >
      {/* Define partner screens here */}
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
        name="contact" 
        options={{ 
          title: 'Contact',
          ...(isMobile ? { 
            animation: 'none' as const,
            headerShown: false 
          } : {})
        }} 
      />
      <Stack.Screen 
        name="faq" 
        options={{ 
          title: 'FAQ',
          ...(isMobile ? { 
            animation: 'none' as const,
            headerShown: false 
          } : {})
        }} 
      />
      <Stack.Screen 
        name="how-it-works" 
        options={{ 
          title: 'How It Works',
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
        name="signup" 
        options={{ 
          title: 'Signup',
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
      {/* Add other partner screens */} 
    </Stack>
  );
};

export default PartnerLayout;