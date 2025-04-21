import {StyleSheet, ScrollView } from 'react-native';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';
export default function SignupScreen() {

  const handleSubmit = async (data: any) => {
    console.log('Submitting contact form data:', data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ContactForm onSubmit={handleSubmit} />
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