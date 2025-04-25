  import { Stack } from 'expo-router';
  import Header from './(components)/Header'; // Ensure the path is correct

  const PartnerLayout = () => {
    return (
      <Stack 
        screenOptions={{ 
          // Apply the custom header to all screens in this stack
          header: () => <Header />, 
          // You might want to show the header by default now
          // headerShown: true, // Uncomment if you want the header bar space
        }}
      >
        {/* Remove the header prop from individual screens if using screenOptions */}
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="contact" options={{ title: 'Contact' }} />
        <Stack.Screen name="faq" options={{ title: 'FAQ' }} />
        <Stack.Screen name="how-it-works" options={{ title: 'How It Works' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Signup' }} />
      </Stack>
    );
  };

  export default PartnerLayout;