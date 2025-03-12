import { AuthResponse } from '@naadi/types';

/**
 * Handles authentication with Google
 */
export async function signInWithGoogle(): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/social/google');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sign in with Google');
    }
    return await response.json() as AuthResponse;
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
    const response = await fetch('/api/auth/social/facebook');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to sign in with Facebook');
    }
    return await response.json() as AuthResponse;
  } catch (error: any) {
    console.error('Facebook auth error:', error);
    throw new Error(error.message || 'Failed to sign in with Facebook');
  }
}

// Replace with fetch calls to server-side endpoints
export async function socialAuth(
  provider: string,
  token: string
): Promise<AuthResponse> {
  try {
    const response = await fetch(`/api/auth/social/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to authenticate with social provider');
    }
    
    return await response.json() as AuthResponse;
  } catch (error: any) {
    console.error('Social auth error:', error);
    throw new Error(error.message || 'Failed to authenticate with social provider');
  }
} 