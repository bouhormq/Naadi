// ... existing code ...
import { 
  View, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import CustomText from '@/components/CustomText';


export default function CTASection() {
  const router = useRouter();
  const pathname = usePathname()
  const isHomePage = pathname === '/partners'; // Check if the current route is '/'

  return (
    <View style={[
      styles.container,
      isHomePage ? styles.homeContainer : null // Apply different style if it's the home page
    ]}>
      <CustomText style={styles.title}>What are you waiting for?</CustomText>
      <CustomText style={styles.subtitle}>
        Join other businesses who trust Naadi to reduce costs and increase revenue.
      </CustomText>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/partners/signup')}>
        <CustomText style={styles.buttonText}>Get Started</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 70,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  homeContainer: { // Style for the home page
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#0077ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});