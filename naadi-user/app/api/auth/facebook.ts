import { ExpoRequest, ExpoResponse } from 'expo-router/server';
import { signInWithFacebook } from '@naadi/api';

export async function POST(_request: ExpoRequest): Promise<ExpoResponse> {
  try {
    // Call the API to sign in with Facebook
    const authResponse = await signInWithFacebook();
    
    // Return the authentication response
    return new ExpoResponse(
      JSON.stringify(authResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Facebook authentication error:', error);
    return new ExpoResponse(
      JSON.stringify({ error: error.message || 'Failed to authenticate with Facebook' }),
      { 
        status: error.statusCode || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 