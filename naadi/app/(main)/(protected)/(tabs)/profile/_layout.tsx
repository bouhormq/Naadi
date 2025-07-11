import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="favourites" />
      <Stack.Screen name="vouchers" />
      <Stack.Screen name="my-profile" />
      <Stack.Screen name="memberships" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="my-profile/editProfile" options={{ presentation: 'modal' }} />
      <Stack.Screen name="delete-account" />
      <Stack.Screen name="delete-account-confirm" />
      <Stack.Screen name="delete-account-final" />
      <Stack.Screen name="delete-account-success" />
    </Stack>
  );
}