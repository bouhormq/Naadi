import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header />
      
      <View style={styles.content}>
        <Image 
          source={require('../assets/naadi.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Find Your Perfect Fitness Space</Text>
        <Text style={styles.subtitle}>
          Discover and book fitness studios near you
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/(main)')}
          >
            <Text style={styles.buttonText}>Browse Map</Text>
          </TouchableOpacity>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.secondaryButtonText}>Log In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    width: '48%',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
}); 