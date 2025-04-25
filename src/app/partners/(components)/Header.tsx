import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router'; // Import usePathname
import CustomText from '@/components/CustomText';
import { useSession } from '../../../ctx';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const { width } = useWindowDimensions();
  const { session, signOut } = useSession();

  const navigateToLogin = () => {
    router.push('/partners/login');
  };

  const isLoginPage = pathname === '/partners/login'; // Check if on login page

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/partners')} style={styles.logoContainer}>
        <CustomText style={styles.logo}>naadi</CustomText>
      </TouchableOpacity>
      <View style={styles.headerButtons}>
        {isLoginPage ? (
          // On login page, only show "How it works" if width allows
          width > 360 && (
            <TouchableOpacity onPress={() => router.push('/partners/how-it-works')} style={styles.headerButton}>
              <CustomText style={styles.menuItemText}>How it works</CustomText>
            </TouchableOpacity>
          )
        ) : (
          // Original logic for other pages
          <>
            {/* Show "How it works" only if width > 360 AND user is not logged in */}
            {width > 360 && !session && (
              <TouchableOpacity onPress={() => router.push('/partners/how-it-works')} style={styles.headerButton}>
                <CustomText style={styles.menuItemText}>How it works</CustomText>
              </TouchableOpacity>
            )}
            {/* Show "Sign up" only if user is not logged in */}
            {!session && (
              <TouchableOpacity onPress={() => router.push('/partners/signup')} style={styles.headerButton}>
                <CustomText style={styles.menuItemText}>Sign up</CustomText>
              </TouchableOpacity>
            )}
            {/* Show Log out/Log in based on session status */}
            {session ? (
              <TouchableOpacity style={styles.button} onPress={signOut}>
                <CustomText style={styles.buttonText}>Log out</CustomText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={navigateToLogin}>
                <CustomText style={styles.buttonText}>Log in</CustomText>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10, // This padding contributes to the overall header height
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    // minHeight: 60, // Example: Or set a minimum height if needed, adjust value as necessary
  },
  logoContainer: {
    // Adjust flex to allow more space for buttons if needed
    // flex: 1,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  // Removed unused menuItems style
  // menuItems: {
  //   flex: 1,
  //   padding: 15,
  // },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#2357FF',
    paddingVertical: 10, // This padding contributes to the button's height
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: 'center',
    marginLeft: 10, // Keep consistent spacing
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically aligns items in the container
    justifyContent: 'flex-end',
    // Allow buttons to take necessary space
    // flex: 2, // Removed fixed flex to allow natural sizing
  },
  headerButton: {
    marginLeft: 10, // Consistent spacing between buttons
    marginRight: 10,
    paddingVertical: 10, // Match button's vertical padding to maintain consistent height contribution
    // Ensure the touchable area is centered if needed, although alignItems on parent helps
    justifyContent: 'center',
  },
});