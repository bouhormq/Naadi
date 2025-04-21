import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Image
} from 'react-native';


export default function Corporate() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}><Text style={styles.scaleText}>Unlock</Text> even more revenue with{'\n'} corporate clients</Text>
      <Text style={styles.subtitle}>
        Many companies will soon offer Naadi as a benefit to employees, meaning you’ll{'\n'} get more eyes on your business and more cash in your pocket.
      </Text>
      <Image 
        source={require('../(assets)/corp.png')} // Path to your image
        style={styles.corporateImage} // Apply styling
        resizeMode="contain" // Maintain aspect ratio
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f7ff',
    paddingVertical: 70,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  corporateImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#0077ff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scaleText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});