import { AuthResponse } from '@naadi/types';
import { ApiError } from '../../utils/apiError';
import { googleAuth, facebookAuth } from './providers';

/**
 * Handles Google authentication
 * @returns AuthResponse with user information and token
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    return await googleAuth();
  } catch (error) {
    console.error('Google sign-in error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to sign in with Google', 500);
  }
}

/**
 * Handles Facebook authentication
 * @returns AuthResponse with user information and token
 */
export async function signInWithFacebook(): Promise<AuthResponse> {
  try {
    return await facebookAuth();
  } catch (error) {
    console.error('Facebook sign-in error:', error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Failed to sign in with Facebook', 500);
  }
} 