import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { BusinessSignupRequest } from '@naadi/types';
import BusinessSignupForm from '../components/BusinessSignupForm';

export default function SignupScreen() {
  const router = useRouter();

  const handleSubmit = async (data: BusinessSignupRequest) => {
    // TODO: Implement actual signup with Firebase
    // For now, we'll just simulate a successful signup and
    // redirect to the main business dashboard
    console.log('Submitting business signup data:', data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to business dashboard
    router.replace('/(main)');
  };

  return (
    <View style={styles.container}>
      <BusinessSignupForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
}); 