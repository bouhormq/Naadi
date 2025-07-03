import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router'; // Import usePathname
import CustomText from '@/components/CustomText';
// Using relative path for ctx
import { useSession } from '@naadi/hooks/ctx'; 

export default function AdminHeader() { // Renamed component for clarity
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  // Removed width as it wasn't used in the simplified logic below
  // const { width } = useWindowDimensions();
  const { session, signOut } = useSession();

  // Simplified logo press for admin: always stay put when logged in
  const handleLogoPress = () => {
    // Only navigate if the user is NOT logged in.
    if (!session) {
      // If logged out, maybe go to main public root or partner login?
      router.push('/'); // Or '/partners/login'?
    }
  };

  // Admin header should just show logo and Log out button
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleLogoPress} style={styles.logoContainer}>
        <CustomText style={styles.logo}>naadi</CustomText>
      </TouchableOpacity>
      <View style={styles.headerButtons}>
          {/* Always show Log out button when in admin section (as user must be logged in) */}
          {session ? (
            <TouchableOpacity style={styles.button} onPress={signOut}>
              <CustomText style={styles.buttonText}>Log out</CustomText>
            </TouchableOpacity>
          ) : (
            // Should ideally not be reachable if auth logic is correct, but include fallback
            <TouchableOpacity style={styles.button} onPress={() => router.push('/partners/login')}> 
              <CustomText style={styles.buttonText}>Log in</CustomText>
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
}

// Styles copied from Partner Header, can be adjusted if needed
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  logoContainer: {},
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#2357FF',
    paddingVertical: 10, 
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'center',
    marginLeft: 10, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-end',
  },
  headerButton: {
    marginLeft: 10, 
    marginRight: 10,
    paddingVertical: 10, 
    justifyContent: 'center',
  },
}); 