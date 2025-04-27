import { StyleSheet, ScrollView } from 'react-native';
import HeroSection from './(components)/HeroSection';
import PartnerSignupForm from './(components)/PartnerSignupForm';
import SmartToolsSection from './(components)/SmartTools';
import FAQSection from './(components)/FAQSection';
import CTASection from './(components)/CTASection';
import Footer from './(components)/Footer';
export default function SignupScreen() {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeroSection /> 
      <SmartToolsSection />
      <PartnerSignupForm />
      <FAQSection />
      <CTASection />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
}); 