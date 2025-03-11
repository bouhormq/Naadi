import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// This layout serves as the root layout for the entire app
export default function RootLayout() {
  // You can add global state management here, like authentication state

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Naadi',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Log In',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: 'Sign Up',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="(main)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: 'Settings',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
} 