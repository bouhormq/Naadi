import { StyleSheet, ScrollView } from 'react-native';
import PartnerSignupForm from './(components)/PartnerSignupForm';
import Footer from './(components)/Footer';
export default function SignupScreen() {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PartnerSignupForm/>
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