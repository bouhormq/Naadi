import { StyleSheet, ScrollView, Text, View } from 'react-native';
import Footer from './(components)/Footer'; // Assuming this path is correct
// Import the PartnerSignupFormContent component
import ContactForm from './(components)/ContactForm'; // Adjust this path based on your file structure

export default function ContactScreen() {

  // Remove the handleSubmit function as PartnerSignupFormContent handles its own submission logic
  // const handleSubmit = async (data: any) => {
  //   console.log('Submitting contact form data:', data);
  // };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {/* Updated header text for a partner contact form */}
        <Text style={styles.title}>
          Contact Us for Business <Text style={styles.highlight}>Inquiries</Text>
        </Text>
        <Text style={styles.subtitle}>
          Have questions about listing your business or partnering with Naadi? Fill out the form below.
        </Text>
      </View>
      <ContactForm />
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  highlight: {
    color: '#0077ff',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});