import { View, StyleSheet, ScrollView } from 'react-native';
import FAQSection from './(components)/FAQSection';
import Footer from './(components)/Footer';
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