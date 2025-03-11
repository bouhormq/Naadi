import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { router, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  signupWithEmail,
  signInWithGoogle,
  signInWithFacebook,
  sendPhoneVerificationCode,
  verifyPhoneCode,
  getGoogleRedirectResult,
  initRecaptcha,
  storeUserData,
  storeAuthToken
} from '../../utils/auth';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'social'>('email');
  const recaptchaContainerRef = useRef(null);
  
  useEffect(() => {
    // Initialize recaptcha for web phone auth
    if (Platform.OS === 'web' && recaptchaContainerRef.current) {
      initRecaptcha(recaptchaContainerRef.current);
    }
    
    // Check for redirect result on web platforms
    checkRedirectResult();
  }, []);
  
  const checkRedirectResult = async () => {
    if (Platform.OS === 'web') {
      try {
        const user = await getGoogleRedirectResult();
        if (user) {
          // Successfully signed up after redirect
          setLoading(false);
          router.replace('/(tabs)');
        }
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
  };
  
  const handleEmailSignup = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await signupWithEmail(email, password, displayName);
      
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
      let errorMessage = 'Signup failed. Please try again.';
      if (error.message.includes('email-already-in-use')) {
        errorMessage = 'This email is already registered. Please log in instead.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignup = async () => {
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
      setError(error.message || 'Google signup failed. Please try again.');
      setLoading(false);
    }
  };
  
  const handleFacebookSignup = async () => {
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
      setError(error.message || 'Facebook signup failed. Please try again.');
      setLoading(false);
    }
  };
  
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
  
  const renderEmailForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Enter your name"
        autoCapitalize="words"
      />
      
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleEmailSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
  
  const renderPhoneForm = () => (
    <View style={styles.formContainer}>
      {!confirmationResult ? (
        <>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number (e.g. +12345678901)"
            keyboardType="phone-pad"
          />
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSendVerificationCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Send Verification Code</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={styles.input}
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            maxLength={6}
          />
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleVerifyCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify & Create Account</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setConfirmationResult(null)}>
            <Text style={styles.changePhoneText}>Change Phone Number</Text>
          </TouchableOpacity>
        </>
      )}
      
      {/* Hidden div for reCAPTCHA on web */}
      {Platform.OS === 'web' && (
        <div ref={recaptchaContainerRef} style={{ display: 'none' }} />
      )}
    </View>
  );
  
  const renderSocialButtons = () => (
    <View style={styles.socialContainer}>
      <TouchableOpacity 
        style={[styles.socialButton, styles.googleButton]}
        onPress={handleGoogleSignup}
        disabled={loading}
      >
        <Ionicons name="logo-google" size={24} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.socialButton, styles.facebookButton]}
        onPress={handleFacebookSignup}
        disabled={loading}
      >
        <Ionicons name="logo-facebook" size={24} color="#fff" />
        <Text style={styles.socialButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Sign up to get started</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'email' && styles.activeTab]}
          onPress={() => setAuthMethod('email')}
        >
          <Text style={styles.tabText}>Email</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'phone' && styles.activeTab]}
          onPress={() => setAuthMethod('phone')}
        >
          <Text style={styles.tabText}>Phone</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, authMethod === 'social' && styles.activeTab]}
          onPress={() => setAuthMethod('social')}
        >
          <Text style={styles.tabText}>Social</Text>
        </TouchableOpacity>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      {authMethod === 'email' && renderEmailForm()}
      {authMethod === 'phone' && renderPhoneForm()}
      {authMethod === 'social' && renderSocialButtons()}
      
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text style={styles.loginText}>Log In</Text>
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
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginTop: 60,
    marginBottom: 30,
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontWeight: '500',
    color: '#444',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  changePhoneText: {
    color: '#6200ee',
    textAlign: 'center',
    fontSize: 16,
  },
  socialContainer: {
    marginTop: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  errorText: {
    color: '#B00020',
    marginBottom: 15,
    textAlign: 'center',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  loginText: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: '600',
  },
}); 