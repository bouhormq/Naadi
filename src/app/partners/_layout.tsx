import { Stack, Redirect, useRootNavigationState } from 'expo-router';
// Remove useEffect import if no longer needed for other purposes
// import { useEffect } from 'react'; 
import { Text } from 'react-native'; // Import Text for loading indicator
import Header from './(components)/Header'; // Ensure the path is correct
// Remove useSession and Redirect imports if no longer needed here
// import { useSession } from '../../ctx'; 

const PartnerLayout = () => {
  // No longer need session checks here, handled by root layout
  // const { session, isLoading } = useSession();
  // const navigationState = useRootNavigationState();

  // Could potentially add a basic loading check if needed
  // if (!navigationState?.key) return null; 

  // Render layout
  console.log("(PartnerLayout): Rendering stack");
  return (
    <Stack 
      screenOptions={{ 
        // Apply the custom header to all screens in this stack
        header: () => <Header />, 
        // You might want to show the header by default now
        // headerShown: true, // Uncomment if you want the header bar space
      }}
    >
      {/* Define partner screens here */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="contact" options={{ title: 'Contact' }} />
      <Stack.Screen name="faq" options={{ title: 'FAQ' }} />
      <Stack.Screen name="how-it-works" options={{ title: 'How It Works' }} />
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Signup' }} />
      {/* Add other partner screens */} 
    </Stack>
  );
};

export default PartnerLayout;