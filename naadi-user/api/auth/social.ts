import { AuthResponse } from '@naadi/types';
import { storeUserData, storeAuthToken } from './session';

/**
 * Handles authentication with Google
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    // In a real implementation, we would use Expo's Google auth here
    // For now, we'll just call our server API
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sign in with Google');
    }
    
    const authResponse = await response.json();
    
    // Store the user data and auth token for later use
    await storeUserData(authResponse.user);
    await storeAuthToken(authResponse.token);
    
    return authResponse;
  } catch (error: any) {
    console.error('Google auth error:', error);
    throw new Error(error.message || 'Failed to sign in with Google');
  }
}

/**
 * Handles authentication with Facebook
 */
export async function signInWithFacebook(): Promise<AuthResponse> {
  try {
    // In a real implementation, we would use Expo's Facebook auth here
    // For now, we'll just call our server API
    const response = await fetch('/api/auth/facebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sign in with Facebook');
    }
    
    const authResponse = await response.json();
    
    // Store the user data and auth token for later use
    await storeUserData(authResponse.user);
    await storeAuthToken(authResponse.token);
    
    return authResponse;
  } catch (error: any) {
    console.error('Facebook auth error:', error);
    throw new Error(error.message || 'Failed to sign in with Facebook');
  }
}