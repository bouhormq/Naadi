import { View, StyleSheet, ScrollView } from 'react-native';
import { BusinessSignupRequest } from '@naadi/types';
import HeroSection from '../components/HeroSection';
import BusinessSignupForm from '../components/BusinessSignupForm';
import SmartToolsSection from '../components/SmartTools';
import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
export default function SignupScreen() {



  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FAQSection />
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
}); 