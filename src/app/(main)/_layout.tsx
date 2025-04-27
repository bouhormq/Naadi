import { Stack, Redirect, useRootNavigationState } from 'expo-router';
// Remove useEffect import if no longer needed for other purposes
// import { useEffect } from 'react'; 
import { Text } from 'react-native'; // Import Text for loading indicator
import Header from './(components)/Header';
// Remove useSession and Redirect imports if no longer needed here
// import { useSession } from '../../ctx'; 

const MainLayout = () => {
  // No longer need session checks here, handled by root layout
  // const { session, isLoading } = useSession();
  // const navigationState = useRootNavigationState();

  // Could potentially add a basic loading check if needed for visual smoothness,
  // but primary loading/redirect is in root.
  // if (!navigationState?.key) return null; // Example check

  // Render layout
  console.log("(MainLayout): Rendering stack");
  return (
    <>
      <Stack screenOptions={{ headerShown: true, header: () => <Header /> }}>
        {/* Define screens within the main stack here */}
        {/* Make sure files like index.tsx, login.tsx exist here */}
        <Stack.Screen name="index" options={{ title: 'Home' }} /> 
        <Stack.Screen name="login" options={{ title: 'Login' }} /> 
        {/* Add other main screens */} 
      </Stack>
    </>
  );
};

export default MainLayout;