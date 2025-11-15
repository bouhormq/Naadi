import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { useSession } from '@naadi/hooks/ctx';
import PartnerSignupFormMain from './(components)/PartnerSignupFormMain';
import Footer from './(components)/Footer';
import Benefits from './(components)/Benefits';
import CTASection from './(components)/CTASection';
import Steps from './(components)/Steps';
import Corporate from './(components)/Corporate';
import Integrations from './(components)/Integrations';

export default function PartnersIndex() {
  const { session } = useSession();
  
  // If user is logged in as partner or admin, redirect to protected area
  if (session) {
    if (session.role === 'partner') {
      return <Redirect href="/partners/(protected)" />;
    } else if (session.role === 'admin') {
      return <Redirect href="/admin/(protected)" />;
    }
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