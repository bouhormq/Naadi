// Remove useEffect import if no longer needed for other purposes
// import { useEffect } from 'react'; 
import { Stack, Redirect, useRootNavigationState } from 'expo-router';
// Remove Firebase imports
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Text } from 'react-native'; // Import Text for loading indicator

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

  // Render layout
  console.log("(AdminLayout): Rendering stack");
  return (
    <Stack>
      {/* Define screen for the protected index route */}
      <Stack.Screen 
        name="(protected)/index" // Reference the protected index file
        options={{
          title: 'Admin Dashboard',
          header: () => <Header />,
        }} 
      />
      {/* Add other admin screens here (likely within (protected) too) */}
      {/* Example: <Stack.Screen name="(protected)/users" options={{...}} /> */}
    </Stack>
  );
} 