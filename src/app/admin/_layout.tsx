import { useEffect } from 'react'; // Keep useEffect if needed for other things
import { Stack, useRouter, Redirect } from 'expo-router';
// Remove Firebase imports
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Text } from 'react-native'; // Import Text for loading indicator

// Import the useSession hook
import { useSession } from '../../ctx'; // Adjust path if needed
// Import the shared Header component
import Header from '../partners/(components)/Header'; // Adjust path if necessary

const ADMIN_EMAIL = "bouhormq@gmail.com";

export default function AdminLayout() {
  // Destructure session which now contains { email, role } or null
  const { session, isLoading, signOut } = useSession(); // Use the session hook
  const router = useRouter();

  // Check authentication and admin status using the session context
  useEffect(() => {
    if (isLoading) return; // Wait until session loading is complete

    const isAdmin = session?.email === ADMIN_EMAIL;

    if (!session || !isAdmin) {
      // If not loading, and no session OR the user is not the admin
      console.log(`AdminLayout: Redirecting. isLoading: ${isLoading}, session: ${JSON.stringify(session)}, isAdmin: ${isAdmin}`);
      // Redirect non-admins away
      // Decide the appropriate redirect target (e.g., partner login or main page)
      router.replace('/partners/login'); // Example: Redirect to partner login
    }
  }, [isLoading, session, router]);

  // Show loading state while checking auth from context
  if (isLoading) {
    console.log('AdminLayout: isLoading state is true.');
    return <Text>Loading...</Text>; // Basic loading indicator
  }

  // If, after loading, the user is definitely not the admin, redirect.
  // This ensures immediate redirect without waiting for useEffect.
  if (!session || session.email !== ADMIN_EMAIL) {
    console.log('AdminLayout: No session or not admin after loading, rendering Redirect.');
    return <Redirect href="/partners/login" />; // Example redirect
  }

  // User is authenticated and is the admin
  console.log('AdminLayout: Admin verified, rendering stack.');
  return (
    <Stack>
      {/* Example: Add a sign out button to the header */}
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Admin Dashboard',
          // Remove headerRight
          // headerRight: () => <Text onPress={signOut} style={{ marginRight: 10, color: 'blue' }}>Sign Out</Text>
          // Use the shared Header component
          header: () => <Header />,
        }} 
      />
      {/* Add other admin screens here if needed */}
    </Stack>
  );
} 