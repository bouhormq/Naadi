import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Naadi Business</Text>
      </View>
      
      <View style={styles.content}>
        <Image 
          source={require('../assets/naadi.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>Grow Your Fitness Business</Text>
        <Text style={styles.subtitle}>
          Manage your studios, classes, and connect with more clients
        </Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.buttonText}>Sign Up Your Business</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.push('https://naadi.ma')}
        >
          <Text style={styles.linkText}>Looking for fitness classes? Go to Naadi User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 30,
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 14,
  }
}); 