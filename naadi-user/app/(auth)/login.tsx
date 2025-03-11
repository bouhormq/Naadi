import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { router, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import {
  loginWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  getGoogleRedirectResult,
  initRecaptcha,
  storeUserData,
  storeAuthToken
} from '../../utils/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'social'>('email');
  
  // Reference for recaptcha container
  const recaptchaContainerRef = useRef<View>(null);
  
  useEffect(() => {
    // Check for redirect result on web
    if (Platform.OS === 'web') {
      checkRedirectResult();
    }
    
    // Initialize recaptcha for phone auth on web
    if (Platform.OS === 'web' && recaptchaContainerRef.current) {
      initRecaptcha('recaptcha-container');
    }
  }, []);
  
  // Check for Google redirect result
  const checkRedirectResult = async () => {
    try {
      const user = await getGoogleRedirectResult();
      if (user) {
        // User is signed in, redirect to home
        setLoading(false);
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Redirect error:', error);
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle email login
  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await loginWithEmail(email, password);
      
      // Store user data and token
      if (response && response.user) {
        await storeUserData(response.user);
        if (response.token) {
          await storeAuthToken(response.token);
        }
        
        // Navigate to the main app
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await signInWithGoogle();
      
      // For web with redirect, we don't get an immediate response
      if (response && response.user) {
        // Store user data and token
        await storeUserData(response.user);
        if (response.token) {
          await storeAuthToken(response.token);
        }
        
        // Navigate to the main app
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setError(error.message || 'Google login failed. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle Facebook login
  const handleFacebookLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await signInWithFacebook();
      
      // For web with redirect, we don't get an immediate response
      if (response && response.user) {
        // Store user data and token
        await storeUserData(response.user);
        if (response.token) {
          await storeAuthToken(response.token);
        }
        
        // Navigate to the main app
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setError(error.message || 'Facebook login failed. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle phone verification
  const handleSendVerificationCode = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Format phone number to E.164 format
      const formattedPhoneNumber = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+${phoneNumber}`;
      
      // Get the recaptcha verifier instance
      const recaptchaVerifier = Platform.OS === 'web' ? window.recaptchaVerifier : null;
      
      const result = await sendPhoneVerificationCode(formattedPhoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
    } catch (error: any) {
      setError(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle verification code submission
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError('Please enter a valid verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await verifyPhoneCode(confirmationResult, verificationCode);
      
      // Store user data and token
      if (response && response.user) {
        await storeUserData(response.user);
        if (response.token) {
          await storeAuthToken(response.token);
        }
        
        // Navigate to the main app
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render email form
  const renderEmailForm = () => (
    <View style={styles.formContainer}>
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
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleEmailLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/forgot-password')}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render phone form
  const renderPhoneForm = () => (
    <View style={styles.formContainer}>
      {!confirmationResult ? (
        // Phone number input
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number (with country code, e.g. +1234567890)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSendVerificationCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        // Verification code input
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleVerifyCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify Code</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setConfirmationResult(null)}>
            <Text style={styles.linkText}>Change Phone Number</Text>
          </TouchableOpacity>
        </>
      )}
      
      {/* Hidden div for recaptcha */}
      {Platform.OS === 'web' && (
        <div id="recaptcha-container" style={{ display: 'none' }}></div>
      )}
    </View>
  );
  
  // Render social login buttons
  const renderSocialButtons = () => (
    <View style={styles.socialButtonsContainer}>
      <TouchableOpacity 
        style={[styles.socialButton, styles.googleButton]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        <FontAwesome name="google" size={20} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.socialButton, styles.facebookButton]}
        onPress={handleFacebookLogin}
        disabled={loading}
      >
        <FontAwesome name="facebook" size={20} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Login to Naadi</Text>
        <Text style={styles.subtitle}>Access your account</Text>
      </View>
      
      {/* Auth method tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'email' && styles.activeTab]}
          onPress={() => setAuthMethod('email')}
        >
          <Text style={[styles.tabText, authMethod === 'email' && styles.activeTabText]}>
            Email
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'phone' && styles.activeTab]}
          onPress={() => setAuthMethod('phone')}
        >
          <Text style={[styles.tabText, authMethod === 'phone' && styles.activeTabText]}>
            Phone
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'social' && styles.activeTab]}
          onPress={() => setAuthMethod('social')}
        >
          <Text style={[styles.tabText, authMethod === 'social' && styles.activeTabText]}>
            Social
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Display error message if any */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {/* Auth form based on selected method */}
      {authMethod === 'email' && renderEmailForm()}
      {authMethod === 'phone' && renderPhoneForm()}
      {authMethod === 'social' && renderSocialButtons()}
      
      {/* Sign up link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link href="/signup" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#4a90e2',
  },
  tabText: {
    fontWeight: '500',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 15,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  googleButton: {
    backgroundColor: '#db4437',
  },
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#666',
  },
  linkText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
}); 