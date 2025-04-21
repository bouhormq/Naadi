import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import BusinessSignupFormMain from '../components/BusinessSignupFormMain';
import { BusinessSignupRequest } from '@naadi/types';
import Footer from '../components/Footer';
import Benefits from '../components/Benefits';
import CTASection from 'components/CTASection';
import Steps from 'components/Steps';
import Corporate from 'components/Corporate';
import Integrations from 'components/Integrations';

const App = () => {
  const user = false; // Or your actual user check

  if (user) {
    return <Redirect href="/(main)" />; // Assuming '/main' is another route
  }

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
      <BusinessSignupFormMain onSubmit={handleSubmit} />
      <Benefits/>
      <Corporate/>
      <Steps/>
      <Integrations/>
      <CTASection/>
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
}); 

export default App;