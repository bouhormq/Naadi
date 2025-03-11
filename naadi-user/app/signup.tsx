import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement actual signup with Firebase
      // For now, we'll just simulate a successful signup
      
      setTimeout(() => {
        setLoading(false);
        router.replace('/(main)');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => router.push('https://naadi.ma/business')}
      >
        <Text style={styles.linkText}>Business Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#ff3b30',
    marginBottom: 15,
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#4A90E2',
    fontSize: 16,
  },
}); 