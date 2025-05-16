import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import PartnerSignupFormMain from './(components)/PartnerSignupFormMain';
import Footer from './(components)/Footer';
import Benefits from './(components)/Benefits';
import CTASection from './(components)/CTASection';
import Steps from './(components)/Steps';
import Corporate from './(components)/Corporate';
import Integrations from './(components)/Integrations';

export default function PartnersIndex() {
  const user = false; // Or your actual user check
  
  if (user) {
    return <Redirect href="/(main)" />; // Assuming '/main' is another route
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formSection}>
      <PartnerSignupFormMain/>
      </View>
      <Benefits />
      <Corporate />
      <Steps />
      <Integrations />
      <CTASection />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  formSection: {
    width: '100%',
    // Remove fixed height constraints to allow proper sizing
    backgroundColor: '#eef2f7',
  }
});