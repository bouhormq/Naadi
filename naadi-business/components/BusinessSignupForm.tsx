import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { BusinessSignupRequest } from '@naadi/types';

interface BusinessSignupFormProps {
  onSubmit: (data: BusinessSignupRequest) => Promise<void>;
}

export default function BusinessSignupForm({ onSubmit }: BusinessSignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password || !businessName || !phone || !address) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await onSubmit({
        email,
        password,
        businessName,
        contactInfo: {
          phone,
          address
        }
      });
      
      // Navigate to business main screen on success
      router.replace('/(main)');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Signup</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Business Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
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
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  link: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 20,
  },
}); 