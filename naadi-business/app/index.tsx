import { Redirect, Stack } from 'expo-router';
const App = () => {
  const user = false; // Or your actual user check

  if (user) {
    return <Redirect href="/(main)" />; // Assuming '/main' is another route
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="contact" options={{ title: 'Contact', headerShown: false }} />
        <Stack.Screen name="faq" options={{ title: 'FAQ', headerShown: false }} />
        <Stack.Screen name="how-it-works" options={{ title: 'How It Works', headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: 'Signup', headerShown: false }} />
      </Stack>
    </>
  );
};

export default App;