import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="favourites" options={{ headerShown: false }} />
      <Stack.Screen name="myprofile" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}