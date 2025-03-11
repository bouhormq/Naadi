import { 
  googleAuth as apiGoogleAuth,
  facebookAuth as apiFacebookAuth 
} from '@naadi/api';
import { AuthResponse } from '@naadi/types';

/**
 * Handles authentication with Google
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    return await apiGoogleAuth();
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
    return await apiFacebookAuth();
  } catch (error: any) {
    console.error('Facebook auth error:', error);
    throw new Error(error.message || 'Failed to sign in with Facebook');
  }
} 