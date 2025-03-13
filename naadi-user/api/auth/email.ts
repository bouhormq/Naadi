import { AuthResponse } from '@naadi/types';
import { getIdToken, storeUserData, storeAuthToken } from './session';

/**
 * Handles user signup with email/password
 */
export async function signupWithEmail(
  email: string, 
  password: string, 
  displayName?: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, displayName })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sign up with email');
    }
    
    const authResponse = await response.json();
    
    // Store the user data and auth token for later use
    await storeUserData(authResponse.user);
    await storeAuthToken(authResponse.token);
    
    return authResponse;
  } catch (error: any) {
    console.error('Email signup error:', error);
    throw new Error(error.message || 'Failed to sign up with email');
  }
}

/**
 * Handles user login with email/password
 */
export async function loginWithEmail(
  email: string, 
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to login with email');
    }
    
    const authResponse = await response.json();
    
    // Store the user data and auth token for later use
    await storeUserData(authResponse.user);
    await storeAuthToken(authResponse.token);
    
    return authResponse;
  } catch (error: any) {
    console.error('Email login error:', error);
    throw new Error(error.message || 'Failed to login with email');
  }
}

/**
 * Sends a password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send password reset email');
    }
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
  }
} 