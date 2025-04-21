import { StyleSheet, ScrollView } from 'react-native';
import { BusinessSignupRequest } from '@naadi/types';
import BusinessSignupForm from './(components)/BusinessSignupForm';
import Footer from './(components)/Footer';
export default function SignupScreen() {

  const handleSubmit = async (data: BusinessSignupRequest) => {
    try {
      console.log('Submitting partner signup data:', data);

      const response = await fetch('https://api-3k2a2q5awq-no.a.run.app/register-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Signup successful:', result);

    } catch (error) {
      console.error('Signup error:', error);
      throw error; // Re-throw the error to handle it in the BusinessSignupForm component
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BusinessSignupForm onSubmit={handleSubmit} />
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