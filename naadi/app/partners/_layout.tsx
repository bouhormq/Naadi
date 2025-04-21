import { Stack } from 'expo-router';
import Header from './(components)/Header';

const PartnerLayout = () => {
  return (
    <>
      <Header />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="contact" options={{ title: 'Contact' }} />
        <Stack.Screen name="faq" options={{ title: 'FAQ' }} />
        <Stack.Screen name="how-it-works" options={{ title: 'How It Works' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="signup" options={{ title: 'Signup' }} />
      </Stack>
    </>
  );
};

export default PartnerLayout;