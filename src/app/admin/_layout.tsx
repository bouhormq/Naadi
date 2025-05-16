// Remove useEffect import if no longer needed for other purposes
// import { useEffect } from 'react'; 
import { Stack, Redirect, useRootNavigationState } from 'expo-router';
// Remove Firebase imports
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Text, Platform } from 'react-native'; // Import Text for loading indicator

// Remove useSession and Redirect imports if no longer needed here
// import { useSession } from '../../ctx'; 
// Import the admin-specific Header component
import Header from './(components)/Header'; // Updated path

// const ADMIN_EMAIL = "bouhormq@gmail.com"; // No longer needed here

export default function AdminLayout() {
  // No longer need session checks here, handled by root layout
  // const { session, isLoading } = useSession(); 
  // const navigationState = useRootNavigationState();
  
  // Could potentially add a basic loading check if needed
  // if (!navigationState?.key) return null; 

  // Detect if on mobile platform
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  // Render layout
  console.log(`(AdminLayout): Rendering stack, isMobile: ${isMobile}`);
  
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
    <Stack screenOptions={screenOptions}>
      {/* Define screen for the protected index route */}
      <Stack.Screen 
        name="(protected)/index" // Reference the protected index file
        options={{
          title: 'Admin Dashboard',
          ...(isMobile ? { 
            animation: 'none' as const,
            headerShown: false 
          } : {})
        }} 
      />
      {/* Add other admin screens here (likely within (protected) too) */}
      {/* Example: <Stack.Screen name="(protected)/users" options={{...}} /> */}
    </Stack>
  );
} 